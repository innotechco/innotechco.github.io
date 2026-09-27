import {request} from "./client.js";
import {toSession} from "./session.js";

/* Signing in and signing up with an email and a password. */

/* The name people know a provider by, rather than the key it is stored under. */
const PROVIDER_NAMES = {google: "Google", linkedin: "LinkedIn"};

export async function logIn({email, password, remember = true}) {
  /* Strapi accepts either a username or an email as the identifier. */
  let payload;
  try {
    payload = await request("/api/auth/local", {identifier: email, password});
  } catch (refusal) {
    throw await explainRefusal(email, refusal);
  }
  return toSession(payload, remember);
}

/* Strapi answers every failed sign-in with "Invalid identifier or password",
 * which is the right thing to tell a stranger guessing and the wrong thing to
 * tell the account's owner.
 *
 * The case that matters: an account made through Google has no password here.
 * Google keeps it and never shares it, so somebody typing their Gmail address
 * and their GOOGLE password is offering something this site has never held
 * and cannot check. Told only "invalid", they type it again more carefully -
 * and it will never work, however carefully they type it.
 *
 * So after a refusal, and only after one, the server is asked how that address
 * signs in, and the sentence is replaced with one that has a way forward in
 * it. A failure here changes nothing: the original refusal still stands. */
async function explainRefusal(email, refusal) {
  try {
    const method = await request("/api/inlearn/sign-in-method", {email});

    if (method?.exists && !method.hasPassword) {
      const name = PROVIDER_NAMES[method.provider] ?? "a connected account";
      /* Both ways out, because both now work.
       *
       * Setting a password on a provider account used to be a loop that ended
       * where it started - the password was stored and the sign-in still
       * refused it, because Strapi only looks at accounts marked local. The
       * account is handed over to local sign-in when the password is set now,
       * so this second sentence is true; see resetPassword in the API. */
      return new Error(
        `This account was created with ${name}, so it has no password here yet. ` +
        `Use the ${name} button, or choose "Forgot password?" to set one.`,
      );
    }
  } catch {
    /* Rate limited, offline, or the route is not there. The refusal below is
       still true and still useful. */
  }

  return refusal;
}

/* The parameters are named one by one rather than taking the form object
   whole, and that is the point: anything the form grows later - a repeated
   password, a checkbox - is dropped here and never reaches the network. The
   signature is the filter. */
export async function register({name, email, phone, region, password, remember = true}) {
  const payload = await request("/api/auth/local/register", {
    /* Strapi marks username unique, so it cannot hold a person's name: two
       visitors called Ali would mean the second is refused an account. The
       email is unique anyway, so it serves as the handle and the name is kept
       beside it in fullName. */
    username: email,
    email,
    password,
    /* Strapi's register endpoint refuses fields it does not expect. The
       middleware in inlearn-api lifts these off the body before its router
       sees them, then writes them onto the new user. */
    fullName: name,
    phone,
    region,
  });
  return toSession(payload, remember);
}
