import React, { useEffect } from "react";
import { ArrowLeft, AlertTriangle, Users, Crosshair, BookOpen, Zap, Layers, Timer, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RulesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const RoleCard = ({ title, icon: Icon, color, children }) => (
    <div
      className={`border-2 rounded-xl p-6 bg-black/40 ${
        color === "red"
          ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          : "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      }`}
    >
      <h3
        className={`flex items-center gap-2 text-2xl mb-3 font-bold ${
          color === "red" ? "text-red-500" : "text-cyan-400"
        }`}
      >
        <Icon size={24} />
        {title}
      </h3>
      {children}
    </div>
  );

  const Badge = ({ color, text }) => {
    const colors = {
      red: "bg-red-500/20 border-red-500 text-red-500",
      cyan: "bg-cyan-400/20 border-cyan-400 text-cyan-400",
      yellow: "bg-yellow-400/20 border-yellow-400 text-yellow-400",
      green: "bg-green-500/20 border-green-500 text-green-500",
    };
    return (
      <span
        className={`inline-block px-3 py-1.5 rounded-md border font-semibold text-sm mr-2 mb-2 ${colors[color]}`}
      >
        {text}
      </span>
    );
  };

  const FlowStep = ({ text }) => (
    <div className="relative pl-14 mb-6">
      <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(220,38,38,0.5)]">
        <span className="counter" />
      </div>
      <p className="text-gray-300 leading-relaxed">{text}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a0000] to-black text-white px-6 py-10 font-['Share_Tech_Mono'] overflow-x-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a0000_0%,#000_70%)]">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Corners */}
      <div className="absolute top-6 left-6 w-20 h-20 border-2 border-yellow-400 border-r-0 border-b-0 opacity-60 drop-shadow-[0_0_8px_#facc15]" />
      <div className="absolute top-6 right-6 w-20 h-20 border-2 border-yellow-400 border-l-0 border-b-0 opacity-60 drop-shadow-[0_0_8px_#facc15]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 border-b-2 border-red-600 pb-6">
          <h1 className="text-5xl font-extrabold tracking-wide mb-2 text-shadow-[3px_3px_0_#dc2626,6px_6px_20px_rgba(220,38,38,0.6)]">
            GAME RULES
          </h1>
          <p className="text-gray-400 tracking-widest text-sm md:text-base">
            COLLABORATIVE STEM PROBLEM SOLVING UNDER PRESSURE
          </p>
        </div>

        {/* Mission Objective */}
        <div className="bg-red-600/15 border-2 border-red-600 rounded-lg p-6 mb-10 shadow-[0_0_20px_rgba(220,38,38,0.3),inset_0_0_20px_rgba(220,38,38,0.1)]">
          <h3 className="flex items-center gap-3 text-yellow-400 text-xl mb-3">
            <AlertTriangle />
            MISSION OBJECTIVE
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Work together as a team to defuse the bomb before time runs out. The Defuser operates
            the modules while the Expert provides guidance from the manual. Communication and
            teamwork are your only weapons against detonation.
          </p>
        </div>

        {/* Player Roles */}
        <section className="mb-10 border border-white/10 rounded-lg bg-black/40 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-3 text-red-500 text-2xl font-semibold mb-6">
            <Users /> PLAYER ROLES
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <RoleCard title="DEFUSER" icon={Crosshair} color="red">
              <p className="text-gray-300 mb-2 font-semibold">Responsibilities:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>View and interact with the bomb interface</li>
                <li>Describe modules to the Expert</li>
                <li>Execute actions based on instructions</li>
                <li>Monitor the countdown timer</li>
              </ul>
              <p className="text-gray-300 mt-3 mb-2 font-semibold">Limitations:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>Cannot see the manual</li>
                <li>Must rely entirely on the Expert</li>
              </ul>
            </RoleCard>

            <RoleCard title="EXPERT" icon={BookOpen} color="cyan">
              <p className="text-gray-300 mb-2 font-semibold">Responsibilities:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>Interpret the STEM manual</li>
                <li>Guide the Defuser step-by-step</li>
                <li>Apply STEM logic and reasoning</li>
              </ul>
              <p className="text-gray-300 mt-3 mb-2 font-semibold">Limitations:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>Cannot see the bomb interface</li>
                <li>Must communicate clearly and efficiently</li>
              </ul>
            </RoleCard>
          </div>
        </section>

        {/* How to Play */}
        <section className="mb-10 border border-white/10 rounded-lg bg-black/40 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-3 text-red-500 text-2xl font-semibold mb-6">
            <Zap /> HOW TO PLAY
          </h2>
          <div className="space-y-4">
            {[
              "A random bomb is created with 2–6 modules. Each contains a unique STEM challenge.",
              "Defuser describes module visuals to the Expert (colors, symbols, numbers).",
              "Expert looks up the solution using the STEM manual.",
              "Expert provides clear step-by-step instructions.",
              "Defuser executes actions (cut wire, press button, etc.).",
              "Correct = green light, Incorrect = strike + time penalty.",
              "Repeat until all modules are defused or time runs out.",
            ].map((text, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-700 border-2 border-red-500 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <p className="text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STEM Modules */}
        <section className="mb-10 border border-white/10 rounded-lg bg-black/40 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-3 text-red-500 text-2xl font-semibold mb-4">
            <Layers /> STEM MODULES
          </h2>
          <p className="text-gray-300 mb-4">
            Each module represents a real STEM concept disguised as an interactive puzzle:
          </p>
          <h3 className="text-cyan-400 text-lg font-semibold mb-2">Currently Available:</h3>
          <Badge color="red" text="TANGLING WIRES" />
          <p className="text-gray-400 mt-3">
            Apply logic based on wire count (even/odd/square) and color patterns to determine which
            wire to cut.
          </p>

          <h3 className="text-yellow-400 text-lg font-semibold mt-6 mb-2">Coming Soon:</h3>
          <div className="flex flex-wrap">
            <Badge color="cyan" text="PHYSICS" />
            <Badge color="yellow" text="CHEMISTRY" />
            <Badge color="green" text="BIOLOGY" />
            <Badge color="cyan" text="COMPUTER SCIENCE" />
          </div>
        </section>

        {/* Time and Strikes */}
        <section className="mb-10 border border-white/10 rounded-lg bg-black/40 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-3 text-red-500 text-2xl font-semibold mb-4">
            <Timer /> TIME & STRIKES
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li><strong>Countdown Timer:</strong> When it hits zero, the bomb explodes!</li>
            <li><strong>Strikes:</strong> Each mistake costs time or causes instant detonation.</li>
            <li><strong>Success Indicators:</strong> Green = success, Red = mistake, Yellow = low time.</li>
          </ul>
        </section>

        {/* Tips */}
        <section className="border border-white/10 rounded-lg bg-black/40 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-3 text-red-500 text-2xl font-semibold mb-4">
            <Lightbulb /> TIPS FOR SUCCESS
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Communicate clearly with exact colors and positions.</li>
            <li>Stay calm and double-check instructions.</li>
            <li>Trust your partner and prioritize simpler modules first.</li>
          </ul>
        </section>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/room")}
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-cyan-400 rounded-lg text-cyan-400 font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
