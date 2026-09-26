import {API_URL} from "./auth/client.js";
import {authorizedFetch} from "./auth/tokens.js";

/* The courses somebody owns, and the media inside them.
 *
 * No file address ever arrives here. A session says which kinds of media it
 * has; asking for one trades a token for a two-minute ticket, and the ticket
 * is what the <video> element is pointed at. That is the only shape that
 * works: a media element fetches its own source and cannot carry a header.
 */

async function readProblem(response) {
  const payload = await response.json().catch(() => null);
  return payload?.error?.message || "Something went wrong. Try again.";
}

async function get(path) {
  let response;
  try {
    response = await authorizedFetch(path);
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }
  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
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

export function fetchMyCourses() {
  return get("/api/inlearn/my-courses");
}

export function setSessionComplete(courseId, sessionId, isComplete) {
  return post("/api/inlearn/progress", {courseId, sessionId, isComplete});
}

/* The address a player is pointed at. Fetched at the moment of opening rather
   than kept with the session, so a ticket is never older than the click that
   asked for it. */
/* The names the server answers to.
 *
 * Exported rather than typed at each call site. This one was written as "note"
 * in one place and "notes" in four others, on both sides of the request, and
 * every press of the Notes button was refused as an unknown kind - a fault
 * that cost an afternoon and looked like a broken upload. A name shared
 * between two programs is worth one constant. */
export const MEDIA = {
  video: "video",
  audio: "audio",
  notes: "notes",
};

export async function openMedia(courseId, sessionId, kind, fileId) {
  const {ticket} = await post("/api/inlearn/media-ticket", {courseId, sessionId, kind, fileId});
  return `${API_URL}/api/inlearn/media/${ticket}`;
}
