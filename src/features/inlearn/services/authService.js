const authStorageKey = "inlearn-auth-session";

export function signInWithProvider(provider) {
  const session = {
    provider,
    displayName: provider === "apple" ? "Apple User" : "Google User",
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  return session;
}

export function signInWithEmail({email, remember}) {
  const session = {
    provider: "email",
    displayName: email || "INLEARN User",
    remember,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  return session;
}
