import { Routes, Route } from "react-router-dom";

import Play from "./pages/Play";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import { Navbar, Footer } from "./layout";
import { ProtectedRoute } from "./auth";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="min-h-screen bg-bg flex flex-col font-mono">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Play />} />
          <Route path="/play" element={<Play />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
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
