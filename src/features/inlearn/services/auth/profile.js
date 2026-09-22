import {authorizedFetch} from "./tokens.js";

/* The signed-in visitor's own details.
 *
 * Both calls go through authorizedFetch, which is what makes them work at all
 * after the first ten minutes: it attaches the access token, and when that has
 * expired it trades the refresh cookie for a new one and repeats the request.
 * Until this page existed nothing in INLEARN used it.
 *
 * Neither call sends an id. Which account is read or written is decided by the
 * server from the token, so there is nothing here for a caller to point at
 * somebody else's row.
 */

/* Strapi answers an error as {error: {message}}; a network failure answers as
   nothing at all. Both reach the form as one sentence it can show. */
async function readProblem(response) {
  const payload = await response.json().catch(() => null);
  return payload?.error?.message || "Something went wrong. Try again.";
}

export async function fetchProfile() {
  let response;
  try {
    response = await authorizedFetch("/api/inlearn/profile");
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}

/* Name, phone and region. Not the email: changing an address has to be proved
   against the new one first, so it is a journey rather than a field, and not
   the password, which has a route of Strapi's own. */
export async function saveProfile({fullName, phone, region}) {
  let response;
  try {
    response = await authorizedFetch("/api/inlearn/profile", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({fullName, phone, region}),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}

/* The picture. Ten megabytes, checked here so an obviously oversized file is
   named before it is uploaded rather than after - and checked again on the
   server, because this check can be skipped and that one cannot. */
export const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export async function uploadAvatar(file) {
  if (!file) throw new Error("Please choose a picture.");
  if (!file.type.startsWith("image/")) throw new Error("That file is not a picture.");
  if (file.size > MAX_AVATAR_BYTES) throw new Error("That picture is larger than 10MB.");

  const body = new FormData();
  body.append("avatar", file);

  let response;
  try {
    /* No Content-Type header: the browser has to set it, because only the
       browser knows the multipart boundary it is about to generate. */
    response = await authorizedFetch("/api/inlearn/avatar", {method: "POST", body});
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}

/* The password. The server checks the current one and applies the same rules
   the sign-up panel does; it also ends every other session this account has,
   which is what somebody changing their password usually wants. */
export async function changePassword({currentPassword, newPassword}) {
  return post("/api/inlearn/change-password", {currentPassword, newPassword});
}

/* Changing the address, in two steps: ask for a code, then spend it. The code
   goes to the NEW address - that is what proves it is reachable - and the
   account keeps the address it has until the second step succeeds. */
export async function requestEmailChange(email) {
  return post("/api/inlearn/change-email", {email});
}

export async function confirmEmailChange(code) {
  return post("/api/inlearn/change-email/confirm", {code});
}

async function post(path, body) {
  let response;
  try {
    response = await authorizedFetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}
