import {useEffect, useMemo, useRef, useState} from "react";

import EmailChange from "./EmailChange.jsx";
import InlearnSelect from "../../../auth/InlearnSelect.jsx";
import PasswordChange from "./PasswordChange.jsx";
import PhoneField from "../../../auth/PhoneField.jsx";
import {API_URL, fetchProfile, saveProfile, uploadAvatar} from "../../../services/authService.js";
import {CameraIcon} from "../icons.jsx";
import {checkRequired, firstProblem} from "../../../services/formValidation.js";
import {countries} from "../../../data/countries.js";

/* The Profile page: what the site knows about the visitor, and the form that
 * changes it.
 *
 * Filled from the server rather than from the session the navbar is holding.
 * The session carries a name and an address because that is all a greeting
 * needs; the phone, the region and the picture have been nowhere since
 * registration. Asking the server is also the only way the form can show what
 * is actually stored rather than what this browser last sent.
 *
 * Three of the rows save together with Apply Changes. The password and the
 * address each need proving - a current password, or a code read from a new
 * inbox - so each is its own small journey rather than a field on this form.
 */

const countryNames = countries.map(({name}) => name);

/* An empty profile rather than nothing, so the fields exist before the answer
   arrives and the layout does not jump when it does. */
const EMPTY = {fullName: "", email: "", phone: "", region: "", avatar: null};

/* Strapi answers with a path, not a URL: the picture lives beside the API, not
   beside the site. */
function pictureUrl(avatar) {
  if (!avatar) return "";
  return /^https?:\/\//.test(avatar) ? avatar : `${API_URL}${avatar}`;
}

function initialOf(profile) {
  const source = profile.fullName || profile.email || "";
  const first = source.trim().charAt(0);
  return first ? first.toUpperCase() : "?";
}

function ProfileSection({onProfileChange, onToast}) {
  const [profile, setProfile] = useState(EMPTY);
  const [status, setStatus] = useState("loading");
  const [problem, setProblem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    fetchProfile()
      .then((answer) => {
        if (!isActive) return;
        setProfile({...EMPTY, ...answer});
        setStatus("ready");
      })
      .catch((error) => {
        if (!isActive) return;
        setProblem(error.message);
        setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, []);

  /* The dialling code belongs to the region, the same way it does in the
     sign-up panel: choosing a country is what tells the phone field what to
     put in front of the number. */
  const dialCode = useMemo(
    () => countries.find(({name}) => name === profile.region)?.dial ?? "",
    [profile.region],
  );

  const edit = (field, value) => {
    setProfile((current) => ({...current, [field]: value}));
    setProblem("");
  };

  /* Anything that changes the stored profile comes back through here, so the
     page and the rest of the module see the same answer at the same moment. */
  const adopt = (answer) => {
    setProfile({...EMPTY, ...answer});
    onProfileChange?.(answer);
  };

  const pickPicture = async (event) => {
    const file = event.target.files?.[0];
    /* Cleared straight away so choosing the same file twice still counts as a
       change - without this, a failed upload cannot be retried. */
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setProblem("");

    try {
      adopt(await uploadAvatar(file));
      onToast?.({message: "Your picture is updated."});
    } catch (error) {
      setProblem(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    const trouble = firstProblem([checkRequired(profile.fullName, "name")]);
    if (trouble) {
      setProblem(trouble);
      return;
    }

    setStatus("saving");
    setProblem("");

    try {
      /* The server's copy, not this form's: it trims, and showing what was
         actually stored is the only honest confirmation. */
      adopt(await saveProfile(profile));
      /* The toast rather than a line on the form: it is the module's one place
         for "that worked", the basket already uses it, and a confirmation that
         appears where every other confirmation appears is one the visitor does
         not have to go looking for. Problems stay here, beside the field that
         caused them. */
      onToast?.({message: "Your details are saved."});
    } catch (error) {
      setProblem(error.message);
    } finally {
      setStatus("ready");
    }
  };

  const isBusy = status === "loading" || status === "saving";
  const picture = pictureUrl(profile.avatar);

  return (
    <section className="inlearn-profile" aria-label="Profile">
      <form className="inlearn-profile-card" onSubmit={submit} noValidate>
        <div className="inlearn-profile-portrait">
          {picture ? (
            <img className="inlearn-profile-photo" src={picture} alt="" loading="lazy" />
          ) : (
            <span className="inlearn-profile-avatar" aria-hidden="true">
              {initialOf(profile)}
            </span>
          )}

          {/* A real file input, hidden, with the round button as its label -
              so the picker opens from the keyboard as well as the pointer. */}
          <input
            ref={fileRef}
            className="inlearn-profile-file"
            type="file"
            accept="image/*"
            onChange={pickPicture}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            className="inlearn-profile-camera"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            aria-label="Change your picture"
            title="Change your picture"
          >
            <CameraIcon />
          </button>
        </div>

        <div className="inlearn-profile-fields">
          <input
            className="inlearn-profile-input"
            type="text"
            name="fullName"
            placeholder="Name"
            autoComplete="name"
            value={profile.fullName}
            disabled={isBusy}
            onChange={(event) => edit("fullName", event.target.value)}
          />

          <EmailChange email={profile.email} onChanged={adopt} onToast={onToast} />

          {/* Region before Phone, because the region is what decides the
              dialling code - the same order the sign-up panel uses. */}
          <InlearnSelect
            value={profile.region}
            options={countryNames}
            placeholder="Region"
            onChange={(region) => edit("region", region)}
          />

          <PhoneField
            dialCode={dialCode}
            value={profile.phone}
            onChange={(phone) => edit("phone", phone)}
          />

          <PasswordChange onToast={onToast} />
        </div>

        {/* One line, in one place, whichever way it went. role="status" so a
            screen reader is told without being interrupted. */}
        <p
          className={`inlearn-profile-message ${problem ? "is-problem" : ""}`}
          role="status"
          aria-live="polite"
        >
          {problem || (isUploading ? "Uploading your picture…" : "")}
        </p>

        <button type="submit" className="inlearn-profile-apply" disabled={isBusy}>
          {status === "saving" ? "Saving…" : "Apply Changes"}
        </button>
      </form>
    </section>
  );
}

export default ProfileSection;
