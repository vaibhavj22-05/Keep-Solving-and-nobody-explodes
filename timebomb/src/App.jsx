import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import GamePage from "./pages/GamePage";
import RulesPage from "./pages/RulesPages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
         <Route path="/rules" element={<RulesPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}
