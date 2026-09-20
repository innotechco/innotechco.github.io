import {useEffect, useRef} from "react";

import {completeProviderSignIn, readProviderCallback} from "../services/authService.js";

/* Coming back from Google or LinkedIn.

   Strapi 5.53 returns a clean address and keeps the provider's answer in a
   session cookie, so the round trip is recognised by the intent stored on the
   way out rather than by anything in the URL, and one more call trades that
   cookie for a session here.

   This lived inside AuthSidebar and was the single hardest thing in it to read,
   because two separate mistakes are written into its guard and both have to be
   explained where the guard is.

   ONCE PER VISIT, AND THE REF IS WHY
   ----------------------------------
   The parent rebuilds these callbacks on every render, so this effect is torn
   down and set up again whenever anything else changes state - and the
   exchange must not be started a second time, because the first has already
   spent the cookie. A ref survives that; a variable in the effect body does
   not.

   AND THERE IS DELIBERATELY NO "STILL MOUNTED" FLAG
   -------------------------------------------------
   An earlier version had one. A re-render arriving mid-exchange - the restored
   session landing, say - flipped it before the answer came back, so a sign-in
   that had actually succeeded was thrown away. The name then appeared only
   after a reload, when the stored session was read again.

   Effect cleanup means "this run ended", not "the component died". Work that
   must happen once is guarded by a ref, never by a flag the next render
   resets. */
export function useProviderReturn({onSignedIn, onError}) {
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;

    const callback = readProviderCallback();
    if (!callback) return;

    hasHandled.current = true;

    completeProviderSignIn({...callback, remember: true})
      .then(({session, isNewAccount}) =>
        onSignedIn?.(session, isNewAccount ? "register" : "login"),
      )
      /* Shown rather than swallowed: a provider sign-in that fails in silence
         looks like a dead button. */
      .catch((error) => onError?.(error.message));
  }, [onSignedIn, onError]);
}
