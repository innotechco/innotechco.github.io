import {API_URL, strapiFetch} from "./client.js";
import {getSession, saveSession, signOut, storedIn} from "./session.js";

/* Keeping the session alive.

   The access token lives ten minutes. The refresh token lives fourteen rolling
   days in an httpOnly cookie this code cannot read - the browser holds it and
   sends it, and no script can walk off with it. What is exposed is cheap; what
   is valuable is out of reach.

   Nothing in the pages has to know any of that. restoreSession runs once when
   INLEARN opens, and authorizedFetch quietly repeats a request that expired
   mid-flight. */

/* Only ever one refresh in flight. Three expired requests firing at once would
   otherwise each start their own, and the last two would trade in a refresh
   token the first has already used up. */
let refreshInFlight = null;

async function performRefresh() {
  const response = await strapiFetch("/api/auth/refresh", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
  });

  if (!response.ok) {
    /* The refresh token is gone or expired - fourteen days have passed, or the
       session was revoked. There is nothing to recover; the visitor signs in
       again. */
    signOut();
    return null;
  }

  const payload = await response.json().catch(() => null);
  if (!payload?.jwt) {
    signOut();
    return null;
  }

  const current = getSession();
  return saveSession(
    {...current, jwt: payload.jwt},
    {remember: storedIn() === "local"},
  );
}

export function refreshSession() {
  if (!API_URL) return Promise.resolve(null);

  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

/* Call once when INLEARN opens. The stored access token is very likely stale -
   ten minutes is shorter than most visits away - so this trades it for a fresh
   one before anything tries to use it, rather than letting the first real
   request fail.

   Returns {session, expired} rather than a bare session because there are two
   ways to arrive with nobody signed in, and they are not the same thing to the
   person looking at the page:

     never signed in here    expired: false   say nothing, this is normal
     signed in, ran out      expired: true    say so, or the page has silently
                                              forgotten them and they are left
                                              wondering whether the account is
                                              gone

   Only the second one is worth a word, and the caller cannot tell them apart
   from a null. */
export async function restoreSession() {
  const stored = getSession();
  if (!stored || !API_URL) return {session: stored ?? null, expired: false};

  const refreshed = await refreshSession();
  return {session: refreshed, expired: !refreshed};
}

/* Use this for anything that needs the signed-in user - their courses, their
   orders, a video they paid for. It attaches the token, and when the token has
   expired it refreshes once and repeats the request. A caller never has to
   think about the ten minutes. */
export async function authorizedFetch(path, options = {}) {
  if (!API_URL) throw new Error("The INLEARN API is not connected yet.");

  const send = (jwt) =>
    strapiFetch(path, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(jwt ? {Authorization: `Bearer ${jwt}`} : {}),
      },
    });

  const session = getSession();
  let response = await send(session?.jwt);

  if (response.status !== 401) return response;

  const refreshed = await refreshSession();
  if (!refreshed) return response;

  return send(refreshed.jwt);
}
