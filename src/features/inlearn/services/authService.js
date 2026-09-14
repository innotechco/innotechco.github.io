/* Every call here is a real Strapi users-permissions endpoint. Nothing is
   faked: with VITE_INLEARN_API_URL unset the calls refuse rather than pretend
   to succeed, because a sign-in that only prints "signed in" teaches the page
   the wrong shape and hides the work still to do.

   Passwords, provider secrets and mail all stay on Strapi's side.

   Strapi is configured for two-token auth (jwtManagement: 'refresh'), which
   shapes everything below:

     access token   10 minutes   returned in the body, held here
     refresh token  14 days      an httpOnly cookie this code cannot read

   Ten minutes is deliberately short - a stolen access token is worth very
   little - and the long-lived half sits in a cookie no script can reach, so a
   cross-site script cannot walk off with it. The cost is that every request to
   Strapi must carry credentials, or the browser neither stores that cookie nor
   sends it back, and the session silently dies after ten minutes. */

const API_URL = (import.meta.env.VITE_INLEARN_API_URL ?? "").replace(/\/+$/, "");
const SESSION_KEY = "inlearn-auth-session";

export function isAuthConfigured() {
  return Boolean(API_URL);
}

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
function storedIn() {
  try {
    return window.localStorage.getItem(SESSION_KEY) ? "local" : "session";
  } catch {
    return "session";
  }
}

/* credentials: "include" on every call, so the refresh cookie is both stored
   when Strapi sets it and sent back when Strapi asks for it. */
function strapiFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, {...options, credentials: "include"});
}

/* Strapi nests its reason in error.message; surface that rather than a status
   code, so "Invalid identifier or password" reaches the form as written. */
async function request(path, body) {
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

function toSession(payload, remember) {
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

export async function logIn({email, password, remember = true}) {
  /* Strapi accepts either a username or an email as the identifier. */
  const payload = await request("/api/auth/local", {identifier: email, password});
  return toSession(payload, remember);
}

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

/* ---------------------------------------------------------------------------
   Keeping the session alive
   --------------------------------------------------------------------------- */

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
   request fail. */
export async function restoreSession() {
  const stored = getSession();
  if (!stored || !API_URL) return stored;

  const refreshed = await refreshSession();
  return refreshed ?? null;
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

/* ---------------------------------------------------------------------------
   Password reset
   --------------------------------------------------------------------------- */

/* Step one: Strapi mails a reset code. It always answers ok, even for an
   address it does not know, so the page cannot be used to discover who has an
   account here. */
export async function requestPasswordReset(email) {
  await request("/api/auth/forgot-password", {email});
}

/* Step two: the code from that mail plus the new password. Strapi returns a
   session, so a successful reset signs the visitor straight in. */
export async function resetPassword({code, password, remember = true}) {
  const payload = await request("/api/auth/reset-password", {
    code,
    password,
    passwordConfirmation: password,
  });
  return toSession(payload, remember);
}

/* ---------------------------------------------------------------------------
   Google and LinkedIn
   --------------------------------------------------------------------------- */

/* Provider sign-in is a full page redirect, not a fetch: the secret half of the
   exchange belongs to Strapi, and the browser is only ever the courier. */
export function providerSignInUrl(provider) {
  if (!API_URL) return null;
  return `${API_URL}/api/connect/${provider}`;
}

/* Strapi sends the visitor back with ?access_token=...; trading it for a
   session is the last step of that round trip. */
export function readProviderCallback(search = window.location.search) {
  const params = new URLSearchParams(search);
  const accessToken = params.get("access_token");
  const provider = params.get("provider") || sessionStorage.getItem("inlearn-auth-provider");
  return accessToken && provider ? {accessToken, provider} : null;
}

export async function completeProviderSignIn({provider, accessToken, remember = true}) {
  if (!API_URL) throw new Error("The INLEARN API is not connected yet.");

  const response = await strapiFetch(
    `/api/auth/${provider}/callback?access_token=${encodeURIComponent(accessToken)}`,
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "That sign-in did not complete.");
  }

  return toSession(payload, remember);
}
