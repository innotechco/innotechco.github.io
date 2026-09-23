import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import EmailChange from "./EmailChange.jsx";
import InlearnSelect from "../../../auth/InlearnSelect.jsx";
import PasswordChange from "./PasswordChange.jsx";
import PhoneChange from "./PhoneChange.jsx";
import {API_URL, fetchProfile, saveProfile, uploadAvatar} from "../../../services/authService.js";
import {CameraIcon} from "../icons.jsx";
import {checkRequired, firstProblem} from "../../../services/formValidation.js";
import {clearDraft, editablePart, hasEdits, holdDraft, readDraft} from "./profileDraft.js";
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
const EMPTY = {fullName: "", email: "", phone: "", region: "", avatar: null, pendingEmail: null};

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

function ProfileSection({onProfileChange, onSessionChange, onToast}) {
  /* A draft from an earlier visit to this page, if the visitor left mid-edit.
     Read here rather than after the answer so the fields never flash empty. */
  const [profile, setProfile] = useState(() => ({...EMPTY, ...(readDraft() ?? {})}));
  /* What the server last told us it holds. null until it has told us - which
     is a different thing from "holds nothing", and the difference is what
     stops this page saving over a profile it never managed to read. */
  const [saved, setSaved] = useState(null);
  const [status, setStatus] = useState("loading");
  const [problem, setProblem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const isMounted = useRef(true);

  /* Set on the way in as well as cleared on the way out: in development the
     effects run twice, and a flag only ever set false would leave the second
     mount believing it had already been thrown away. */
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* Only the asking. Putting the page back into its loading state belongs to
     whoever asked for a second go, not here: on the first go the page starts
     that way already, and setting state that is already set from inside an
     effect is a render nobody needed. */
  const load = useCallback(() => {
    fetchProfile()
      .then((answer) => {
        if (!isMounted.current) return;
        setSaved(answer);
        /* The draft wins over the answer, for the rows it covers. Somebody who
           typed a new phone number and stepped away came back for that number,
           not for the one they are replacing. */
        setProfile({...EMPTY, ...answer, ...(readDraft() ?? {})});
        setStatus("ready");
        onProfileChange?.(answer);
      })
      .catch((error) => {
        if (!isMounted.current) return;
        setProblem(error.message);
        setStatus("error");
      });
  }, [onProfileChange]);

  useEffect(load, [load]);

  /* The way back from a failed read. The state the effect above is allowed to
     assume on a first render has to be put back by hand on a second. */
  const retry = () => {
    setStatus("loading");
    setProblem("");
    load();
  };

  /* The dialling code belongs to the region, the same way it does in the
     sign-up panel: choosing a country is what tells the phone field what to
     put in front of the number. */
  const dialCode = useMemo(
    () => countries.find(({name}) => name === profile.region)?.dial ?? "",
    [profile.region],
  );

  const isDirty = hasEdits(profile, saved);

  /* The one case holding the draft cannot cover: the tab itself going away
     takes the draft with it, so the browser is asked to check first. Only
     while there is something to lose - a page that warns when it has nothing
     to say is a page people learn to click through. */
  useEffect(() => {
    if (!isDirty) return undefined;

    const warn = (event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const edit = (field, value) => {
    const next = {...profile, [field]: value};
    setProfile(next);
    /* Held on every keystroke rather than on the way out: leaving this page is
       not something the page is told about, it simply stops existing. */
    holdDraft(next);
    setProblem("");
  };

  /* Anything that changes the stored profile comes back through here, so the
     page and the rest of the module see the same answer at the same moment. */
  const adopt = (answer) => {
    setProfile({...EMPTY, ...answer});
    setSaved(answer);
    /* The draft has become the stored profile, so there is no longer an
       unsaved version of anything to keep. */
    clearDraft();
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
      const answer = await uploadAvatar(file);
      /* The picture is the only row that saves on its own while the form may
         be mid-edit, so the answer is taken for everything EXCEPT the three
         rows being typed in - adopting it wholesale would throw those away. */
      setProfile((current) => ({...EMPTY, ...answer, ...editablePart(current)}));
      setSaved((current) => (current ? {...current, avatar: answer.avatar} : answer));
      onProfileChange?.(answer);
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

  /* Nothing was read, so there is nothing to edit and nothing safe to send.
   *
   * The form used to stay open here, over empty fields, and that was the worst
   * of the three things it could have done: a visitor who took the blank rows
   * at face value and pressed Apply Changes sent empty values for every row
   * this form owns, and was told their details were saved while their phone
   * number and region were being written over. Offering the failure and the
   * way to try again is the whole of the page until the answer arrives.
   */
  if (status === "error") {
    return (
      <section className="inlearn-profile" aria-label="Profile">
        <div className="inlearn-profile-card inlearn-profile-trouble">
          <p className="inlearn-profile-note is-problem" role="status">
            {problem}
          </p>
          <button type="button" className="inlearn-profile-go" onClick={retry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

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

          {/* A real file input, hidden, opened by the round button beside it -
              which is itself focusable, so the picker is reachable from the
              keyboard as well as the pointer. */}
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
            disabled={isUploading || isBusy}
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

          <EmailChange
            email={profile.email}
            pendingEmail={profile.pendingEmail}
            isBusy={isBusy}
            onChanged={adopt}
            onToast={onToast}
          />

          {/* Region before Phone, because the region is what decides the
              dialling code - the same order the sign-up panel uses. */}
          <InlearnSelect
            value={profile.region}
            options={countryNames}
            placeholder="Region"
            onChange={(region) => edit("region", region)}
          />

          <PhoneChange
            dialCode={dialCode}
            phone={profile.phone}
            isBusy={isBusy}
            onChanged={adopt}
            onToast={onToast}
          />

          <PasswordChange
            email={profile.email}
            isBusy={isBusy}
            onSessionChange={onSessionChange}
            onToast={onToast}
          />
        </div>

        {/* One line, in one place, whichever way it went. role="status" so a
            screen reader is told without being interrupted.

            The unsaved note lives here too, rather than in a corner of its
            own: it is the same question - what is this form telling me right
            now - and a problem is the more urgent answer, so it comes first. */}
        <p
          className={`inlearn-profile-message ${
            problem ? "is-problem" : isDirty && !isUploading ? "is-pending" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {problem ||
            (isUploading
              ? "Uploading your picture…"
              : isDirty
                ? "You have unsaved changes."
                : "")}
        </p>

        {/* Off until there is something to save. A button that sends the same
            three values back unchanged is a request that can only fail or do
            nothing, and its being off is also how the page answers "did that
            save?" without being asked. */}
        <button type="submit" className="inlearn-profile-apply" disabled={isBusy || !isDirty}>
          {status === "saving" ? "Saving…" : "Apply Changes"}
        </button>
      </form>
    </section>
  );
}

export default ProfileSection;
