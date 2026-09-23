/* What counts as an edit on the Profile page, and where a half-finished one
 * waits while the visitor is somewhere else.
 *
 * Kept out of the component for two reasons: the questions here are answerable
 * without rendering anything, which is what lets them be tested; and the held
 * draft has to outlive the component, which a hook inside it cannot.
 */

/* The three rows Apply Changes sends. Not the email, the password or the
   picture: each of those saves itself the moment it succeeds, so none of them
   can ever be an unsaved change. */
export const EDITABLE_FIELDS = ["fullName", "region"];

/* Only the editable rows, and every one of them - a field the answer never
   mentioned becomes "" rather than going missing, so two profiles can always
   be compared key for key. */
export function editablePart(profile) {
  return Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, profile?.[field] ?? ""]));
}

/* Whether the form holds anything the server does not.
 *
 * Compared against the server's own answer rather than against a flag set on
 * the first keystroke: somebody who types a letter and deletes it again has
 * changed nothing, and should not be warned that they have. */
export function hasEdits(profile, saved) {
  if (!saved) return false;
  const now = editablePart(profile);
  const before = editablePart(saved);
  return EDITABLE_FIELDS.some((field) => now[field] !== before[field]);
}

/* The draft that survives leaving the page.
 *
 * In memory rather than in storage, and that is deliberate. A half-typed name
 * or phone number written to localStorage would still be there tomorrow, on a
 * shared computer, after signing out - and the problem this solves only lasts
 * as long as the tab does. Moving between dashboard sections unmounts this
 * page; closing the tab is what the beforeunload warning is for.
 */
let held = null;

export function holdDraft(fields) {
  held = editablePart(fields);
}

export function readDraft() {
  return held;
}

export function clearDraft() {
  held = null;
}
