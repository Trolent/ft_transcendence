import { Routes, Route, useLocation } from "react-router-dom";
import { createContext, useState } from "react";
export const BioContext = createContext({ bio: "", setBio: (_: string) => {} });

import { Navbar, Footer } from "./layout";
import { ProtectedRoute, GuestRoute, useAuth } from "./auth";

import Play from "./pages/Play";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

function App() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const NAV_ITEMS = [
    { label: "Play", href: "/" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Profile", href: "/profile" },
    ...(user ? [{ label: "Settings", href: "/settings" }] : [{ label: "Sign in", href: "/signin" }]),
  ];

  const navItems = NAV_ITEMS.map((i) => ({
    ...i,
    active:
      i.href === "/" ? pathname === "/" || pathname === "/play"
        : pathname === i.href,
  }));
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  return (
    <BioContext.Provider value={{ bio, setBio }}>
    <div className="min-h-screen bg-terminal-bg flex flex-col font-mono">
      <Navbar items={navItems} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Play />} />
          <Route path="/play" element={<Play />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/signin" element={<GuestRoute><Signin /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Play />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </BioContext.Provider>
  );
}

export default App;