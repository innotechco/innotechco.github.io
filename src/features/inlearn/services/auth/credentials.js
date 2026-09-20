import {request} from "./client.js";
import {toSession} from "./session.js";

/* Signing in and signing up with an email and a password. */

export async function logIn({email, password, remember = true}) {
  /* Strapi accepts either a username or an email as the identifier. */
  const payload = await request("/api/auth/local", {identifier: email, password});
  return toSession(payload, remember);
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
