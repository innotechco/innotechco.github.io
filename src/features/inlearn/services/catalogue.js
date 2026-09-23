import {API_URL} from "./auth/client.js";

/* The catalogue, fetched from Strapi and remembered.
 *
 * Read by every page that shows a course, so it is fetched once per language
 * and kept: four sections opening in a row is one request, not four. The
 * promise is cached rather than the answer, so two sections mounting in the
 * same frame share the one request instead of starting two.
 *
 * Nothing here decides what happens when it fails. It either answers with a
 * catalogue or throws, and the hook above it turns that into the bundled copy
 * the site ships with - because "what to show when the server is down" is a
 * question about the page, not about the request.
 */

const inFlight = new Map();

/* A picture lives beside the API rather than beside the site, and the server
   sends the path it knows rather than a whole address - so the address is
   made here, in the one place that knows where the API is. An absolute URL is
   passed through untouched, for the day the files move to a CDN. */
function imageUrl(path) {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_URL}${path}`;
}

function withImages(catalogue) {
  return {
    ...catalogue,
    courses: catalogue.courses.map((course) => ({
      ...course,
      image: imageUrl(course.image),
      seo: {...course.seo, image: imageUrl(course.seo?.image)},
    })),
    instructors: Object.fromEntries(
      Object.entries(catalogue.instructors).map(([id, person]) => [
        id,
        {...person, id, image: imageUrl(person.image)},
      ]),
    ),
  };
}

/* With no API configured there is nothing to ask, and saying so plainly is
   better than a request to "undefined/api/..." that fails a second later with
   a message about the network. */
export function isCatalogueEnabled() {
  return Boolean(API_URL);
}

export function loadCatalogue(locale) {
  if (!isCatalogueEnabled()) {
    return Promise.reject(new Error("No INLEARN API is configured."));
  }

  const cached = inFlight.get(locale);
  if (cached) return cached;

  const request = fetch(`${API_URL}/api/inlearn/catalogue?locale=${encodeURIComponent(locale)}`)
    .then((response) => {
      if (!response.ok) throw new Error(`The catalogue request failed (${response.status}).`);
      return response.json();
    })
    .then(withImages)
    .catch((error) => {
      /* Forgotten on failure, so the next page to ask tries again rather than
         inheriting a rejection from a moment when the server happened to be
         restarting. */
      inFlight.delete(locale);
      throw error;
    });

  inFlight.set(locale, request);
  return request;
}
