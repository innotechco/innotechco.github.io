import Navbar from "./components/Navbar";
import FirstPage from "./components/FirstPage";
import EcosystemSection from "./components/EcosystemSection";

function App() {
  return (
    <div className="relative w-full bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <FirstPage />
      <EcosystemSection />
    </div>
  );
}

export default App;
