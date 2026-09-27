import {request} from "./client.js";
import {logIn} from "./credentials.js";

/* These three are ours, not the plugin's.

   Strapi mails a link holding a long token and takes the code and the new
   password in one request. The panel asks for six digits, and wants to know
   they are right before it shows the password step at all - otherwise a wrong
   code is only discovered after a password has been typed twice. /api/inlearn/*
   is where that third step lives. */

/* Step one. Every number here is the server's, repeated rather than worked
   out again, so the two cannot disagree the first time one of them changes.
 *
 * `sent` is false when a code was already on its way: pressing the button
 * again does not send a second one, it reports how long the first has left.
 * `retryInSeconds` is that remainder, and it is the same clock as the code's
 * own life - when it reaches zero the code is dead and another is worth
 * having. The dialog counts it down beside the field. */
export async function requestPasswordReset(email) {
  const payload = await request("/api/inlearn/forgot-password", {email});
  return {
    expiresInMinutes: payload?.expiresInMinutes ?? null,
    sent: payload?.sent !== false,
    retryInSeconds: payload?.retryInSeconds ?? 0,
  };
}

/* Step two: the code alone. Answering here is what lets the panel move on. */
export async function verifyResetCode({email, code}) {
  await request("/api/inlearn/verify-reset-code", {email, code});
}

/* Step three. The code is sent again because the server checks it again -
   these are separate requests and nothing stops a caller skipping step two.

   Signing in afterwards goes through the ordinary login route rather than a
   token minted here: that route is what sets the refresh cookie the session
   depends on, and using it proves the new password really works. A token
   issued here would drop the visitor out ten minutes later with no error to
   explain why. */
export async function resetPassword({email, code, password, remember = true}) {
  await request("/api/inlearn/reset-password", {email, code, password});
  return logIn({email, password, remember});
}
