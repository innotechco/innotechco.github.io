function InnoCard({children}) {
  return (
    <div
      className="
        relative
        w-64 h-80 px-8 py-6 rounded-[50px]
        bg-green-500/5 border border-green-500/10
        shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1.00)]
        flex flex-col gap-4
        flex-shrink-0 cursor-pointer

        overflow-visible
        transform-gpu
        transition-all duration-300 ease-out

        /* =========================
           🎯 HOVER STYLE (ACTIVE)
           ========================= */

        hover:scale-[1.03]
        hover:bg-green-500/10
        hover:border-green-400/30
        hover:shadow-[0_0_45px_rgba(55,180,120,0.25)]

        /* اگر خواستی تست کنی:
        hover:rotate-[0.8deg]
        hover:shadow-[0_30px_70px_rgba(0,255,120,0.18)]
        */

      "
    >
      {children}
    </div>
  );
}

export default InnoCard;
