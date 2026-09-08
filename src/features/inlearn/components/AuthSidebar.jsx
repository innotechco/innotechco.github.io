import {useState} from "react";

import appleIcon from "../assets/apple.svg";
import googleIcon from "../assets/google.svg";
import {inlearnCopy} from "../data/inlearnContent.js";
import {signInWithEmail, signInWithProvider} from "../services/authService.js";
import InnotechLogo from "./InnotechLogo.jsx";

function AuthSidebar({isOpen, mode, onClose, onModeChange}) {
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("");
  const isLogin = mode === "login";

  const handleSubmit = (event) => {
    event.preventDefault();
    const session = signInWithEmail({email, remember});
    setStatus(`Signed in as ${session.displayName}`);
  };

  const handleSocialSignIn = (provider) => {
    const session = signInWithProvider(provider);
    setStatus(`Signed in with ${session.provider}`);
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
          <h2>{isLogin ? "Welcome back" : "Get started"}</h2>
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

        <form className="inlearn-auth-form" onSubmit={handleSubmit}>
          <div className="inlearn-auth-fields" key={mode}>
            {isLogin ? null : <input type="text" placeholder="Name" tabIndex={isOpen ? 0 : -1} />}
            <input
              type="email"
              placeholder="Business Email"
              value={email}
              tabIndex={isOpen ? 0 : -1}
              onChange={(event) => setEmail(event.target.value)}
            />
            {isLogin ? null : <input type="tel" placeholder="Phone" tabIndex={isOpen ? 0 : -1} />}
            {isLogin ? null : (
              <select defaultValue="" tabIndex={isOpen ? 0 : -1}>
                <option value="" disabled>
                  Region
                </option>
                <option>GCC</option>
                <option>Turkey</option>
                <option>Global</option>
              </select>
            )}
            <input type="password" placeholder="Password" tabIndex={isOpen ? 0 : -1} />
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
          <button type="button" className="inlearn-forgot" tabIndex={isOpen ? 0 : -1}>
            Forgot password?
          </button>
          <button type="submit" className="inlearn-submit" tabIndex={isOpen ? 0 : -1}>
            {isLogin ? "Log in" : "Register"}
          </button>
        </form>

        <div className="inlearn-auth-divider">
          <span />
          <b>OR</b>
          <span />
        </div>

        <button
          type="button"
          className="inlearn-social"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => handleSocialSignIn("google")}
        >
          <img src={googleIcon} alt="" loading="lazy" />
          Sign in with Google
        </button>
        <button
          type="button"
          className="inlearn-social"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => handleSocialSignIn("apple")}
        >
          <img src={appleIcon} alt="" loading="lazy" />
          Sign in with Apple
        </button>
        <p className="inlearn-auth-status" aria-live="polite">
          {status}
        </p>
      </aside>
    </div>
  );
}

export default AuthSidebar;
