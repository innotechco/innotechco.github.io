/* The one door between INLEARN and Strapi.

   Every component imports from this file and nothing else. That rule is what
   makes the backend replaceable: the day Strapi is swapped for something else,
   the work is behind this door and no page is touched.

   The rooms behind it, in the order a session passes through them:

     auth/client.js         the address, and the only fetch that leaves here
     auth/session.js        where a signed-in session is kept on this device
     auth/tokens.js         the ten-minute token, refreshed without anyone noticing
     auth/credentials.js    signing in and signing up with an email
     auth/passwordReset.js  the three steps of a forgotten password
     auth/provider.js       Google and LinkedIn

   Splitting it up changed no behaviour and no import anywhere else: this file
   exports exactly what it exported when it was one file of three hundred and
   fifty lines.

   Two things hold the whole design up, and both live in client.js: nothing is
   faked when the API is not configured, and every request carries credentials
   so the refresh cookie survives. */

export {API_URL, isAuthConfigured} from "./auth/client.js";

export {getSession, saveSession, signOut} from "./auth/session.js";

export {authorizedFetch, refreshSession, restoreSession} from "./auth/tokens.js";

export {
  changePassword,
  confirmEmailChange,
  fetchProfile,
  MAX_AVATAR_BYTES,
  requestEmailChange,
  requestPhoneChange,
  confirmPhoneChange,
  saveProfile,
  uploadAvatar,
} from "./auth/profile.js";

export {logIn, register} from "./auth/credentials.js";

export {requestPasswordReset, resetPassword, verifyResetCode} from "./auth/passwordReset.js";

export {
  completeProviderSignIn,
  providerSignInUrl,
  readProviderCallback,
  rememberProviderIntent,
} from "./auth/provider.js";
