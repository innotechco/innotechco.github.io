/* The curtain itself lives in index.html, painted before this bundle exists.
   This is the only thing that takes it down, and it is called once the first
   page has stopped moving - see RouteLoadingOverlay in App.jsx. */
const CURTAIN_ID = "boot-curtain";
const FADE_MS = 300;

export function dismissBootCurtain() {
  const curtain = document.getElementById(CURTAIN_ID);
  if (!curtain || curtain.dataset.dismissed) return;

  curtain.dataset.dismissed = "true";
  curtain.style.pointerEvents = "none";
  curtain.addEventListener("transitionend", () => curtain.remove(), {once: true});
  /* transitionend does not fire in a background tab, and a curtain left in the
     tree is one more full-screen layer over every page after this one. */
  window.setTimeout(() => curtain.remove(), FADE_MS * 2);

  /* Read a layout value first so the browser cannot collapse the starting and
     ending opacity into one frame and skip the fade. */
  void curtain.offsetHeight;
  curtain.style.opacity = "0";
}
