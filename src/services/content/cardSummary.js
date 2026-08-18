import {CARD_SUMMARY_WORD_LIMIT} from "../../config/articleCards.config.js";

/**
 * Cuts a card summary to a fixed number of words and appends "..." when
 * something was removed. Used by every article card across the site so the
 * word limit is defined once in `articleCards.config.js`.
 */
export function truncateWords(value, limit = CARD_SUMMARY_WORD_LIMIT) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";

  const words = text.split(" ");
  if (words.length <= limit) return text;

  return `${words.slice(0, limit).join(" ").replace(/[.,;:!?-]+$/, "")}...`;
}
