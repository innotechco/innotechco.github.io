import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {t} from "../../i18n/ui";

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
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  /* Mount on open; on close keep the panel around until its transition ends. */
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return undefined;
    }

    setVisible(false);
    const closeTimer = window.setTimeout(() => {
      setShouldRender(false);
      onExited?.();
    }, closeDurationMs);

    return () => window.clearTimeout(closeTimer);
  }, [closeDurationMs, isOpen, onExited]);

  /* The panel mounts carrying its hidden classes. Before swapping in the
     visible ones we force the browser to compute style/layout for that hidden
     state, so it has a "from" value to transition away from. Without this flush
     both states can land in the same style recalculation and the modal snaps
     open with no animation - which is why it only misbehaved sometimes: it
     depended on whether a frame happened to fall between the two renders. */
  useLayoutEffect(() => {
    if (!isOpen || !shouldRender || visible) return;

    panelRef.current?.getBoundingClientRect();
    overlayRef.current?.getBoundingClientRect();
    setVisible(true);
  }, [isOpen, shouldRender, visible]);

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
        ref={overlayRef}
        type="button"
        aria-label={t("closeModal")}
        onClick={close}
        className={`${overlayClassName} ${
          visible ? overlayVisibleClassName : overlayHiddenClassName
        }`}
      />
      <section
        ref={panelRef}
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
