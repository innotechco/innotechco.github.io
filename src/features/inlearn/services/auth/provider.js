import {API_URL, strapiFetch} from "./client.js";
import {toSession} from "./session.js";

/* Google and LinkedIn.

   Provider sign-in is a full page redirect, not a fetch: the provider has to
   show its own consent screen, and the secret half of the exchange belongs to
   Strapi. The browser is only ever the courier. */

export function providerSignInUrl(provider) {
  if (!API_URL) return null;
  return `${API_URL}/api/connect/${provider}`;
}

/* Strapi 5.53 changed how a provider sign-in comes back.
   It used to hand the token over in the address bar:

     /inlearn?access_token=ya29...

   Now the address comes back clean and the provider's answer is kept in a
   session cookie instead, to be traded in by a second call. Reading the URL,
   which is what this used to do, therefore finds nothing at all - no token, no
   error, nothing to report - and a sign-in that fails in silence is worse than
   one that fails loudly.

   Nothing in the URL marks the return, so the intent is remembered before
   leaving: the panel writes the provider name to sessionStorage, and finding
   it there on the way back is what says a round trip just finished. */
const PROVIDER_KEY = "inlearn-auth-provider";

export function rememberProviderIntent(provider) {
  try {
    window.sessionStorage.setItem(PROVIDER_KEY, provider);
  } catch {
    /* Without storage the return cannot be recognised; the redirect below still
       happens, and the visitor lands on a page that simply does not sign them
       in rather than on an error. */
  }
}

export function readProviderCallback() {
  try {
    const provider = window.sessionStorage.getItem(PROVIDER_KEY);
    return provider ? {provider} : null;
  } catch {
    return null;
  }
}

/* Cleared whether the exchange worked or failed: either way this round trip is
   over, and leaving the marker behind would make the next reload look like a
   fresh return from the provider. */
function forgetProviderIntent() {
  try {
    window.sessionStorage.removeItem(PROVIDER_KEY);
  } catch {
    /* nothing to clean up */
  }
}

export async function completeProviderSignIn({provider, remember = true}) {
  if (!API_URL) throw new Error("The INLEARN API is not connected yet.");

  try {
    /* credentials are what make this work: the provider's answer is in a
       cookie, and without them the browser sends nothing and Strapi reports a
       session that was never completed. strapiFetch always sends them. */
    const response = await strapiFetch(`/api/auth/${provider}/callback`);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error?.message || "That sign-in did not complete.");
    }

    /* isNewAccount comes from a middleware in inlearn-api, because Strapi's own
       answer is identical whether it just created the account or found one.
       Only the greeting depends on it, so an older API that does not send it
       simply gets the returning-visitor wording. */
    return {
      session: toSession(payload, remember),
      isNewAccount: payload?.isNewAccount === true,
    };
  } finally {
    forgetProviderIntent();
  }
}
