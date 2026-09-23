import {useCallback, useEffect, useMemo, useRef} from "react";
import {createPortal} from "react-dom";

import {copyCourseText} from "../services/courseShare.js";

const paths = {
  telegram: <path d="M21.4 3.6 18.2 19c-.2 1.1-.8 1.4-1.7.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.8 12.8.9 11.3c-1.1-.3-1.1-1.1.2-1.6L20 2.4c.9-.3 1.7.2 1.4 1.2Z" />,
  whatsapp: <path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.8L.3 23.7l6-1.6A11.8 11.8 0 0 0 20.5 3.5Zm-8.3 17.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4a9.8 9.8 0 1 1 8.2 4.5Zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.3-.6c.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5H7.6c-.3 0-.6.1-.9.4-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 1.8-.8 2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z" />,
  linkedin: <path d="M5.2 7.7H1.6V22h3.6V7.7ZM3.4 2A2.1 2.1 0 1 0 3.4 6a2.1 2.1 0 0 0 0-4ZM22.4 13.8c0-4.3-2.3-6.3-5.4-6.3a4.6 4.6 0 0 0-4.2 2.3V7.7H9.2V22h3.6v-7.1c0-1.9.4-3.7 2.7-3.7 2.3 0 2.3 2.1 2.3 3.8v7h3.6l1-8.2Z" />,
  email: <path d="M2 5h20v14H2V5Zm2 2v.3l8 5.5 8-5.5V7H4Zm16 10V9.7l-8 5.5-8-5.5V17h16Z" />,
  embed: <path d="m8.5 6-6 6 6 6 1.4-1.4L5.3 12l4.6-4.6L8.5 6Zm7 0-1.4 1.4 4.6 4.6-4.6 4.6 1.4 1.4 6-6-6-6Z" />,
  x: <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.3-8.4L3 2h6.3l4.4 5.8L18.9 2Zm-1.1 17.9h1.7L8.4 4H6.6l11.2 15.9Z" />,
  messenger: <path d="M12 2C6.4 2 2 6.1 2 11.3c0 3 1.5 5.7 3.9 7.4V22l3-1.6c1 .3 2 .4 3.1.4 5.6 0 10-4.1 10-9.3S17.6 2 12 2Zm1 12.5-2.5-2.7-4.9 2.7 5.4-5.8 2.5 2.7 4.9-2.7-5.4 5.8Z" />,
  copy: <path d="M8 8V3h13v13h-5v5H3V8h5Zm2 0h6v6h3V5h-9v3Zm4 2H5v9h9v-9Z" />,
};

function BrandIcon({name}) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function CourseShareDialog({course, href, onClose}) {
  const layerRef = useRef(null);
  const closeRef = useRef(null);
  const closeTimer = useRef(null);
  const onCloseRef = useRef(onClose);
  const url = useMemo(() => new URL(href, window.location.origin).href, [href]);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(course.title);
  const embed = `<iframe src="${url}" title="${course.title.replaceAll('"', "&quot;")}" loading="lazy"></iframe>`;

  const choices = [
    ["telegram", "Telegram", `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`],
    ["whatsapp", "WhatsApp", `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`],
    ["linkedin", "LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
    ["email", "Email", `mailto:?subject=${encodedTitle}&body=${encodedUrl}`],
    ["x", "X", `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`],
    ["messenger", "Messenger", `fb-messenger://share/?link=${encodedUrl}`],
  ];

  const requestClose = useCallback(() => {
    const layer = layerRef.current;
    if (!layer || layer.classList.contains("is-closing")) return;
    layer.classList.remove("is-visible");
    layer.classList.add("is-closing");
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => onCloseRef.current(), 700);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      layerRef.current?.classList.add("is-visible");
      closeRef.current?.focus();
    });
    const key = (event) => event.key === "Escape" && requestClose();
    document.addEventListener("keydown", key);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(closeTimer.current);
      document.removeEventListener("keydown", key);
    };
  }, [requestClose]);

  const copy = (kind) => copyCourseText(
    kind === "embed" ? embed : url,
    kind === "embed" ? "Embed code copied." : "Course link copied.",
  );

  return createPortal(
    <div ref={layerRef} className="inlearn-share-layer" onClick={(event) => event.stopPropagation()}>
      <button className="inlearn-share-backdrop" type="button" aria-label="Close share options" onClick={requestClose} />
      <section className="inlearn-share-dialog" role="dialog" aria-modal="true" aria-labelledby="inlearn-share-title">
        <header className="inlearn-share-head">
          <div>
            <p className="inlearn-share-kicker">Share course</p>
            <h2 id="inlearn-share-title">{course.title}</h2>
          </div>
          <button ref={closeRef} type="button" className="inlearn-share-close" onClick={requestClose} aria-label="Close">×</button>
        </header>
        <div className="inlearn-share-grid">
          {choices.map(([icon, label, target]) => (
            <a key={label} href={target} target={icon === "email" || icon === "messenger" ? undefined : "_blank"} rel="noopener noreferrer">
              <span className={`is-${icon}`}><BrandIcon name={icon} /></span>{label}
            </a>
          ))}
          <button type="button" onClick={() => copy("embed")}><span className="is-embed"><BrandIcon name="embed" /></span>Embed</button>
          <button type="button" onClick={() => copy("link")}><span className="is-copy"><BrandIcon name="copy" /></span>Copy link</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default CourseShareDialog;
