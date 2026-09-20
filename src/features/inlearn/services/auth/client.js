/* The one way out to Strapi, and the rule that nothing here is faked.

   With VITE_INLEARN_API_URL unset every call refuses rather than pretending to
   succeed: a sign-in that only prints "signed in" teaches the page the wrong
   shape and hides the work still to do.

   credentials: "include" is on every request, always. Strapi is configured for
   two-token auth, and the long-lived half is an httpOnly cookie - without
   credentials the browser neither stores that cookie when Strapi sets it nor
   sends it back when Strapi asks, and the session dies silently after ten
   minutes with nothing to explain it. */

export const API_URL = (import.meta.env.VITE_INLEARN_API_URL ?? "").replace(/\/+$/, "");

export function isAuthConfigured() {
  return Boolean(API_URL);
}

export function strapiFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, {...options, credentials: "include"});
}

/* Strapi nests its reason in error.message; surface that rather than a status
   code, so "Invalid identifier or password" reaches the form as written. */
export async function request(path, body) {
  if (!API_URL) {
    throw new Error("The INLEARN API is not connected yet.");
  }

  let response;
  try {
    response = await strapiFetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Something went wrong. Try again.");
  }

  return payload;
}
