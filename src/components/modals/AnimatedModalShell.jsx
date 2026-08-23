import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {t} from "../../i18n/ui";

function classList(value) {
  return String(value ?? "").split(" ").filter(Boolean);
}

function swapClasses(node, from, to) {
  if (!node) return;
  node.classList.remove(...classList(from));
  node.classList.add(...classList(to));
}

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
  /* Only ever cleared by the close timer, so the panel stays mounted long
     enough to play its exit transition after isOpen flips to false. */
  const [keepMounted, setKeepMounted] = useState(false);
  const hasEnteredRef = useRef(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const shouldRender = isOpen || keepMounted;

  if (isOpen && !keepMounted) setKeepMounted(true);

  const close = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  /* The open/close classes are applied to the DOM here rather than rendered
     from state. Through state, React is free to commit the mount and the
     visible classes in a single style recalculation, leaving the browser no
     "from" value to animate away from - that is why the modal only sometimes
     snapped open instead of easing in. Applying the hidden classes and reading
     the box forces that state to be computed before the swap, so the
     transition always has somewhere to start. */
  useLayoutEffect(() => {
    if (!shouldRender) return undefined;

    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (isOpen) {
      if (!hasEnteredRef.current) {
        hasEnteredRef.current = true;
        panel?.classList.add(...classList(hiddenClassName));
        overlay?.classList.add(...classList(overlayHiddenClassName));
        panel?.getBoundingClientRect();
        overlay?.getBoundingClientRect();
      }

      /* Re-asserted on every run because a re-render (a theme switch, say)
         rewrites className from the JSX and would otherwise drop these. */
      swapClasses(panel, hiddenClassName, visibleClassName);
      swapClasses(overlay, overlayHiddenClassName, overlayVisibleClassName);
      return undefined;
    }

    hasEnteredRef.current = false;
    swapClasses(panel, visibleClassName, hiddenClassName);
    swapClasses(overlay, overlayVisibleClassName, overlayHiddenClassName);

    const closeTimer = window.setTimeout(() => {
      setKeepMounted(false);
      onExited?.();
    }, closeDurationMs);

    return () => window.clearTimeout(closeTimer);
  }, [
    closeDurationMs,
    hiddenClassName,
    isOpen,
    onExited,
    overlayClassName,
    overlayHiddenClassName,
    overlayVisibleClassName,
    panelClassName,
    shouldRender,
    visibleClassName,
  ]);

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
        className={overlayClassName}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={panelClassName}
      >
        {children}
      </section>
    </div>,
    portalTarget ?? document.body,
  );
}

export default AnimatedModalShell;
