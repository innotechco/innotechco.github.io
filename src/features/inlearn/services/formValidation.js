/* The browser's own validation bubble is a grey system tooltip that ignores the
   site's type and colour, so the forms turn it off and ask here instead. Each
   check returns the sentence to show, or an empty string when the field is
   fine.

   The wording stays plain and unaccusing - it says what is needed, not what the
   visitor got wrong. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export function checkEmail(value) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
  return "";
}

export function checkPassword(value, {isNew = false} = {}) {
  if (!value) return "Please enter your password.";
  if (isNew && value.length < MIN_PASSWORD_LENGTH) {
    return `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
}

export function checkRequired(value, label) {
  return value.trim() ? "" : `Please enter your ${label}.`;
}

/* Returns the first problem, because the forms show one line at a time. */
export function firstProblem(checks) {
  return checks.find(Boolean) ?? "";
}
