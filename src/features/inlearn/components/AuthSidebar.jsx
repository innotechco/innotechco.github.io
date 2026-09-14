import {useEffect, useRef, useState} from "react";

import googleIcon from "../assets/google.svg";
import linkedinIcon from "../../../shared/assets/icons/linkedin-dark.svg";
import {countryNames, dialCodeFor} from "../data/countries.js";
import {inlearnCopy} from "../data/inlearnContent.js";
import {
  completeProviderSignIn,
  logIn,
  providerSignInUrl,
  readProviderCallback,
  register,
  rememberProviderIntent,
} from "../services/authService.js";
import {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkRequired,
  firstProblem,
} from "../services/formValidation.js";
import {useNoAutofill} from "../hooks/useNoAutofill.js";
import AutofillDecoys from "./AutofillDecoys.jsx";
import ForgotPasswordDialog from "./ForgotPasswordDialog.jsx";
import InlearnSelect from "./InlearnSelect.jsx";
import InnotechLogo from "./InnotechLogo.jsx";
import PasswordField from "./PasswordField.jsx";
import PhoneField from "./PhoneField.jsx";

/* Both show in both tabs; only the verb changes, because on the Register tab
   these create an account rather than sign into an existing one. */
const authProviders = [
  {id: "google", label: "Google", icon: googleIcon},
  {id: "linkedin", label: "LinkedIn", icon: linkedinIcon},
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  region: "",
  password: "",
  passwordConfirmation: "",
};

