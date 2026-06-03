import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTheme} from "../../context/useTheme";
import {countries} from "../../data/countries";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const defaultContactValues = {
  name: "",
  email: "",
  title: "",
  company: "",
  region: "",
  industry: "",
  message: "",
};

const industryOptions = [
  "Automotive",
  "Energy and Materials",
  "Health",
  "High Tech",
  "Metals and Mining",
];

function ContactModal({isOpen, onClose}) {
  const {isDarkMode} = useTheme();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [values, setValues] = useState(defaultContactValues);
  const [errors, setErrors] = useState({});
  const regionRef = useRef(null);

  const filteredCountries = useMemo(() => {
    const query = values.region.trim().toLowerCase();

    if (!query) return countries;

    return countries.filter((country) => country.toLowerCase().includes(query));
  }, [values.region]);

  const updateValue = (field, value) => {
    setValues((current) => ({...current, [field]: value}));
    setErrors((current) => ({...current, [field]: ""}));
  };

  const resetForm = useCallback(() => {
    setValues(defaultContactValues);
    setErrors({});
    setIsRegionOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const getRegionMatch = (region) =>
    countries.find(
      (country) => country.toLowerCase() === region.trim().toLowerCase(),
    );

  const validate = (field) => {
    const nextErrors = field ? {...errors} : {};

    if (!field || field === "email") {
      if (!emailPattern.test(values.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
      } else {
        delete nextErrors.email;
      }
    }

    if (!field || field === "region") {
      const matchedRegion = getRegionMatch(values.region);

      if (!matchedRegion) {
        nextErrors.region = "Choose a country from the list.";
      } else {
        delete nextErrors.region;
        if (matchedRegion !== values.region) {
          setValues((current) => ({...current, region: matchedRegion}));
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsRegionOpen(false);
  };

  useEffect(() => {
    let renderTimer;
    let visibleTimer;

    if (isOpen) {
      renderTimer = setTimeout(() => {
        setShouldRender(true);
        visibleTimer = setTimeout(() => {
          setVisible(true);
        }, 10);
      }, 0);
    } else {
      visibleTimer = setTimeout(() => {
        setVisible(false);
      }, 0);
      renderTimer = setTimeout(() => {
        setShouldRender(false);
      }, 1000);
    }

    return () => {
      clearTimeout(renderTimer);
      clearTimeout(visibleTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    };

    if (isRegionOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRegionOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  if (!shouldRender) return null;

  const modalBg = isDarkMode ? "bg-black" : "bg-white";
  const modalOutline = isDarkMode ? "outline-white/25" : "outline-black/25";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const placeholderColor = isDarkMode
    ? "placeholder:text-white"
    : "placeholder:text-black/50";
  const inputBg = isDarkMode ? "bg-black" : "bg-white";
  const inputOutline = isDarkMode ? "outline-white/25" : "outline-black/50";
  const closeIconColor = isDarkMode ? "text-white" : "text-black";
  const overlayBg = isDarkMode ? "bg-black/70" : "bg-white/70";
  const submitBtnBg = isDarkMode ? "bg-[#37B478]" : "bg-[#37B478]";
  const submitTextColor = "text-white";
  const errorColor = isDarkMode ? "text-red-300" : "text-red-600";
  const getFieldOutline = (field) =>
    errors[field]
      ? "outline-red-500"
      : inputOutline;
  const fieldFrameClassName = `w-full px-4 py-3 ${inputBg} rounded-[50px] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-start gap-2.5`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${overlayBg} backdrop-blur-sm transition-opacity duration-1000 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-[929px] p-11 ${modalBg} rounded-[40px] outline outline-1 outline-offset-[-1px] ${modalOutline} inline-flex flex-col justify-end items-end gap-5 overflow-visible shadow-2xl transform transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
        }`}
      >
        <form
          className="flex w-full flex-col items-end gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
        {/* Header */}
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="w-[787px] px-4 relative flex justify-between items-end">
            {/* Decorative circle */}
            <div className="size-11 left-0 top-[-15px] absolute rounded-full border border-[#37B478]" />
            <div
              className={`w-[725px] justify-start ${textColor} text-2xl font-normal font-['Gotham']`}
            >
              Contact Us
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="size-6 relative overflow-hidden flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              className={`size-5 ${closeIconColor}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Name */}
        <div
          className={`self-stretch ${fieldFrameClassName} ${inputOutline}`}
        >
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            className={`flex-1 bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham']`}
            placeholder="Name"
          />
        </div>

        {/* Email */}
        <div className="relative self-stretch">
          <div
            className={`${fieldFrameClassName} ${getFieldOutline("email")}`}
          >
            <input
              type="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              onBlur={() => validate("email")}
              className={`flex-1 bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham']`}
              placeholder="Email"
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? (
            <p
              className={`pointer-events-none absolute left-4 top-full mt-1 text-xs font-['Gotham'] ${errorColor}`}
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Title + Company */}
        <div className="self-stretch inline-flex justify-start items-start gap-5">
          <div
            className={`flex-1 px-4 py-3 ${inputBg} rounded-[50px] outline outline-1 outline-offset-[-1px] ${inputOutline}`}
          >
            <input
              type="text"
              value={values.title}
              onChange={(event) => updateValue("title", event.target.value)}
              className={`w-full bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham']`}
              placeholder="Title"
            />
          </div>

          <div
            className={`flex-1 px-4 py-3 ${inputBg} rounded-[50px] outline outline-1 outline-offset-[-1px] ${inputOutline}`}
          >
            <input
              type="text"
              value={values.company}
              onChange={(event) => updateValue("company", event.target.value)}
              className={`w-full bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham']`}
              placeholder="Company"
            />
          </div>
        </div>

        {/* Region */}
        <div className="relative self-stretch" ref={regionRef}>
          <div
            className={`${fieldFrameClassName} ${getFieldOutline("region")}`}
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
              className={`flex-1 bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham']`}
              placeholder="Select your region"
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
              aria-label="Open country list"
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
                    className={`block w-full rounded-2xl px-4 py-2 text-left text-sm font-['Gotham'] transition-colors ${
                      isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                    }`}
                  >
                    {country}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm font-['Gotham'] opacity-70">
                  No matching country
                </p>
              )}
            </div>
          ) : null}
          {errors.region ? (
            <p
              className={`pointer-events-none absolute left-4 top-full mt-1 text-xs font-['Gotham'] ${errorColor}`}
            >
              {errors.region}
            </p>
          ) : null}
        </div>

        {/* Industry */}
        <div
          className={`self-stretch px-4 py-3 ${inputBg} rounded-[50px] outline outline-1 outline-offset-[-1px] ${inputOutline} inline-flex justify-between items-center`}
        >
          <select
            value={values.industry}
            onChange={(event) => updateValue("industry", event.target.value)}
            className={`flex-1 appearance-none bg-transparent outline-none ${textColor} text-sm font-['Gotham'] ${
              values.industry ? "" : isDarkMode ? "text-white" : "text-black/50"
            }`}
            aria-label="Select industry"
          >
            <option value="">Select industry</option>
            {industryOptions.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <svg
            viewBox="0 0 24 24"
            className={`size-4 ${closeIconColor} shrink-0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Message */}
        <div
          className={`self-stretch h-36 p-4 ${inputBg} rounded-3xl outline outline-1 outline-offset-[-1px] ${inputOutline} inline-flex justify-start items-start`}
        >
          <textarea
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            className={`flex-1 bg-transparent outline-none ${textColor} ${placeholderColor} text-sm font-['Gotham'] resize-none h-full`}
            placeholder="Message"
          />
        </div>

        {/* Submit Button */}
        <div className="self-end">
          <button
            type="submit"
            className={`px-8 py-3 ${submitBtnBg} hover:bg-[#22C55E] active:scale-95 transition-all duration-200 rounded-[50px] flex items-center gap-2.5`}
          >
            <span
              className={`${submitTextColor} text-2xl font-normal font-['Gotham']`}
            >
              Submit
            </span>
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
