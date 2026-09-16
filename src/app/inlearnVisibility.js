/* Whether INLEARN is linked from the rest of the site yet.
 *
 * The page itself is always built and always answers at /inlearn - typing the
 * address works, on this machine and on innotech.global, which is how it gets
 * looked at while it is being finished.
 *
 * What this switches is every way of *arriving* at it without knowing the
 * address: the two navbar entries and the site search. The deploy workflow does
 * not set the variable, and anything it does not set is off, so the published
 * site carries the page without offering it to anyone.
 *
 * To have the links back while working locally, .env.local carries:
 *
 *     VITE_INLEARN_ENABLED=true
 *
 * That file is not in git, so the two cannot get mixed up. When INLEARN is ready
 * to be announced, add the same line to the workflow's build step.
 */
export const isInlearnLinked = import.meta.env.VITE_INLEARN_ENABLED === "true";
