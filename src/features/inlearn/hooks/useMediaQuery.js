import {useCallback, useSyncExternalStore} from "react";

/* True while the media query matches, and re-renders when that changes.
 *
 * useSyncExternalStore rather than useState with an effect: the value is read
 * during render from the browser itself, so the first paint is already correct.
 * The effect version paints the desktop layout first and corrects it a frame
 * later, which on a phone is a visible jump.
 *
 * The server snapshot is false because there is no window to ask; the markup is
 * prerendered at the desktop size and hydration fixes it on a narrow screen. */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
