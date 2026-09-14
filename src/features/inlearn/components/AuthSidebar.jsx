import {useEffect, useState} from "react";

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
} from "../services/authService.js";
import {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkRequired,
  firstProblem,
} from "../services/formValidation.js";
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

function AuthSidebar({isOpen, mode, onClose, onModeChange, onSignedIn}) {
  const [form, setForm] = useState(emptyForm);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
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

  /* Coming back from a provider: Strapi hands over an access token in the URL,
     which is traded for a session and then wiped so a reload cannot replay it. */
  useEffect(() => {
    const callback = readProviderCallback();
    if (!callback) return;

    let isActive = true;
    completeProviderSignIn({...callback, remember: true})
      .then((session) => {
        if (isActive) onSignedIn?.(session, "login");
      })
      .catch((callbackError) => {
        if (isActive) setError(callbackError.message);
      })
      .finally(() => {
        window.history.replaceState({}, "", window.location.pathname);
      });

    return () => {
      isActive = false;
    };
  }, [onSignedIn]);

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
    window.sessionStorage.setItem("inlearn-auth-provider", provider);
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
        <form className="inlearn-auth-form" noValidate onSubmit={handleSubmit}>
          <div className="inlearn-auth-fields" key={mode}>
            {isLogin ? null : (
              <input
                type="text"
                placeholder="Name"
                autoComplete="name"
                value={form.name}
                tabIndex={isOpen ? 0 : -1}
                onChange={setField("name")}
              />
            )}
            <input
              type="email"
              placeholder={isLogin ? "Email" : "Business Email"}
              autoComplete="email"
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
              autoComplete={isLogin ? "current-password" : "new-password"}
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
          <button
            type="button"
            className="inlearn-forgot"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setIsForgotOpen(true)}
          >
            Forgot password?
          </button>

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
