/* Where an online course is actually taught.
 *
 * A PLACEHOLDER. There is no platform yet, so this stands in: a name, a line
 * of wording and an address on example.com, which is the domain reserved for
 * exactly this and can never become somebody's real site. It is written here
 * so the box can be built and judged against the rest of the page.
 *
 * When the real platform arrives, this object is the only thing that changes -
 * the card reads it and knows nothing else about it. If the platform turns out
 * to differ per course, this becomes the fallback for what the server sends
 * rather than the answer itself, and the card still does not change.
 */
export const ONLINE_PLATFORM = {
  name: "INLEARN Live",
  /* The sentence beside the name. It says what pressing the box does, because
     the box is the link and nothing else on it looks like one. */
  note: "Sessions are taught here. Opens in a new tab.",
  url: "https://example.com/inlearn-live",
  /* What the control says. Separate from the note so the verb can be changed
     without rewriting the sentence around it. */
  action: "Join the class",
};
