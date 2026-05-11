import { Routes, Route } from "react-router-dom";

import Play from "./pages/Play";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import { Navbar, Footer } from "./layout";
import { ProtectedRoute, GuestRoute, useAuth } from "./auth";
import Settings from "./pages/Settings";

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-black flex flex-col font-mono">
      <Navbar items={[
        { label: "Play", href: "/play" },
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Profile", href: "/profile" },
        ...(user ? [{ label: "Settings", href: "/settings" }] : [{ label: "Sign in", href: "/signin" }]),
      ]} />
      <main className="flex-1 flex flex-col justify-center">
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
  );
}

export default App;
