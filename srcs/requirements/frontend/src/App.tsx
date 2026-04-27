import { Routes, Route, useLocation } from "react-router-dom";

import Play from "./pages/Play";
import Demo from "./pages/Demo";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { Navbar, Footer } from "./layout";
import Signin from "./pages/Signin";


const NAV_ITEMS = [
  { label: "Play", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Profile", href: "/profile" },
  { label: "Signin", href: "/signin" },
];

function App() {
  const { pathname } = useLocation();

  const navItems = NAV_ITEMS.map((i) => ({
    ...i,
    active:
      i.href === "/" ? pathname === "/" || pathname === "/play"
        : pathname === i.href,
  }));

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col font-mono">
      <Navbar items={navItems} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Play />} />
          <Route path="/play" element={<Play />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} /> {/* opens user profile, if not logged it should redirect to /signin*/}
          <Route path="/profile/:username" element={<Profile />} />
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
