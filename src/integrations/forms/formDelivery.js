/* Both site forms post here. Forminit stores the submission (and any file
   attachments) on the form dashboard and sends the notification email to
   arsya.s@innotechco.ae - the recipient is configured on the Forminit form
   itself, not in this code.

   Field names follow Forminit's fi-{blockType}-{name} convention so each value
   lands in its own labelled block instead of a blob of text. */

const FORMINIT_FORM_ID = "8szsqgyhaei";
const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/* Without the JSON Accept header this endpoint answers with its HTML
   thank-you page instead of a parseable result. */
export async function submitToForminit(formData) {
  const response = await fetch(FORMINIT_ENDPOINT, {
    method: "POST",
    body: formData,
    headers: {Accept: "application/json"},
  });

  const responseText = await response.text();
  let data;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error("Forminit returned an unexpected response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Forminit submission failed.");
  }

  return data;
}
