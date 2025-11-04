import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChemicalChaosGame() {
  const navigate = useNavigate();

  const CHEMICALS = [
    { name: "Acid", color: "#ff4b4b", type: "acid" },
    { name: "Base", color: "#4b7bff", type: "base" },
    { name: "Water", color: "#46e07b", type: "water" },
    { name: "Metal", color: "#888888", type: "metal" },
    { name: "Salt", color: "#f8e44d", type: "salt" },
    { name: "Unknown", color: "#b94bff", type: "unknown" },
  ];

  const [beakers, setBeakers] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("Mix carefully, Defuser!");
  const [bgColor, setBgColor] = useState("#0a0c10");
  const [status, setStatus] = useState("in_progress");
  const [correctOrder, setCorrectOrder] = useState([]);

  const RULES = {
    3: [
      ["acid", "base", "water"],
      ["acid", "water", "metal"],
      ["base", "salt", "metal"],
      ["acid", "base", "metal"],
    ],
    4: [
      ["acid", "water", "salt", "metal"],
      ["base", "acid", "acid", "unknown"],
      ["acid", "base", "salt", "metal"],
    ],
    5: [
      ["acid", "base", "salt", "water", "metal"],
      ["acid", "base", "acid", "salt", "water"],
      ["acid", "base", "salt", "unknown", "metal"],
      ["acid", "salt", "base", "metal", "water"],
    ],
  };

  const determineSafeOrder = (chemList) => {
    const types = chemList.map((c) => c.type);
    const count = types.length;
    const rules = RULES[count] || [];
    for (let rule of rules) {
      if (rule.every((r) => types.includes(r))) return rule;
    }
    return ["acid", "base", "water", "salt", "metal"].filter((t) =>
      types.includes(t)
    );
  };

  useEffect(() => {
    const completed = localStorage.getItem("chemical_moduleCompleted");
    const statusLS = localStorage.getItem("chemical_moduleStatus");
    const savedAnswer = localStorage.getItem("chemicalChaosAnswer");

    // ✅ Restore solved module
    if (completed === "true" && statusLS === "defused") {
      const savedBeakers = JSON.parse(localStorage.getItem("chemicalChaosBeakers"));
      const savedCorrect = JSON.parse(savedAnswer);
      setBeakers(savedBeakers || []);
      setCorrectOrder(savedCorrect || []);
      setStatus("defused");
      setMessage("✅ MODULE SOLVED");
      setBgColor("#003300");
      return;
    }

    // 🧪 Generate random beakers (3–5)
    const count = Math.floor(Math.random() * 3) + 3;
    const selected = [...CHEMICALS]
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((c, i) => ({ ...c, id: i }));

    const correct = determineSafeOrder(selected);

    setBeakers(selected);
    setCorrectOrder(correct);

    // 🧠 Save to localStorage
    localStorage.setItem("chemicalChaosAnswer", JSON.stringify(correct));
    localStorage.setItem("chemicalChaosBeakers", JSON.stringify(selected));
    localStorage.setItem("chemical_moduleCompleted", "false");
    localStorage.setItem("chemical_moduleStatus", "in_progress");
  }, []);

  // 🚨 Redirect after explosion
  useEffect(() => {
    if (status === "exploded") {
      const timer = setTimeout(() => {
        navigate("/exploded");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleBeakerClick = (b) => {
    if (status !== "in_progress") return;
    if (sequence.find((x) => x.id === b.id)) return;

    const newSeq = [...sequence, b];
    setSequence(newSeq);

    localStorage.setItem(
      "chemicalChaosUserOrder",
      JSON.stringify(newSeq.map((s) => s.type))
    );

    const expectedType = correctOrder[newSeq.length - 1];

    if (b.type !== expectedType) {
      setMessage("💥 Explosion! Wrong chemical order!");
      setBgColor("#300000");
      setStatus("exploded");
      localStorage.setItem("chemical_moduleCompleted", "true");
      localStorage.setItem("chemical_moduleStatus", "exploded");
      return;
    }

    setBeakers((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, mixed: true } : x))
    );

    if (newSeq.length === correctOrder.length) {
      setMessage("✅ Stable Reaction! MODULE DEFUSED");
      setBgColor("#003300");
      setStatus("defused");
      localStorage.setItem("chemical_moduleCompleted", "true");
      localStorage.setItem("chemical_moduleStatus", "defused");
    } else {
      setMessage("✅ Safe so far... continue mixing!");
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full p-4 rounded-xl transition-colors duration-700"
      style={{ background: bgColor }}
    >
      {/* Overlay status display */}
      {status !== "in_progress" && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
            status === "defused"
              ? "text-green-400 bg-black/70"
              : "text-red-500 bg-black/70"
          }`}
        >
          {status === "defused" ? "✅ MODULE SOLVED" : "💥 BOMB EXPLODED"}
        </div>
      )}

      <h2 className="text-cyan-400 font-bold text-2xl mb-2">
        🧪 Chemical Chaos
      </h2>
      <p className="text-gray-300 text-sm mb-4">{message}</p>

      {beakers.length > 0 ? (
        <div className="flex justify-around w-full max-w-md bg-gradient-to-b from-[#2c2f34] to-[#1a1c20] border-2 border-gray-600 rounded-xl p-6 shadow-inner">
          {beakers.map((b) => (
            <div
              key={b.id}
              onClick={() => handleBeakerClick(b)}
              className={`relative w-14 h-32 border-2 border-gray-500 rounded-b-xl cursor-pointer overflow-hidden transition-transform duration-200 ${
                sequence.find((x) => x.id === b.id)
                  ? "opacity-50 scale-95"
                  : "hover:-translate-y-1"
              }`}
            >
              <div
                className="absolute bottom-0 w-full h-3/5 rounded-b-xl transition-all duration-700"
                style={{ backgroundColor: b.color }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Preparing chemicals...</p>
      )}
    </div>
  );
}
