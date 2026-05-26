import { Routes, Route } from "react-router-dom";

import {ThemeProvider} from "./context/ThemeContext";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/home/Home";

import Automotive from "./pages/automative/Automative";

function App() {
  return (
    <ThemeProvider>
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <Navbar />
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/automotive" element={<Automotive />} />
</Routes>

      </div>
    </ThemeProvider>
  );
}

export default App;
