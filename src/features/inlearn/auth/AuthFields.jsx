import {countryNames} from "../data/countries.js";
import InlearnSelect from "./InlearnSelect.jsx";
import PasswordField from "./PasswordField.jsx";
import PhoneField from "./PhoneField.jsx";

/* What the panel asks for.

   One set of fields in two shapes rather than two forms: logging in needs an
   email and a password, registering needs four more, and `isLogin` is the only
   thing that decides which are drawn.

   Region comes before Phone, and Phone stays disabled until a region is
   chosen, because the dialling code is what the region decides.

   tabIndex is passed down from the panel: while the panel is shut it is still
   in the document, and a field nobody can see must not be reachable by
   pressing Tab. */
function AuthFields({isLogin, form, dialCode, isOpen, onFieldChange, onRegionChange, onPhoneChange}) {
  const tabIndex = isOpen ? 0 : -1;

  return (
    <div className="inlearn-auth-fields" key={isLogin ? "login" : "register"}>
      {isLogin ? null : (
        <input
          type="text"
          placeholder="Name"
          autoComplete="off"
          value={form.name}
          tabIndex={tabIndex}
          onChange={onFieldChange("name")}
        />
      )}

      <input
        type="email"
        placeholder={isLogin ? "Email" : "Business Email"}
        autoComplete="off"
        value={form.email}
        tabIndex={tabIndex}
        onChange={onFieldChange("email")}
      />

      {isLogin ? null : (
        <InlearnSelect
          value={form.region}
          options={countryNames}
          placeholder="Region"
          tabIndex={tabIndex}
          onChange={onRegionChange}
        />
      )}

      {isLogin ? null : (
        <PhoneField
          dialCode={dialCode}
          value={form.phone}
          tabIndex={tabIndex}
          onChange={onPhoneChange}
        />
      )}

      <PasswordField
        placeholder="Password"
        autoComplete="off"
        value={form.password}
        tabIndex={tabIndex}
        onChange={onFieldChange("password")}
      />

      {/* The only guard against a typo locking someone out of the account they
          are creating: a password is typed blind, so it is typed twice. */}
      {isLogin ? null : (
        <PasswordField
          placeholder="Confirm password"
          value={form.passwordConfirmation}
          tabIndex={tabIndex}
          onChange={onFieldChange("passwordConfirmation")}
        />
      )}
    </div>
  );
}

export default AuthFields;
