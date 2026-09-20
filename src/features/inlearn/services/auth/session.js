/* Where the signed-in session is kept on this device.

   Two stores, and which one is used is the whole meaning of "Keep me signed
   in": localStorage survives closing the browser, sessionStorage does not.
   Everything that writes a session back - a refresh, most of all - has to put
   it in the same place it was found, or ticking that box would quietly stop
   meaning anything after the first ten minutes.

   Every read and write is wrapped: a private window, cleared site data or a
   blocked storage API all throw here, and none of them should take the page
   down with them. */

const SESSION_KEY = "inlearn-auth-session";

function readStore(remember) {
  return remember ? window.localStorage : window.sessionStorage;
}

export function getSession() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      const raw = store.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* Private windows and cleared site data both land here. */
    }
  }
  return null;
}

export function saveSession(session, {remember = true} = {}) {
  try {
    readStore(remember).setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* Storage can be blocked outright; the session still works for this page. */
  }
  return session;
}

export function signOut() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      store.removeItem(SESSION_KEY);
    } catch {
      /* nothing to clean up */
    }
  }
}

/* Where the stored session lives decides whether it survives closing the
   browser, so a refreshed token has to go back to the same place. */
export function storedIn() {
  try {
    return window.localStorage.getItem(SESSION_KEY) ? "local" : "session";
  } catch {
    return "session";
  }
}

/* What Strapi answers with, reduced to the three things the page needs. */
export function toSession(payload, remember) {
  return saveSession(
    {
      jwt: payload.jwt,
      user: payload.user,
      /* username is the email now; fullName is what a person calls themselves.
         Accounts made before that split still fall back to username. */
      displayName:
        payload.user?.fullName || payload.user?.username || payload.user?.email || "INLEARN user",
    },
    {remember},
  );
}
