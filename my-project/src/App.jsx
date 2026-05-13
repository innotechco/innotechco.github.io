import Navbar from "./components/Navbar";
import FirstPage from "./components/FirstPage";
import EllipseBlack from "./components/EllipseBlack";
import InnotechEcopic from "./assets/InnotechEcopic.png";
import InnoCard from "./components/InnoCard";

function App() {
  return (
    <div className="relative w-full bg-black overflow-x-hidden">
      <Navbar />
      <FirstPage />
      <EllipseBlack />

      {/* CENTER IMAGE */}
      <div className="absolute left-1/2 top-[42.9%] -translate-x-1/2 -translate-y-1/2 z-30">
        <img
          src={InnotechEcopic}
          alt="Innotech Ecosystem"
          className="w-auto h-auto max-w-[90vw] object-contain"
        />
      </div>

      {/* CARDS */}
      <div className="absolute left-1/2 top-[54%] -translate-x-1/2 z-40 w-full max-w-[1320px] px-4 translate-y-[10px]">
        <div className="flex justify-center gap-6 lg:gap-8 flex-nowrap overflow-x-auto pb-6 scrollbar-hide">
          <InnoCard>
            <CardContent title="AI AGENT" subtitle="BY INNOTECH" />
          </InnoCard>

          <InnoCard>
            <CardContent />
          </InnoCard>

          <InnoCard>
            <CardContent />
          </InnoCard>

          <InnoCard>
            <CardContent />
          </InnoCard>
        </div>
      </div>

      {/* NEW BLACK SECTION */}
      <section className="relative z-10 w-full bg-black">
        <div className="max-w-[1265px] mx-auto min-h-[1200px]" />
      </section>
    </div>
  );
}

/* ===== CARD CONTENT ===== */
function CardContent({title = "INCEPTION", subtitle = "BY INNOTECH"}) {
  return (
    <>
      <div className="flex flex-col justify-start items-center gap-3">
        <div className="inline-flex justify-start items-center gap-3">
          <div className="w-9 h-9 bg-white rounded flex items-center justify-center text-black font-bold text-xl">
            I
          </div>
          <div className="flex flex-col items-start">
            <div className="text-white text-base tracking-wider">{title}</div>
            <div className="text-white text-xs">{subtitle}</div>
          </div>
        </div>

        <div className="w-44 h-0 rounded-[50px] outline outline-2 outline-offset-[-1px] outline-[#37B478] blur-[2px]" />
      </div>

      <div className="self-stretch flex flex-col gap-3 text-white">
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <div className="mt-1.5 w-4 flex justify-center">
              <div className="w-2 h-2 rounded-full border border-[#37B478]" />
            </div>
            <div className="text-sm">ISO56000 Assistant:</div>
          </div>

          <p className="text-xs font-light leading-tight pl-6">
            Innovation Management Maturity
            <br />
            Assessment aligned with ISO56000
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <div className="mt-1.5 w-4 flex justify-center">
              <div className="w-2 h-2 rounded-full border border-[#37B478]" />
            </div>
            <div className="text-sm">ITONICS:</div>
          </div>

          <p className="text-xs font-light leading-tight pl-6">
            the End-to-End Innovation
            <br />
            Management Systems (IMS)
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <div className="mt-1.5 w-4 flex justify-center">
              <div className="w-2 h-2 rounded-full border border-[#37B478]" />
            </div>
            <div className="text-sm">BRIGHTIDEA:</div>
          </div>

          <p className="text-xs font-light leading-tight pl-6">
            Innovation Cloud
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
