import googleIcon from "../assets/google.svg";
import linkedinIcon from "../../../shared/assets/icons/linkedin-dark.svg";

/* Signing in with somebody else's account.

   Both providers show in both tabs; only the verb changes, because on the
   Register tab these create an account rather than sign into an existing one.
   The green button above them stays "Register" either way.

   LinkedIn is here and works as far as this code is concerned - what it is
   still missing is a set of keys in the Strapi panel. */
const PROVIDERS = [
  {id: "google", label: "Google", icon: googleIcon},
  {id: "linkedin", label: "LinkedIn", icon: linkedinIcon},
];

function AuthProviders({isLogin, isOpen, onSignIn}) {
  return (
    <>
      <div className="inlearn-auth-divider">
        <span />
        <b>OR</b>
        <span />
      </div>

      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="inlearn-social"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onSignIn(provider.id)}
        >
          <img src={provider.icon} alt="" loading="lazy" />
          {isLogin ? "Log in" : "Sign up"} with {provider.label}
        </button>
      ))}
    </>
  );
}

export default AuthProviders;
