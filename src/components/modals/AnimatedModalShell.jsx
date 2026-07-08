import {useCallback, useEffect, useState} from "react";
import {createPortal} from "react-dom";

function AnimatedModalShell({
  ariaLabelledBy,
  children,
  closeDurationMs = 1000,
  containerClassName,
  hiddenClassName = "translate-y-24 opacity-0",
  isOpen,
  onExited,
  onRequestClose,
  overlayClassName,
  overlayHiddenClassName = "opacity-0",
  overlayVisibleClassName = "opacity-100",
  panelClassName,
  portalTarget,
  visibleClassName = "translate-y-0 opacity-100",
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  useEffect(() => {
    let renderFrame;
    let visibleFrame;
    let closeTimer;

    if (isOpen) {
      renderFrame = requestAnimationFrame(() => {
        setShouldRender(true);
        visibleFrame = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      visibleFrame = requestAnimationFrame(() => setVisible(false));
      closeTimer = window.setTimeout(() => {
        setShouldRender(false);
        onExited?.();
      }, closeDurationMs);
    }

    return () => {
      cancelAnimationFrame(renderFrame);
      cancelAnimationFrame(visibleFrame);
      clearTimeout(closeTimer);
    };
  }, [closeDurationMs, isOpen, onExited]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <div className={containerClassName}>
      <button
        type="button"
        aria-label="Close modal"
        onClick={close}
        className={`${overlayClassName} ${
          visible ? overlayVisibleClassName : overlayHiddenClassName
        }`}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={`${panelClassName} ${
          visible ? visibleClassName : hiddenClassName
        }`}
      >
        {children}
      </section>
    </div>,
    portalTarget ?? document.body,
  );
}

export default AnimatedModalShell;
