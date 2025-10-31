// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import FrontPage from "./pages/FrontPage";
// import GamePage from "./pages/GamePage";
// import RulesPage from "./pages/RulesPages";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<FrontPage />} />
//          <Route path="/rules" element={<RulesPage />} />
//         <Route path="/game" element={<GamePage />} />
//       </Routes>
//     </Router>
//   );
// }










// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RoomPage from "./pages/RoomPage";
// import RoomSetupPage from "./pages/RoomSetupPage";
// import RoleSelectionPage from "./pages/RoleSelectionPage";

// function App() {
//   const handleRoomJoined = (code) => {
//     console.log("Joined room:", code);
    // Later, navigate to GamePage or similar
  // };

  // return (
  //   <Router>
  //     <Routes>
        {/* Default landing page */}
        // <Route path="/" element={<RoomSetupPage />} />

        {/* After joining/creating room */}
        // <Route path="/roles" element={<RoleSelectionPage />} />

        {/* Existing room/game page for testing */}
//         <Route path="/room" element={<RoomPage onRoomJoined={handleRoomJoined} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// src/App.jsx








// import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import RoomPage from "./pages/RoomPage";
// import RolesPage from "./pages/RolesPage";
// import DiffuserPage from "./pages/DiffuserPage";
// import ExpertPage from "./pages/ExpertPage";

// function LandingWrapper() {
//   const navigate = useNavigate();
//   const onRoomJoined = (roomCode) => {
//     console.log("🧭 Navigating to /roles with code:", roomCode);
//     navigate("/roles", { state: { roomCode } });
//   };

//   return <RoomPage onRoomJoined={onRoomJoined} />;
// }

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingWrapper />} />
//         <Route path="/roles" element={<RolesPage />} />
//         <Route path="/diffuser" element={<DiffuserPage />} />
//         <Route path="/expert" element={<ExpertPage />} />
//       </Routes>
//     </Router>
//   );
// }




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

// --- Components ---
// import BackgroundMusic from "./components/BackgroundMusic";

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
      {/* <BackgroundMusic /> */}

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
      </Routes>
    </Router>
  );
}
