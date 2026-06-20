function PartnerArrow({direction = "right"}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-6 ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PartnerArrow;
