/* A username and password pair rendered first inside a form while
   useNoAutofill still has the guard up. Nothing reads them: they exist to be
   filled instead of the fields beside them, because Chrome's automatic fill
   takes the first such pair it finds.

   Off-screen rather than hidden - see inlearn.css - since autofill skips a
   field with display:none, and a decoy it skips is no decoy at all. */
function AutofillDecoys() {
  return (
    <div className="inlearn-autofill-decoys" aria-hidden="true">
      <input
        data-inlearn-decoy=""
        type="text"
        name="username"
        autoComplete="username"
        tabIndex={-1}
        defaultValue=""
      />
      <input
        data-inlearn-decoy=""
        type="password"
        name="password"
        autoComplete="current-password"
        tabIndex={-1}
        defaultValue=""
      />
    </div>
  );
}

export default AutofillDecoys;
