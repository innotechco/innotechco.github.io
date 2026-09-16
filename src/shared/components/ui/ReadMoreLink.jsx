import {Link} from "react-router-dom";

import {t} from "../../i18n/ui.js";

/* "Read more", pointing wherever the caller says.
 *
 * It used to fall back to one hard-coded article when `to` was missing, which
 * meant a card whose slug had not arrived sent the visitor to an unrelated
 * piece - no error, no broken link, just the wrong page. Nothing renders now
 * instead: a read-more with nowhere to go is not a control, and a missing
 * button is far easier to notice than a wrong destination. */
function ReadMoreLink({to, label, isDarkMode, className = "", align = "start"}) {
  if (!to) return null;

  const textColor = isDarkMode ? "text-white" : "text-black";
  const alignment = align === "end" ? "items-end" : "items-start";

  return (
    <Link
      to={to}
      className={`group flex w-fit flex-col ${alignment} transition-colors duration-300 hover:text-[#37B478] ${textColor} ${className}`}
    >
      <span>{label ?? t("readMore")}</span>
      <span className="mt-1 h-[2px] w-0 rounded-full bg-[#37B478] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export default ReadMoreLink;
