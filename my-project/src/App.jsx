import Navbar from "./components/Navbar";
import FirstPage from "./components/FirstPage";
import EllipseBlack from "./components/EllipseBlack";
import InnotechEcopic from "./assets/InnotechEcopic.png";
import InnoCard from "./components/InnoCard";

function App() {
  return (
    <div className="relative w-full bg-black min-h-screen overflow-x-hidden">
      <Navbar />

      {/* First Page - Hero Section */}
      <FirstPage />

      {/* Ellipse Section */}
      <div className="relative -mt-20 z-20">
        <EllipseBlack />

        {/* Content on top of Ellipse - با ارتفاع واقعی */}
        <div className="relative z-30 w-full pb-24" style={{marginTop: "-35%"}}>
          {/* CENTER IMAGE */}
          <div className="flex justify-center pb-16">
            <div className="overflow-hidden max-h-[550px]">
              <img
                src={InnotechEcopic}
                alt="Innotech Ecosystem"
                className="w-auto h-auto max-w-[90vw] object-contain"
              />
            </div>
          </div>

          {/* CARDS */}
          <div className="w-full max-w-[1320px] mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-20">
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
        </div>
      </div>
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
        {/* ... بقیه کد CardContent بدون تغییر ... */}
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
