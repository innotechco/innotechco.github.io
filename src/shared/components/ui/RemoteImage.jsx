import {useState} from "react";

/* A picture that comes from the CMS, served as WebP.
 *
 * WordPress keeps what was uploaded. The editors upload PNGs, and a PNG of a
 * photograph is enormous: the card on the INLEARN first page was fetching 694KB
 * for a picture drawn 493px wide, and taking two and a half seconds over it.
 * The same image as WebP is 51KB - the same picture, a fourteenth of the wait.
 *
 * WordPress cannot make WebP on its own, so the conversion happens on the way
 * through: the resizer below takes the original's address, returns WebP at the
 * width asked for, and caches it. Nothing is stored here and nothing changes in
 * WordPress, so an editor's workflow is untouched.
 *
 * It is a service someone else runs, which is a dependency, and dependencies
 * fail - so this never becomes the only way to see the picture:
 *
 *   - the WebP is offered as an alternative source, and the original stays on
 *     the image element under it, which is what a browser without WebP support
 *     already falls to
 *   - if the service is unreachable or answers with an error, onError drops the
 *     WebP source and the original is used instead
 *   - setting VITE_IMAGE_PROXY to an empty string turns the whole thing off and
 *     the site serves exactly what WordPress gives it
 *
 * So the worst case is today's behaviour: slow, not broken.
 */
const PROXY = import.meta.env.VITE_IMAGE_PROXY ?? "https://images.weserv.nl/";

/* Two thirds of the way up the quality scale. Below this, flat areas in a
   generated image start to band visibly; above it, the file grows faster than
   the picture improves. */
const QUALITY = 80;

function toWebp(url, width) {
  if (!PROXY || !url) return "";
  /* The address is a parameter inside another address, so every character that
     means something to a URL has to stop meaning it. */
  const source = encodeURIComponent(url.replace(/^https?:\/\//, ""));
  return `${PROXY}?url=${source}&w=${width}&output=webp&q=${QUALITY}`;
}

/* The same list the image element carries, rewritten as WebP. Widths come from the
   entries themselves, so whatever WordPress has is what is offered. */
function toWebpSrcSet(srcSet) {
  if (!srcSet) return "";

  return srcSet
    .split(",")
    .map((entry) => {
      const [url, descriptor] = entry.trim().split(/\s+/);
      const width = Number.parseInt(descriptor, 10);
      if (!url || !Number.isFinite(width)) return "";
      const converted = toWebp(url, width);
      return converted ? `${converted} ${width}w` : "";
    })
    .filter(Boolean)
    .join(", ");
}

function RemoteImage({src, srcSet = "", sizes, alt = "", className, ...imgProps}) {
  const [useOriginal, setUseOriginal] = useState(false);

  const webpSrcSet = useOriginal ? "" : toWebpSrcSet(srcSet) || toWebp(src, 1024);

  return (
    <picture>
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      <img
        src={src}
        srcSet={srcSet || undefined}
        sizes={sizes}
        alt={alt}
        className={className}
        /* Lazy unless the caller says otherwise - a picture from the CMS is
           content, and content waits until it is close to being looked at. The
           spread below is what lets a caller mark the one already on screen as
           eager; keeping this line above it means the default holds for every
           caller that does not think about it. */
        loading="lazy"
        /* Only ever flips one way, and only once: if the converted picture
           cannot be fetched, the original takes over for the rest of the visit
           rather than the two taking turns to fail. */
        onError={() => setUseOriginal(true)}
        {...imgProps}
      />
    </picture>
  );
}

export default RemoteImage;
