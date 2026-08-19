import {useEffect, useMemo, useRef, useState} from "react";

import {countries} from "../../../data/countries";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[+0-9][0-9\s()./-]{5,}$/;
const maxFileSize = 5 * 1024 * 1024;
const web3FormsAccessKey = "7579f50e-7a1a-497f-8c06-a2953370cbe0";
const web3FormsEndpoint = "https://api.web3forms.com/submit";

const defaultValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  country: "",
  requestType: "",
  otherOption: "",
  message: "",
};

function FieldError({children, errorColor}) {
  if (!children) return null;

  return (
    <p
      className={`pointer-events-none absolute left-4 top-full mt-1 break-words font-['Gotham'] text-xs ${errorColor}`}
    >
      {children}
    </p>
  );
}

function RfpForm({content, isDarkMode}) {
  const [values, setValues] = useState(defaultValues);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen] = useState(false);
  const countryRef = useRef(null);
  const otherRef = useRef(null);
  const fileInputRef = useRef(null);

  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-white/70" : "text-black/60";
  const inputBg = isDarkMode ? "bg-black" : "bg-white";
  const inputOutline = isDarkMode ? "outline-white/25" : "outline-black/50";
  const iconColor = isDarkMode ? "text-white" : "text-black";
  const errorColor = isDarkMode ? "text-red-300" : "text-red-600";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const inputTextClassName = `${textColor} ${
    isDarkMode ? "placeholder:text-white/60" : "placeholder:text-black/50"
  }`;
  const fieldFrameClassName = `flex w-full min-w-0 items-center gap-2.5 rounded-[50px] px-4 py-3 outline outline-1 outline-offset-[-1px] ${inputBg}`;
  const getFieldOutline = (field) =>
    errors[field] ? "outline-red-500" : inputOutline;

  const filteredCountries = useMemo(() => {
    const query = values.country.trim().toLowerCase();

    if (!query) return countries;

    return countries.filter((country) => country.toLowerCase().includes(query));
  }, [values.country]);

  const updateValue = (field, value) => {
    setValues((current) => ({...current, [field]: value}));
    setErrors((current) => ({...current, [field]: ""}));
    setSubmitMessage("");
  };

  const selectRequestType = (requestType) => {
    const isOther = requestType === content.otherValue;

    setValues((current) => ({
      ...current,
      requestType,
      otherOption: isOther ? current.otherOption : "",
    }));
    setErrors((current) => ({
      ...current,
      requestType: "",
      otherOption: isOther ? current.otherOption : "",
    }));
    setIsOtherOpen(false);
    setSubmitMessage("");
  };

  const toggleOtherDropdown = () => {
    setValues((current) => ({...current, requestType: content.otherValue}));
    setErrors((current) => ({...current, requestType: ""}));
    setSubmitMessage("");
    setIsOtherOpen((current) => !current);
  };

  const selectOtherOption = (option) => {
    setValues((current) => ({
      ...current,
      requestType: content.otherValue,
      otherOption: option,
    }));
    setErrors((current) => ({...current, requestType: "", otherOption: ""}));
    setIsOtherOpen(false);
    setSubmitMessage("");
  };

  const getCountryMatch = (country) =>
    countries.find(
      (item) => item.toLowerCase() === country.trim().toLowerCase(),
    );

  const validate = (field) => {
    const nextErrors = field ? {...errors} : {};
    const requiredFields = ["name", "company"];

    requiredFields.forEach((requiredField) => {
      if (field && field !== requiredField) return;

      if (!values[requiredField].trim())
        nextErrors[requiredField] = content.errors.required;
      else delete nextErrors[requiredField];
    });

    if (!field || field === "email") {
      if (!emailPattern.test(values.email.trim()))
        nextErrors.email = content.errors.email;
      else delete nextErrors.email;
    }

    if (!field || field === "phone") {
      if (!phonePattern.test(values.phone.trim()))
        nextErrors.phone = content.errors.phone;
      else delete nextErrors.phone;
    }

    if (!field || field === "country") {
      const matchedCountry = getCountryMatch(values.country);

      if (!matchedCountry) {
        nextErrors.country = content.errors.country;
      } else {
        delete nextErrors.country;
        if (matchedCountry !== values.country) {
          setValues((current) => ({...current, country: matchedCountry}));
        }
      }
    }

    if (!field || field === "requestType") {
      if (!values.requestType)
        nextErrors.requestType = content.errors.requestType;
      else delete nextErrors.requestType;
    }

    if (!field || field === "otherOption") {
      if (values.requestType === content.otherValue && !values.otherOption)
        nextErrors.otherOption = content.errors.otherOption;
      else delete nextErrors.otherOption;
    }

    if (!field || field === "files") {
      if (files.some((file) => file.size > maxFileSize))
        nextErrors.files = content.errors.fileSize;
      else delete nextErrors.files;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setFiles(selectedFiles);
    setErrors((current) => ({
      ...current,
      files: selectedFiles.some((file) => file.size > maxFileSize)
        ? content.errors.fileSize
        : "",
    }));
    setSubmitMessage("");
  };

  const removeFile = (fileName) => {
    const nextFiles = files.filter((file) => file.name !== fileName);

    setFiles(nextFiles);
    if (!nextFiles.length && fileInputRef.current)
      fileInputRef.current.value = "";
    setErrors((current) => ({
      ...current,
      files: nextFiles.some((file) => file.size > maxFileSize)
        ? content.errors.fileSize
        : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsCountryOpen(false);
    setSubmitState("submitting");
    setSubmitMessage("");

    const formData = new FormData();
    formData.append("access_key", web3FormsAccessKey);
    formData.append(
      "subject",
      `INNOTECH Request for Proposal - ${values.company.trim()}`,
    );
    formData.append("from_name", values.name.trim());
    formData.append("name", values.name.trim());
    formData.append("company", values.company.trim());
    formData.append("phone", values.phone.trim());
    formData.append("email", values.email.trim());
    formData.append("country", values.country.trim());
    formData.append("request_type", values.requestType);
    formData.append("other_option", values.otherOption || "-");
    formData.append("message", values.message.trim());
    formData.append(
      "attached_file_names",
      files.map((file) => file.name).join(", ") || "-",
    );
    formData.append("page_url", window.location.href);
    files.forEach((file) => formData.append("attachment", file));

    try {
      const response = await fetch(web3FormsEndpoint, {
        method: "POST",
        body: formData,
        headers: {Accept: "application/json"},
      });
      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Web3Forms returned a non-JSON response.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Web3Forms submission failed.");
      }

      setSubmitState("success");
      setSubmitMessage(content.labels.submitSuccess);
      setValues(defaultValues);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error.message
          ? `${content.labels.submitError} ${error.message}`
          : content.labels.submitError,
      );
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };

    if (isCountryOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCountryOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (otherRef.current && !otherRef.current.contains(event.target)) {
        setIsOtherOpen(false);
      }
    };

    if (isOtherOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOtherOpen]);

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-6 rounded-[24px] border p-4 sm:p-6 lg:p-8 ${
        isDarkMode
          ? "border-white/15 bg-white/[0.03]"
          : "border-black/10 bg-black/[0.02]"
      }`}
    >
      <div className="locale-contact-title relative flex min-w-0 items-end px-4">
        <div className="locale-contact-title-circle absolute left-0 top-[-10px] size-9 rounded-full border border-[#37B478] sm:top-[-15px] sm:size-11" />
        <div
          className={`locale-contact-title-text min-w-0 break-words font-['Gotham'] text-lg font-normal sm:text-xl lg:text-2xl ${textColor}`}
        >
          {content.form.title}
        </div>
      </div>

      <p className={`break-words px-4 font-['Gotham'] text-xs ${mutedTextColor}`}>
        {content.form.description}
      </p>

      <form
        className="flex w-full min-w-0 flex-col items-end gap-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="relative min-w-0">
            <div className={`${fieldFrameClassName} ${getFieldOutline("name")}`}>
              <input
                type="text"
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
                onBlur={() => validate("name")}
                className={`w-full min-w-0 flex-1 bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
                placeholder={content.fields.name}
                aria-invalid={Boolean(errors.name)}
                aria-label={content.fields.name}
              />
            </div>
            <FieldError errorColor={errorColor}>{errors.name}</FieldError>
          </div>

          <div className="relative min-w-0">
            <div
              className={`${fieldFrameClassName} ${getFieldOutline("company")}`}
            >
              <input
                type="text"
                value={values.company}
                onChange={(event) => updateValue("company", event.target.value)}
                onBlur={() => validate("company")}
                className={`w-full min-w-0 flex-1 bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
                placeholder={content.fields.company}
                aria-invalid={Boolean(errors.company)}
                aria-label={content.fields.company}
              />
            </div>
            <FieldError errorColor={errorColor}>{errors.company}</FieldError>
          </div>

          <div className="relative min-w-0">
            <div
              className={`${fieldFrameClassName} ${getFieldOutline("phone")}`}
            >
              <input
                type="tel"
                dir="ltr"
                value={values.phone}
                onChange={(event) => updateValue("phone", event.target.value)}
                onBlur={() => validate("phone")}
                className={`w-full min-w-0 flex-1 bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
                placeholder={content.fields.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-label={content.fields.phone}
              />
            </div>
            <FieldError errorColor={errorColor}>{errors.phone}</FieldError>
          </div>

          <div className="relative min-w-0">
            <div
              className={`${fieldFrameClassName} ${getFieldOutline("email")}`}
            >
              <input
                type="email"
                dir="ltr"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                onBlur={() => validate("email")}
                className={`w-full min-w-0 flex-1 bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
                placeholder={content.fields.email}
                aria-invalid={Boolean(errors.email)}
                aria-label={content.fields.email}
              />
            </div>
            <FieldError errorColor={errorColor}>{errors.email}</FieldError>
          </div>
        </div>

        <div className="relative w-full min-w-0" ref={countryRef}>
          <div className={`${fieldFrameClassName} ${getFieldOutline("country")}`}>
            <input
              type="text"
              value={values.country}
              onChange={(event) => {
                updateValue("country", event.target.value);
                setIsCountryOpen(true);
              }}
              onFocus={() => setIsCountryOpen(true)}
              onBlur={() => {
                if (values.country.trim()) validate("country");
              }}
              className={`w-full min-w-0 flex-1 bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
              placeholder={content.fields.country}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isCountryOpen}
              aria-controls="rfp-country-listbox"
              aria-invalid={Boolean(errors.country)}
              aria-label={content.fields.country}
            />
            <button
              type="button"
              onClick={() => setIsCountryOpen((current) => !current)}
              className="shrink-0"
              aria-label={content.labels.openCountryList}
            >
              <svg
                viewBox="0 0 24 24"
                className={`size-4 ${iconColor} transition-transform duration-200 ${
                  isCountryOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {isCountryOpen ? (
            <div
              id="rfp-country-listbox"
              role="listbox"
              className={`rfp-dropdown-enter absolute left-0 right-0 top-[calc(100%+8px)] z-[60] max-h-64 origin-top overflow-y-auto rounded-3xl border p-2 shadow-2xl ${
                isDarkMode
                  ? "border-white/15 bg-zinc-950 text-white"
                  : "border-black/15 bg-white text-black"
              }`}
            >
              {filteredCountries.length ? (
                filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    role="option"
                    aria-selected={values.country === country}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      updateValue("country", country);
                      setIsCountryOpen(false);
                    }}
                    className={`block w-full break-words rounded-2xl px-4 py-2 text-start font-['Gotham'] text-sm transition-colors ${
                      isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                    }`}
                  >
                    {country}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 font-['Gotham'] text-sm opacity-70">
                  {content.labels.noMatchingCountry}
                </p>
              )}
            </div>
          ) : null}
          <FieldError errorColor={errorColor}>{errors.country}</FieldError>
        </div>

        <fieldset className="w-full min-w-0 border-0 p-0">
          <legend
            className={`mb-3 break-words px-4 font-['Gotham'] text-sm ${mutedTextColor}`}
          >
            {content.fields.requestType}
          </legend>

          <div
            role="radiogroup"
            aria-label={content.fields.requestType}
            className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {content.requestTypes.map((requestType) => {
              const isOther = requestType === content.otherValue;
              const isSelected = values.requestType === requestType;
              const hasError = isOther
                ? errors.requestType || errors.otherOption
                : errors.requestType;
              const pill = (
                <button
                  type="button"
                  role={isOther ? "button" : "radio"}
                  aria-checked={isOther ? undefined : isSelected}
                  aria-haspopup={isOther ? "listbox" : undefined}
                  aria-expanded={isOther ? isOtherOpen : undefined}
                  onClick={() =>
                    isOther ? toggleOtherDropdown() : selectRequestType(requestType)
                  }
                  className={`flex w-full min-w-0 items-center gap-3 rounded-[50px] px-4 py-3 text-start outline outline-1 outline-offset-[-1px] transition-colors ${inputBg} ${
                    isSelected
                      ? "outline-[#37B478]"
                      : hasError
                        ? "outline-red-500"
                        : inputOutline
                  } ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/[0.03]"}`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-[#37B478]"
                        : isDarkMode
                          ? "border-white/40"
                          : "border-black/40"
                    }`}
                  >
                    <span
                      className={`size-2.5 rounded-full transition-transform duration-200 ${
                        isSelected
                          ? "scale-100 bg-[#37B478]"
                          : "scale-0 bg-transparent"
                      }`}
                    />
                  </span>
                  <span
                    className={`min-w-0 break-words font-['Gotham'] text-sm ${textColor}`}
                  >
                    {isOther ? values.otherOption || requestType : requestType}
                  </span>
                </button>
              );

              if (!isOther) {
                return <div key={requestType} className="min-w-0">{pill}</div>;
              }

              return (
                <div key={requestType} className="relative min-w-0" ref={otherRef}>
                  {pill}

                  <div
                    role="listbox"
                    aria-label={content.fields.otherOption}
                    aria-hidden={!isOtherOpen}
                    className={`rfp-dropdown-anim absolute left-0 right-0 top-[calc(100%+8px)] z-[60] max-h-72 origin-top overflow-y-auto rounded-3xl border p-2 shadow-2xl transition-all duration-300 ease-out ${
                      isOtherOpen
                        ? "translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0"
                    } ${
                      isDarkMode
                        ? "border-white/15 bg-zinc-950 text-white"
                        : "border-black/15 bg-white text-black"
                    }`}
                  >
                    {content.otherOptions.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        tabIndex={isOtherOpen ? 0 : -1}
                        aria-selected={values.otherOption === option}
                        onClick={() => selectOtherOption(option)}
                        style={{
                          transitionDelay: isOtherOpen
                            ? `${60 + optionIndex * 35}ms`
                            : "0ms",
                        }}
                        className={`block w-full break-words rounded-2xl px-4 py-2 text-start font-['Gotham'] text-sm transition-all duration-300 ease-out ${
                          isOtherOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        } ${
                          values.otherOption === option
                            ? `bg-[#37B478] ${greenButtonTextColor}`
                            : isDarkMode
                              ? "hover:bg-white/10"
                              : "hover:bg-black/5"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {errors.requestType || errors.otherOption ? (
            <p
              className={`mt-2 break-words px-4 font-['Gotham'] text-xs ${errorColor}`}
            >
              {errors.requestType || errors.otherOption}
            </p>
          ) : null}
        </fieldset>

        <div
          className={`flex h-36 w-full min-w-0 items-start rounded-3xl p-4 outline outline-1 outline-offset-[-1px] ${inputBg} ${inputOutline}`}
        >
          <textarea
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            className={`h-full w-full min-w-0 flex-1 resize-none bg-transparent font-['Gotham'] text-sm outline-none ${inputTextClassName}`}
            placeholder={content.fields.message}
            aria-label={content.fields.message}
          />
        </div>

        <div className="relative w-full min-w-0">
          <div
            className={`flex w-full min-w-0 flex-col gap-3 rounded-3xl p-4 outline outline-1 outline-offset-[-1px] ${inputBg} ${getFieldOutline("files")}`}
          >
            <div className="flex w-full min-w-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-[50px] border border-[#37B478] px-5 font-['Gotham'] text-sm transition-colors ${textColor} ${
                  isDarkMode ? "hover:bg-white/5" : "hover:bg-black/[0.03]"
                }`}
              >
                <span className="size-2.5 shrink-0 rounded-full bg-[#37B478]" />
                <span>{content.labels.chooseFiles}</span>
              </button>
              <span
                className={`min-w-0 break-words font-['Gotham'] text-xs ${mutedTextColor}`}
              >
                {files.length
                  ? content.fields.files
                  : content.labels.noFileSelected}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label={content.fields.files}
            />

            {files.length ? (
              <ul className="flex w-full min-w-0 flex-col gap-2">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl px-3 py-2 ${
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    }`}
                  >
                    <span
                      className={`min-w-0 flex-1 truncate font-['Gotham'] text-xs ${textColor}`}
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      aria-label={content.labels.removeFile}
                      className={`shrink-0 font-['Gotham'] text-base leading-none ${mutedTextColor}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <FieldError errorColor={errorColor}>{errors.files}</FieldError>
        </div>

        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="min-h-11 self-end rounded-[50px] bg-[#37B478] px-8 py-3 transition-all duration-200 hover:bg-[#22C55E] active:scale-95 disabled:cursor-wait disabled:opacity-70"
        >
          <span
            className={`font-['Gotham'] text-lg font-normal sm:text-2xl ${greenButtonTextColor}`}
          >
            {submitState === "submitting"
              ? content.labels.submitting
              : content.labels.submit}
          </span>
        </button>

        {submitMessage ? (
          <p
            className={`w-full min-w-0 break-words text-end font-['Gotham'] text-sm ${
              submitState === "success"
                ? isDarkMode
                  ? "text-emerald-300"
                  : "text-emerald-700"
                : errorColor
            }`}
          >
            {submitMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}

export default RfpForm;
