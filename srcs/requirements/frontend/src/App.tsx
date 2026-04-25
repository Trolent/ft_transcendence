import { Routes, Route, useLocation } from "react-router-dom";

import Play from "./pages/Play";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Demo from "./pages/Demo";
import { Navbar, Footer } from "./layout";


const NAV_ITEMS = [
  { label: "Play", href: "/play" },
  { label: "Demo", href: "/demo" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Profile", href: "/profile" },
];

function App() {
  const navItems = NAV_ITEMS.map((i) => ({
    ...i,
    active: useLocation().pathname === i.href,
  }));

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col font-mono">
      <Navbar items={navItems} />
      <main className="flex-1">
        <Routes>
          <Route path="/play" element={<Play />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Play />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
