import { Routes, Route } from "react-router-dom";

import {
  Leaderboard,
  Play,
  Privacy,
  Profile,
  Register,
  Settings,
  Signin,
  Terms,
} from "./pages";
import { Navbar, Footer } from "./layout";
import { ProtectedRoute, GuestRoute } from "./auth";

function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col font-mono">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Play />} />
          <Route path="/play" element={<Play />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/signin" element={<GuestRoute><Signin /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
