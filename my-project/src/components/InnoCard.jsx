function InnoCard({title, subtitle, items = []}) {
  return (
    <div className="relative w-64 h-95 px-8 py-6 bg-green-500/5 rounded-[50px] shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1.00)] inline-flex flex-col justify-start items-center gap-4 overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1.00),0_0_30px_rgba(29,95,63,0.18)]">
      <div className="flex flex-col justify-start items-center gap-3">
        <div className="inline-flex justify-start items-start gap-3">
          <div className="flex flex-col justify-start items-start">
            <div className="text-center justify-start text-white text-base font-normal font-['Gotham']">
              {title}
            </div>
            <div className="justify-start text-white text-xs font-['Gotham']">
              {subtitle}
            </div>
          </div>
        </div>

        <div className="w-44 h-0 rounded-[50px] outline-2 -outline-offset-1 outline-[#37B478] blur-[2px]" />
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="self-stretch flex flex-col justify-start items-start gap-1"
          >
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="w-4 self-stretch flex justify-center items-center gap-2.5">
                <div className="w-2 h-2 rounded-full border-[0.50px] border-[#37B478]" />
              </div>
              <div className="flex-1 justify-start text-white text-sm font-['Gotham']">
                {item.label}
              </div>
            </div>
            <div className="self-stretch text-left text-white text-xs font-light font-['Gotham'] wrap-break-word leading-tight">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InnoCard;
