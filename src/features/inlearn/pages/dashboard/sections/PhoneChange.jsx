import PhoneField from "../../../auth/PhoneField.jsx";

/* The phone row: an ordinary field, saved with the rest of the form.
 *
 * It was briefly a journey - type a new number, take a code by text message,
 * confirm it - and that was dropped, because proving a number means paying
 * for every message sent to prove it. So the number is taken on trust here,
 * which is the same trust sign-up already places in it.
 *
 * Nothing on the account leans on the number being proved. The day something
 * does - recovering an account, most likely - the routes that confirm one
 * with a code are still in the API and still work, and this file is where
 * that would be picked back up.
 */
function PhoneChange({dialCode, phone, onEdit}) {
  /* The dialling code is held beside the field, never inside it, so what is
     typed here is only the part after it. The two are joined on the way out. */
  const typed =
    dialCode && String(phone ?? "").startsWith(dialCode)
      ? String(phone).slice(dialCode.length)
      : phone ?? "";

  return (
    <PhoneField
      dialCode={dialCode}
      value={typed}
      onChange={(digits) =>
        onEdit?.(digits.trim() ? `${dialCode}${digits}`.replace(/\s/g, "") : "")
      }
    />
  );
}

export default PhoneChange;
