function StatsSection({stats}) {
  return (
    <section className="relative flex items-center justify-between px-28 py-24">
      {stats.map((icon) => (
        <div
          key={icon}
          className="flex h-44 min-w-[220px] items-center justify-center rounded-[32px] p-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-emerald-500"
        >
          <img
            src={icon}
            alt=""
            aria-hidden
            className="h-36 w-auto object-contain"
          />
        </div>
      ))}
    </section>
  );
}

export default StatsSection;
