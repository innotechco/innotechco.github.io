/* Whether INLEARN is part of the site yet.
 *
 * It is still being built, so it is on while developing and off in the build
 * that goes to innotech.global: the deploy workflow does not set this variable,
 * and anything it does not set is off.
 *
 * Off means genuinely absent, not hidden - no route, no link in the navbar, no
 * entry in the search index, and no static fallback file for /inlearn, so a
 * visitor who types the address gets the site's own not-found page rather than
 * a blank screen. Hiding only the link would leave the page itself one guessed
 * URL away, which is not the same thing.
 *
 * To work on it locally, .env.local carries:
 *
 *     VITE_INLEARN_ENABLED=true
 *
 * That file is not in git, so it cannot travel to the deploy by accident. When
 * INLEARN is ready to be published, add the same line to the workflow's build
 * step - one line, in one place.
 */
export const isInlearnEnabled = import.meta.env.VITE_INLEARN_ENABLED === "true";
