/* The browser's own validation bubble is a grey system tooltip that ignores the
   site's type and colour, so the forms turn it off and ask here instead. Each
   check returns the sentence to show, or an empty string when the field is
   fine.

   The wording stays plain and unaccusing - it says what is needed, not what the
   visitor got wrong. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 8;

export function checkEmail(value) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
  return "";
}

/* isNew guards the strength rules: they belong on a password being chosen, not
   on one being typed to sign in. An account made under older rules must still
   be able to log in, and refusing it at the door would lock out its owner with
   no way back. */
export function checkPassword(value, {isNew = false} = {}) {
  if (!value) return "Please enter your password.";
  if (!isNew) return "";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  /* Latin letters, digits and punctuation only. A password typed on a Persian
     or Arabic keyboard looks identical to its Latin neighbour in a masked
     field, and the visitor has no way to see which one they stored - so the
     rule is stated at the door rather than discovered at the next sign-in. */
  if (!/^[\x20-\x7E]+$/.test(value)) {
    return "Your password can only use English letters, numbers and symbols.";
  }
  if (!/[A-Z]/.test(value)) {
    return "Your password must include at least one capital letter.";
  }
  return "";
}

/* Typing a new password blind, twice, is the only guard against a typo locking
   someone out of the account they just made. */
export function checkPasswordMatch(password, confirmation) {
  if (!confirmation) return "Please repeat your new password.";
  if (password !== confirmation) return "Both passwords must match.";
  return "";
}

export function checkRequired(value, label) {
  return value.trim() ? "" : `Please enter your ${label}.`;
}

/* Returns the first problem, because the forms show one line at a time. */
export function firstProblem(checks) {
  return checks.find(Boolean) ?? "";
}
