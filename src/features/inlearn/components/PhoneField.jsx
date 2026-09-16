/* The calling code is shown, not typed: it is held beside the field rather than
   inside it, so a Backspace cannot delete it and changing the region cannot
   leave the old code stranded in the middle of a number.
   The two halves are joined only on the way to the server. */
function PhoneField({dialCode, value, tabIndex, onChange, ...guard}) {
  const hasRegion = Boolean(dialCode);

  /* Digits and separators only. A letter here is always a mistake, and catching
     it as it is typed beats a red line under the form after submitting. */
  const handleChange = (event) => {
    onChange(event.target.value.replace(/[^\d\s-]/g, ""));
  };

  return (
    <div className={`inlearn-phone-field ${hasRegion ? "" : "is-waiting"}`}>
      <span className="inlearn-phone-code" aria-hidden={!hasRegion}>
        {hasRegion ? dialCode : "+"}
      </span>
      <input
        type="tel"
        inputMode="tel"
        placeholder={hasRegion ? "Phone number" : "Choose a region first"}
        autoComplete="off"
        aria-label="Phone number"
        value={value}
        disabled={!hasRegion}
        tabIndex={tabIndex}
        onChange={handleChange}
        {...guard}
      />
    </div>
  );
}

export default PhoneField;
