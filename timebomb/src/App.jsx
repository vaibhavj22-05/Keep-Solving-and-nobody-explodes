import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// --- Pages (from both apps) ---
import RoomPage from "./pages/RoomPage";
import RolesPage from "./pages/RolesPage";
import DiffuserPage from "./pages/DiffuserPage";
import ExpertPage from "./pages/ExpertPage";
import FrontPage from "./pages/FrontPage";
import GamePage from "./pages/GamePage";
import RulesPage from "./pages/RulesPages";
import BombExploded from "./pages/BombExploded";
import BombDiffused from "./pages/BombDiffused";

// --- Components ---
import BackgroundMusic from "./components/BackgroundMusic";

// --- Landing Wrapper for Room navigation ---
function LandingWrapper() {
  const navigate = useNavigate();

  const onRoomJoined = (roomCode) => {
    console.log("🧭 Navigating to /roles with code:", roomCode);
    navigate("/roles", { state: { roomCode } });
  };

  return <RoomPage onRoomJoined={onRoomJoined} />;
}

// --- Main App ---
export default function App() {
  return (
    <Router>
      {/* 🎵 Persistent background music */}
      <BackgroundMusic />

      <Routes>
        {/* From FrontPage/Game/Rules flow */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/rules" element={<RulesPage />} />

        {/* From Room/Role flow */}
        <Route path="/room" element={<LandingWrapper />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/diffuser" element={<DiffuserPage />} />
        <Route path="/expert" element={<ExpertPage />} />
        <Route path="/exploded" element={<BombExploded />} />
        <Route path="/Diffused" element={<BombDiffused />} />
      </Routes>
    </Router>
  );
}