/* Every call here is a real Strapi users-permissions endpoint. Nothing is
   faked: with VITE_INLEARN_API_URL unset the calls refuse rather than pretend
   to succeed, because a sign-in that only prints "signed in" teaches the page
   the wrong shape and hides the work still to do.

   Passwords, provider secrets and mail all stay on Strapi's side. The browser
   only ever holds the JWT it is handed back. */

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

/* Strapi nests its reason in error.message; surface that rather than a status
   code, so "Invalid identifier or password" reaches the form as written. */
async function request(path, body) {
  if (!API_URL) {
    throw new Error("The INLEARN API is not connected yet.");
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
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
      displayName: payload.user?.username || payload.user?.email || "INLEARN user",
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
    username: name || email,
    email,
    password,
    /* Strapi keeps unknown fields only once they exist on the User model; add
       phone and region there before expecting them back. */
    phone,
    region,
  });
  return toSession(payload, remember);
}

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

  const response = await fetch(
    `${API_URL}/api/auth/${provider}/callback?access_token=${encodeURIComponent(accessToken)}`,
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "That sign-in did not complete.");
  }

  return toSession(payload, remember);
}