function AuthSidebar({isOpen, mode, onClose, onModeChange, onSignedIn, onProviderError}) {
  const [form, setForm] = useState(emptyForm);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const {formRef, isGuarding} = useNoAutofill();
  const isLogin = mode === "login";

  const setField = (field) => (event) =>
    setForm((current) => ({...current, [field]: event.target.value}));

  const dialCode = dialCodeFor(form.region);

  /* Changing the region changes the calling code, so the digits typed under the
     old one are cleared rather than silently re-labelled: +49 912... is not the
     same number as +98 912... and keeping the tail would invent one. */
  const handleRegionChange = (region) =>
    setForm((current) => ({
      ...current,
      region,
      phone: region === current.region ? current.phone : "",
    }));

  /* Coming back from a provider. Strapi 5.53 returns a clean address and keeps
     the provider's answer in a session cookie, so the round trip is recognised
     by the intent stored on the way out rather than by anything in the URL, and
     one more call trades that cookie for a session here. */
  const hasHandledProvider = useRef(false);

  useEffect(() => {
    /* Once per visit. The parent rebuilds these callbacks on every render, so
       this effect is torn down and set up again whenever anything else changes
       state - and the exchange must not be started a second time, because the
       first has already spent the cookie.

       There is deliberately no "still mounted" flag around the result. An
       earlier version had one, and a re-render arriving mid-exchange - the
       restored session landing, say - flipped it before the answer came back,
       so a sign-in that had actually succeeded was thrown away. The name then
       appeared only after a reload, when the stored session was read again. */
    if (hasHandledProvider.current) return;

    const callback = readProviderCallback();
    if (!callback) return;

    hasHandledProvider.current = true;

    completeProviderSignIn({...callback, remember: true})
      .then(({session, isNewAccount}) =>
        onSignedIn?.(session, isNewAccount ? "register" : "login"),
      )
      .catch((callbackError) => {
        /* Shown rather than swallowed, and the panel is opened to show it: a
           provider sign-in that fails in silence looks like a dead button. */
        setError(callbackError.message);
        onProviderError?.();
      });
  }, [onSignedIn, onProviderError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problem = firstProblem([
      isLogin ? "" : checkRequired(form.name, "name"),
      checkEmail(form.email),
      checkPassword(form.password, {isNew: !isLogin}),
      isLogin ? "" : checkPasswordMatch(form.password, form.passwordConfirmation),
    ]);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setIsBusy(true);
    try {
      const session = isLogin
        ? await logIn({email: form.email, password: form.password, remember})
        : await register({
            ...form,
            /* The field holds the national part; the server is given the number
               a person would dial from anywhere. */
            phone: form.phone.trim() ? `${dialCode}${form.phone.replace(/\D/g, "")}` : "",
            remember,
          });
      setForm(emptyForm);
      onSignedIn?.(session, isLogin ? "login" : "register");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsBusy(false);
    }
  };

  /* A full page redirect, not a fetch - the provider needs to show its own
     consent screen and Strapi holds the half of the exchange we must not ship
     to the browser. */
  const handleProviderSignIn = (provider) => {
    const url = providerSignInUrl(provider);
    if (!url) {
      setError("The INLEARN API is not connected yet.");
      return;
    }
    /* Remembered before leaving, because the return carries nothing that says
       which provider it came from - or that it is a return at all. */
    rememberProviderIntent(provider);
    window.location.assign(url);
  };

  return (
    <div className={`inlearn-auth-layer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <button
        type="button"
        className="inlearn-auth-backdrop"
        aria-label="Close authentication panel"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />
      <aside className="inlearn-auth-sidebar" data-inlearn-auth>
        <InnotechLogo />
        <div className="inlearn-auth-heading">
          <h2>Get started</h2>
          <p>{inlearnCopy.authIntro}</p>
        </div>

        <div className="inlearn-auth-tabs" role="tablist" aria-label="Authentication mode">
          <span className={`inlearn-auth-tab-indicator ${isLogin ? "is-login" : "is-register"}`} />
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onModeChange("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onModeChange("register")}
          >
            Register
          </button>
        </div>

        {/* noValidate: the grey system bubble is replaced by our own line below */}
        <form
          ref={formRef}
          className="inlearn-auth-form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {isGuarding ? <AutofillDecoys /> : null}
          <div className="inlearn-auth-fields" key={mode}>
            {isLogin ? null : (
              <input
                type="text"
                placeholder="Name"
                autoComplete="off"
                value={form.name}
                tabIndex={isOpen ? 0 : -1}
                onChange={setField("name")}
              />
            )}
            <input
              type="email"
              placeholder={isLogin ? "Email" : "Business Email"}
              autoComplete="off"
              value={form.email}
              tabIndex={isOpen ? 0 : -1}
              onChange={setField("email")}
            />
            {isLogin ? null : (
              <InlearnSelect
                value={form.region}
                options={countryNames}
                placeholder="Region"
                tabIndex={isOpen ? 0 : -1}
                onChange={handleRegionChange}
              />
            )}
            {isLogin ? null : (
              <PhoneField
                dialCode={dialCode}
                value={form.phone}
                tabIndex={isOpen ? 0 : -1}
                onChange={(phone) => setForm((current) => ({...current, phone}))}
              />
            )}
            <PasswordField
              placeholder="Password"
              autoComplete="off"
              value={form.password}
              tabIndex={isOpen ? 0 : -1}
              onChange={setField("password")}
            />
            {isLogin ? null : (
              <PasswordField
                placeholder="Confirm password"
                value={form.passwordConfirmation}
                tabIndex={isOpen ? 0 : -1}
                onChange={setField("passwordConfirmation")}
              />
            )}
          </div>

          <label className="inlearn-remember">
            <input
              type="checkbox"
              checked={remember}
              tabIndex={isOpen ? 0 : -1}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Keep me signed in</span>
          </label>
          {/* Only on the Log in tab: someone creating an account has no password
              to have forgotten. */}
          {isLogin ? (
            <button
              type="button"
              className="inlearn-forgot"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsForgotOpen(true)}
            >
              Forgot password?
            </button>
          ) : null}

          {error ? (
            <p className="inlearn-auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="inlearn-submit" disabled={isBusy} tabIndex={isOpen ? 0 : -1}>
            {isBusy ? "Please wait…" : isLogin ? "Log in" : "Register"}
          </button>
        </form>

        <div className="inlearn-auth-divider">
          <span />
          <b>OR</b>
          <span />
        </div>

        {authProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="inlearn-social"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => handleProviderSignIn(provider.id)}
          >
            <img src={provider.icon} alt="" loading="lazy" />
            {isLogin ? "Log in" : "Sign up"} with {provider.label}
          </button>
        ))}
      </aside>

      {isForgotOpen ? (
        <ForgotPasswordDialog
          initialEmail={form.email}
          onClose={() => setIsForgotOpen(false)}
          onSignedIn={(session) => {
            setIsForgotOpen(false);
            onSignedIn?.(session, "login");
          }}
        />
      ) : null}
    </div>
  );
}

export default AuthSidebar;
