import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

import {CloseIcon, DocumentIcon} from "./courseIcons.jsx";
import {MEDIA, openMedia} from "../../../services/learning.js";

/* Watching, listening or reading one session, over the page.
 *
 * The address is asked for when this opens and never before: it is a ticket
 * that lasts two minutes, so one fetched with the course list would already be
 * dead by the time anybody pressed play.
 *
 * controlsList and the context menu are closed off. That does not make the
 * file safe - anything that can be watched can be recorded, and pretending
 * otherwise would be the lie - it just means the browser stops offering a
 * download to somebody who was not looking for one.
 */

/* How far the two skip buttons move. Ten seconds is the step every player
   people already use has settled on, so it needs no label beyond the number. */
const SKIP_SECONDS = 10;

function SkipIcon({back = false}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={back ? {transform: "scaleX(-1)"} : undefined}
    >
      <path d="M12 5V2.5L15.5 6 12 9.5V7a5.5 5.5 0 1 0 5.5 5.5" />
    </svg>
  );
}

function MediaDialog({courseId, session, kind, onClose}) {
  const [source, setSource] = useState("");
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(kind !== MEDIA.notes);
  /* Nothing here is reset on the way in, because nothing needs to be: this
     dialog is mounted for one session and one kind and thrown away when it
     closes, so every visit starts from these values already. */
  const closeRef = useRef(null);
  const playerRef = useRef(null);
  const layerRef = useRef(null);
  const closeTimer = useRef(0);
  const onCloseRef = useRef(onClose);
  const isNotes = kind === MEDIA.notes;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const requestClose = () => {
    const layer = layerRef.current;
    if (!layer || layer.classList.contains("is-closing")) return;
    layer.classList.remove("is-visible");
    layer.classList.add("is-closing");
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => onCloseRef.current(), 720);
  };

  useEffect(() => {
    const showId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => layerRef.current?.classList.add("is-visible"));
    });
    const focusId = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKeyDown = (event) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);

    /* The page behind must not scroll while this is over it - a wheel here
       should move the notes, not the dashboard underneath them. */
    const {overflow} = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(showId);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(focusId);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    if (isNotes) {
      return () => {
        isCurrent = false;
      };
    }

    const work = openMedia(courseId, session.id, kind).then((url) => {
      if (isCurrent) setSource(url);
    });

    work
      .catch((error) => {
        if (isCurrent) setProblem(error.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [courseId, session.id, kind, isNotes]);

  const openNote = async (file) => {
    setProblem("");
    try {
      const url = await openMedia(courseId, session.id, MEDIA.notes, file.id);

      /* Put in the document before it is pressed. A detached anchor is
         ignored by some browsers, and this one has to survive whichever the
         student happens to be using; it is taken out again straight after so
         nothing is left behind.

         A new tab rather than a download, because the address is a ticket good
         for two minutes and a tab opens on it immediately - and because a PDF
         is something people read where they are rather than file away. */
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setProblem(error.message);
    }
  };

  const skip = (seconds) => {
    const player = playerRef.current;
    if (!player) return;
    /* Clamped at both ends, or the player lands past its own duration and the
       browser decides for itself where that is. */
    const next = Math.min(
      Math.max(player.currentTime + seconds, 0),
      Number.isFinite(player.duration) ? player.duration : Number.MAX_SAFE_INTEGER,
    );
    player.currentTime = next;
  };

  const title = {video: "Video", audio: "Audio", notes: "Notes"}[kind] ?? "Session";

  /* Rendered into the body rather than where it sits in the tree.
   *
   * The dashboard's layout carries a z-index of its own, which makes it a
   * stacking context - and inside one, no z-index can reach past its parent.
   * A dialog left in there was stuck underneath the navbar however high its
   * own number went. A portal takes it out to where the numbers mean what they
   * say. */
  return createPortal(
    <div ref={layerRef} className="inlearn-media-layer">
      <button
        type="button"
        className="inlearn-media-backdrop"
        aria-label="Close"
        onClick={requestClose}
      />

      <div
        className={`inlearn-media-dialog is-${kind}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — ${session.title}`}
      >
        <header className="inlearn-media-head">
          <div>
            <p className="inlearn-media-kind">{title}</p>
            <h3 className="inlearn-media-title">{session.title}</h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="inlearn-media-close"
            onClick={requestClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="inlearn-media-body">
          {isLoading ? <p className="inlearn-media-note">Opening…</p> : null}

          {problem ? (
            <p className="inlearn-media-note is-problem" role="status">
              {problem}
            </p>
          ) : null}

          {!isLoading && !problem && kind === "video" ? (
            <>
              <video
                ref={playerRef}
                className="inlearn-media-video"
                src={source}
                controls
                autoPlay
                playsInline
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                onContextMenu={(event) => event.preventDefault()}
              />

              {/* The same two the audio has. A browser's own video bar gives
                  no way back ten seconds either, and on a recorded lesson that
                  is the one control somebody reaches for. */}
              <div className="inlearn-media-skips">
                <button
                  type="button"
                  className="inlearn-media-skip"
                  onClick={() => skip(-SKIP_SECONDS)}
                  aria-label={`Back ${SKIP_SECONDS} seconds`}
                >
                  <SkipIcon back />
                  <span>{SKIP_SECONDS}s</span>
                </button>
                <button
                  type="button"
                  className="inlearn-media-skip"
                  onClick={() => skip(SKIP_SECONDS)}
                  aria-label={`Forward ${SKIP_SECONDS} seconds`}
                >
                  <span>{SKIP_SECONDS}s</span>
                  <SkipIcon />
                </button>
              </div>
            </>
          ) : null}

          {!isLoading && !problem && kind === "audio" ? (
            <>
              <audio
                ref={playerRef}
                className="inlearn-media-audio"
                src={source}
                controls
                autoPlay
                controlsList="nodownload"
                onContextMenu={(event) => event.preventDefault()}
              />

              <div className="inlearn-media-skips">
                <button
                  type="button"
                  className="inlearn-media-skip"
                  onClick={() => skip(-SKIP_SECONDS)}
                  aria-label={`Back ${SKIP_SECONDS} seconds`}
                >
                  <SkipIcon back />
                  <span>{SKIP_SECONDS}s</span>
                </button>
                <button
                  type="button"
                  className="inlearn-media-skip"
                  onClick={() => skip(SKIP_SECONDS)}
                  aria-label={`Forward ${SKIP_SECONDS} seconds`}
                >
                  <span>{SKIP_SECONDS}s</span>
                  <SkipIcon />
                </button>
              </div>
            </>
          ) : null}

          {!isLoading && isNotes ? (
            session.media.notes?.length ? (
              <ul className="inlearn-media-files">
                {session.media.notes.map((file) => (
                  <li key={file.id}>
                    <button type="button" onClick={() => openNote(file)}>
                      <DocumentIcon />
                      <span>{file.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="inlearn-media-note">No note files have been uploaded yet.</p>
            )
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MediaDialog;
