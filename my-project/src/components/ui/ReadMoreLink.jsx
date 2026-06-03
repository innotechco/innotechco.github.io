import {Link} from "react-router-dom";

import {routes} from "../../routes";

function ReadMoreLink({
  to = routes.aiAgent,
  label = "Read more",
  isDarkMode,
  className = "",
  align = "start",
}) {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const alignment = align === "end" ? "items-end" : "items-start";

  return (
    <Link
      to={to}
      className={`group flex w-fit flex-col ${alignment} transition-colors duration-300 hover:text-[#37B478] ${textColor} ${className}`}
    >
      <span>{label}</span>
      <span className="mt-1 h-[2px] w-0 rounded-full bg-[#37B478] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export default ReadMoreLink;
