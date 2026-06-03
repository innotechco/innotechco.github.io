import {useTheme} from "../../../../../context/useTheme";

const stats = [
  {
    value: "+150",
    label: "Reports Delivered",
  },
  {
    value: "+50",
    label: "Lifetime Clients",
  },
  {
    value: "+5",
    label: "Long-term Partners",
  },
  {
    value: "+30",
    label: "Dashboards Delivered",
  },
];

function InceptionStats() {
  const {isDarkMode} = useTheme();

  const textColor = isDarkMode ? "text-white" : "text-black";
  const pageBg = isDarkMode ? "bg-black" : "bg-white";

  return (
    <section className={`w-full px-[120px] py-[60px] ${pageBg}`}>
      <div className="mx-auto flex min-h-[517px] max-w-[1440px] items-center justify-between">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center"
          >
            {/* Number */}
            <h2
              className={`${textColor} text-center font-['Gotham'] text-5xl font-bold`}
            >
              {item.value}
            </h2>

            {/* Label */}
            <p
              className={`${textColor} mt-2 max-w-[160px] text-center font-['Gotham'] text-2xl font-medium`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InceptionStats;
