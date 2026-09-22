/* One copy-to-clipboard path for every course surface. The caller supplies the
   router-resolved href, so project-site base paths are preserved as well as
   the normal innotech.global root path. */

const listeners = new Set();

function notify(result) {
  for (const listener of listeners) listener(result);
}

function fallbackCopy(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
}

export async function copyCourseLink(href) {
  const url = new URL(href, window.location.origin).href;

  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
    else if (!fallbackCopy(url)) throw new Error("Clipboard is unavailable");
    notify({copied: true});
    return true;
  } catch {
    notify({copied: false});
    return false;
  }
}

export function subscribeToCourseShare(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
