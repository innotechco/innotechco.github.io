import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import contactContent from "../../content/en/contact.json";
import {useTheme} from "../../context/useTheme";
import {countries} from "../../data/countries";
import ContactFormFields from "./contact/ContactFormFields";

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
        nextErrors.email = contactContent.errors.email;
      } else {
        delete nextErrors.email;
      }
    }

    if (!field || field === "region") {
      const matchedRegion = getRegionMatch(values.region);

      if (!matchedRegion) {
        nextErrors.region = contactContent.errors.region;
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

    if (isRegionOpen)
      document.addEventListener("mousedown", handleClickOutside);

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
  const inputBg = isDarkMode ? "bg-black" : "bg-white";
  const inputOutline = isDarkMode ? "outline-white/25" : "outline-black/50";
  const closeIconColor = isDarkMode ? "text-white" : "text-black";
  const overlayBg = isDarkMode ? "bg-black/70" : "bg-white/70";
  const errorColor = isDarkMode ? "text-red-300" : "text-red-600";
  const getFieldOutline = (field) =>
    errors[field] ? "outline-red-500" : inputOutline;
  const fieldFrameClassName = `w-full px-4 py-3 ${inputBg} rounded-[50px] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-start gap-2.5`;

  return (
  <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-3 pb-6 pt-[calc(env(safe-area-inset-top)+88px)] sm:px-6 sm:pt-[calc(env(safe-area-inset-top)+104px)] lg:items-center lg:overflow-hidden lg:py-6">
    {/* Overlay */}
    <div
      className={`absolute inset-0 ${overlayBg} backdrop-blur-sm transition-opacity duration-1000 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    />

    {/* Modal */}
    <div
      className={`relative flex h-[calc(100svh-112px)] w-full max-w-[929px] flex-col overflow-hidden rounded-[24px]
      sm:h-[calc(100svh-132px)]
      lg:h-[calc(100svh-48px)]
      ${modalBg} ${modalOutline}
      transform transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
      }`}
    >
      {/* Header */}
      <div className="shrink-0 p-4 sm:p-6 lg:px-11 lg:pt-11">
        <div className="inline-flex items-center justify-between self-stretch gap-4 w-full">
          <div className="relative flex min-w-0 flex-1 items-end justify-between px-4">
            <div className="absolute left-0 top-[-10px] size-9 rounded-full border border-[#37B478] sm:top-[-15px] sm:size-11" />

            <div
              className={`min-w-0 justify-start font-['Gotham'] text-lg font-normal sm:text-xl lg:text-2xl ${textColor}`}
            >
              {contactContent.title}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={contactContent.closeLabel}
            className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden"
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
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 lg:px-11">
        <form
          className="flex w-full flex-col items-end gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <ContactFormFields
            closeIconColor={closeIconColor}
            errorColor={errorColor}
            errors={errors}
            fieldFrameClassName={fieldFrameClassName}
            filteredCountries={filteredCountries}
            getFieldOutline={getFieldOutline}
            inputBg={inputBg}
            inputOutline={inputOutline}
            isDarkMode={isDarkMode}
            isRegionOpen={isRegionOpen}
            regionRef={regionRef}
            setIsRegionOpen={setIsRegionOpen}
            textColor={textColor}
            updateValue={updateValue}
            validate={validate}
            values={values}
            content={contactContent}
          />
        </form>
      </div>
    </div>
  </div>
);
}

export default ContactModal;
