import {useCallback, useEffect, useRef, useState} from "react";

/* Stops a browser filling this form on its own, without taking away the
 * suggestion list a visitor chooses from deliberately.
 *
 * The line is who acted. Before anyone has touched the form, every value in it
 * arrived without being asked for and is removed. From the first click or key
 * onwards the visitor is driving, and picking their own address out of Chrome's
 * dropdown is exactly what that list is for - so everything here stands down.
 *
 * Two things enforce it up to that moment:
 *
 *   1. Decoy fields. Chrome's automatic fill looks for the first username and
 *      password pair in a form; AutofillDecoys is that pair, so the saved
 *      credential lands there and the real fields are never touched. They are
 *      off-screen rather than hidden, because a field with display:none is
 *      skipped and the decoy would do nothing.
 *
 *   2. A sweep. Anything that gets past the decoys - a fill that arrives
 *      seconds late, or after a dropdown closes - is cleared within a fifth of a
 *      second, and Chrome's own autofill animation (named in inlearn.css) is
 *      heard as it starts and undone immediately.
 *
 * An extension can still defeat both: it runs its own code in the page and the
 * page cannot outrank it. That is the visitor's software, and a wrong saved
 * credential belongs in their credential store, not here.
 */

const AUTOFILL_ANIMATION = "inlearn-autofill-start";

/* React holds its own idea of an input's value, so assigning to .value behind
   its back leaves the two disagreeing. Going through the prototype's setter and
   firing the event React listens for keeps them in step. */
function clearInput(input) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, "");
  input.dispatchEvent(new Event("input", {bubbles: true}));
}

/* The region menu's search box lives inside the form but is not part of it, and
   the decoys are meant to hold what they catch. */
function realInputs(form) {
  return [...form.querySelectorAll("input")].filter(
    (input) =>
      input.type !== "checkbox" &&
      !input.classList.contains("inlearn-select-search") &&
      !input.hasAttribute("data-inlearn-decoy"),
  );
}

export function useNoAutofill() {
  /* State drives the decoys out of the tree; the ref is read inside the same
     event that flips it, before React has re-rendered. */
  const [isGuarding, setIsGuarding] = useState(true);
  const guardingRef = useRef(true);
  const formRef = useRef(null);

  const standDown = useCallback(() => {
    if (!guardingRef.current) return;
    guardingRef.current = false;
    setIsGuarding(false);
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form || !isGuarding) return undefined;

    const sweep = () => {
      if (!guardingRef.current) return;
      for (const input of realInputs(form)) {
        if (input.value !== "") clearInput(input);
      }
    };

    const handleAnimationStart = (event) => {
      if (event.animationName !== AUTOFILL_ANIMATION) return;
      if (!guardingRef.current) return;
      if (!(event.target instanceof window.HTMLInputElement)) return;
      if (event.target.classList.contains("inlearn-select-search")) return;
      clearInput(event.target);
    };

    /* Any real gesture inside the form hands control over. pointerdown rather
       than click, so the handover happens before Chrome opens its dropdown. */
    form.addEventListener("pointerdown", standDown);
    form.addEventListener("keydown", standDown);
    form.addEventListener("animationstart", handleAnimationStart, true);

    sweep();
    const timerId = window.setInterval(sweep, 200);

    return () => {
      window.clearInterval(timerId);
      form.removeEventListener("pointerdown", standDown);
      form.removeEventListener("keydown", standDown);
      form.removeEventListener("animationstart", handleAnimationStart, true);
    };
  }, [isGuarding, standDown]);

  return {formRef, isGuarding};
}
