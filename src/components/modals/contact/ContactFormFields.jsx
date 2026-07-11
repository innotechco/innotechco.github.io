import {useEffect, useRef, useState} from "react";

import {industryMenuItems} from "../../layout/navData";

function TextField({
  "aria-invalid": ariaInvalid,
  className,
  onBlur,
  onChange,
  placeholder,
  type = "text",
  value,
}) {
  return (
    <div className={className}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full flex-1 bg-transparent font-['Gotham'] text-sm outline-none"
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
      />
    </div>
  );
}

function FieldError({children, className = "", errorColor}) {
  if (!children) return null;

  return (
    <p
      className={`pointer-events-none absolute left-4 top-full mt-1 font-['Gotham'] text-xs ${errorColor} ${className}`}
    >
      {children}
    </p>
  );
}

function ContactFormFields({
  closeIconColor,
  errorColor,
  errors,
  fieldFrameClassName,
  filteredCountries,
  getFieldOutline,
  inputBg,
  inputOutline,
  isDarkMode,
  isRegionOpen,
  regionRef,
  setIsRegionOpen,
  textColor,
  updateValue,
  validate,
  values,
  content,
  isSubmitting,
  submitMessage,
  submitState,
}) {
  const inputTextClassName = `${textColor} ${
    isDarkMode ? "placeholder:text-white" : "placeholder:text-black/50"
  }`;
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const industryRef = useRef(null);
  const industryOptions = [
    ...industryMenuItems.map((item) => item.label),
    content.labels.otherIndustry,
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setIsIndustryOpen(false);
      }
    };

    if (isIndustryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isIndustryOpen]);

  return (
    <>
      <div className="relative self-stretch">
        <TextField
          className={`self-stretch ${fieldFrameClassName} ${getFieldOutline("name")} ${inputTextClassName}`}
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          onBlur={() => validate("name")}
          placeholder={content.fields.name}
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError errorColor={errorColor}>{errors.name}</FieldError>
      </div>

      <div className="relative self-stretch">
        <div
          className={`${fieldFrameClassName} ${getFieldOutline("email")} ${inputTextClassName}`}
        >
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            onBlur={() => validate("email")}
            className="flex-1 bg-transparent font-['Gotham'] text-sm outline-none"
            placeholder={content.fields.email}
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        <FieldError errorColor={errorColor}>{errors.email}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 self-stretch sm:grid-cols-2 sm:gap-5">
        <div className="relative">
          <TextField
            className={`rounded-[50px] px-4 py-3 outline outline-1 outline-offset-[-1px] ${inputBg} ${getFieldOutline("title")} ${inputTextClassName}`}
            value={values.title}
            onChange={(event) => updateValue("title", event.target.value)}
            onBlur={() => validate("title")}
            placeholder={content.fields.title}
            aria-invalid={Boolean(errors.title)}
          />
          <FieldError errorColor={errorColor}>{errors.title}</FieldError>
        </div>
        <div className="relative">
          <TextField
            className={`rounded-[50px] px-4 py-3 outline outline-1 outline-offset-[-1px] ${inputBg} ${getFieldOutline("company")} ${inputTextClassName}`}
            value={values.company}
            onChange={(event) => updateValue("company", event.target.value)}
            onBlur={() => validate("company")}
            placeholder={content.fields.company}
            aria-invalid={Boolean(errors.company)}
          />
          <FieldError errorColor={errorColor}>{errors.company}</FieldError>
        </div>
      </div>

      <div className="relative self-stretch" ref={regionRef}>
        <div
          className={`${fieldFrameClassName} ${getFieldOutline("region")} ${inputTextClassName}`}
        >
          <input
            type="text"
            value={values.region}
            onChange={(event) => {
              updateValue("region", event.target.value);
              setIsRegionOpen(true);
            }}
            onFocus={() => setIsRegionOpen(true)}
            onBlur={() => {
              if (values.region.trim()) validate("region");
            }}
            className="flex-1 bg-transparent font-['Gotham'] text-sm outline-none"
            placeholder={content.fields.region}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isRegionOpen}
            aria-controls="region-listbox"
            aria-invalid={Boolean(errors.region)}
          />
          <button
            type="button"
            onClick={() => setIsRegionOpen((current) => !current)}
            className="shrink-0"
            aria-label={content.labels.openCountryList}
          >
            <svg
              viewBox="0 0 24 24"
              className={`size-4 ${closeIconColor} transition-transform duration-200 ${
                isRegionOpen ? "rotate-180" : "rotate-0"
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

        {isRegionOpen ? (
          <div
            id="region-listbox"
            role="listbox"
            className={`absolute left-0 right-0 top-[calc(100%+8px)] z-[120] max-h-64 overflow-y-auto rounded-3xl border p-2 shadow-2xl ${
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    updateValue("region", country);
                    setIsRegionOpen(false);
                  }}
                  className={`block w-full rounded-2xl px-4 py-2 text-left font-['Gotham'] text-sm transition-colors ${
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
        <FieldError errorColor={errorColor}>{errors.region}</FieldError>
      </div>

      <div className="relative self-stretch" ref={industryRef}>
        <button
          type="button"
          onClick={() => setIsIndustryOpen((current) => !current)}
          className={`inline-flex w-full items-center justify-between rounded-[50px] px-4 py-3 text-left outline outline-1 outline-offset-[-1px] ${inputBg} ${getFieldOutline("industry")}`}
          aria-expanded={isIndustryOpen}
          aria-haspopup="listbox"
          aria-invalid={Boolean(errors.industry)}
          onBlur={() => validate("industry")}
        >
          <span
            className={`flex-1 font-['Gotham'] text-sm ${
              values.industry
                ? isDarkMode
                  ? "text-white"
                  : "text-black"
                : isDarkMode
                  ? "text-white"
                  : "text-black/50"
            }`}
          >
            {values.industry || content.fields.industry}
          </span>
          <svg
            viewBox="0 0 24 24"
            className={`size-4 shrink-0 ${closeIconColor} transition-transform duration-200 ${
              isIndustryOpen ? "rotate-180" : "rotate-0"
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

        {isIndustryOpen ? (
          <div
            role="listbox"
            className={`absolute left-0 right-0 top-[calc(100%+8px)] z-[120] max-h-72 overflow-y-auto rounded-3xl border p-2 shadow-2xl ${
              isDarkMode
                ? "border-white/15 bg-zinc-950 text-white"
                : "border-black/15 bg-white text-black"
            }`}
          >
            {industryOptions.map((industry) => (
              <button
                key={industry}
                type="button"
                role="option"
                aria-selected={values.industry === industry}
                onClick={() => {
                  updateValue("industry", industry);
                  setIsIndustryOpen(false);
                }}
                className={`block w-full rounded-2xl px-4 py-2 text-left font-['Gotham'] text-sm transition-colors ${
                  values.industry === industry
                    ? `bg-[#37B478] ${greenButtonTextColor}`
                    : isDarkMode
                      ? "hover:bg-white/10"
                      : "hover:bg-black/5"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        ) : null}
        <FieldError errorColor={errorColor}>{errors.industry}</FieldError>
      </div>

      <div
        className={`inline-flex h-36 items-start self-stretch rounded-3xl p-4 outline outline-1 outline-offset-[-1px] ${inputBg} ${inputOutline} ${inputTextClassName}`}
      >
        <textarea
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          className="h-full flex-1 resize-none bg-transparent font-['Gotham'] text-sm outline-none"
          placeholder={content.fields.message}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 self-end rounded-[50px] bg-[#37B478] px-8 py-3 transition-all duration-200 hover:bg-[#22C55E] active:scale-95 disabled:cursor-wait disabled:opacity-70"
      >
        <span className={`font-['Gotham'] text-xl font-normal sm:text-2xl ${greenButtonTextColor}`}>
          {isSubmitting ? content.labels.submitting : content.labels.submit}
        </span>
      </button>
      {submitMessage ? (
        <p
          className={`self-end text-right font-['Gotham'] text-sm ${
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
    </>
  );
}

export default ContactFormFields;
