import React, { useState, useEffect } from "react";

export default function ChemicalChaosGame() {
  const CHEMICALS = [
    { name: "Acid", color: "#ff4b4b", label: "Red", type: "acid" },
    { name: "Base", color: "#4b7bff", label: "Blue", type: "base" },
    { name: "Water", color: "#46e07b", label: "Clear", type: "water" },
    { name: "Metal", color: "#888", label: "Gray", type: "metal" },
    { name: "Salt", color: "#f8e44d", label: "Yellow", type: "salt" },
    { name: "Unknown", color: "#b94bff", label: "?", type: "unknown" },
  ];

  const RULES = {
    explosion: [
      ["acid", "metal"],
      ["metal", "acid"],
    ],
    fizz: [
      ["acid", "base"],
      ["acid", "salt"],
      ["acid", "unknown"],
    ],
    stable: [
      ["acid", "water"],
      ["acid", "water", "salt"],
      ["salt", "metal"],
      ["base", "water"],
      ["base", "salt"],
    ],
  };

  const [beakers, setBeakers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("Mix carefully!");
  const [bgColor, setBgColor] = useState("#0a0c10");

  // Shuffle chemicals when game starts
  useEffect(() => {
    const randomBeakers = [...CHEMICALS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map((chem, i) => ({
        ...chem,
        id: i,
      }));
    setBeakers(randomBeakers);
  }, []);

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const mixColors = (c1, c2) => {
    const a = hexToRgb(c1),
      b = hexToRgb(c2);
    return `rgb(${(a[0] + b[0]) / 2}, ${(a[1] + b[1]) / 2}, ${
      (a[2] + b[2]) / 2
    })`;
  };

  const reaction = (t1, t2) => {
    const combo = [t1, t2].sort().join("-");
    if (RULES.explosion.some((r) => r.sort().join("-") === combo))
      return "explosion";
    if (RULES.fizz.some((r) => r.sort().join("-") === combo)) return "fizz";
    if (RULES.stable.some((r) => r.sort().join("-") === combo)) return "stable";
    if (t1 === "unknown" || t2 === "unknown")
      return Math.random() > 0.5 ? "fizz" : "stable";
    return "unknown";
  };

  const handleBeakerClick = (b) => {
    if (selected.includes(b.id)) {
      setSelected(selected.filter((id) => id !== b.id));
      return;
    }

    const newSel = [...selected, b.id];
    setSelected(newSel);

    if (newSel.length === 2) {
      const b1 = beakers.find((x) => x.id === newSel[0]);
      const b2 = beakers.find((x) => x.id === newSel[1]);
      const result = reaction(b1.type, b2.type);
      const mixColor = mixColors(b1.color, b2.color);
      applyEffect(result, b1, b2, mixColor);
      setSelected([]);
    }
  };

  const applyEffect = (effect, b1, b2, mixColor) => {
    switch (effect) {
      case "explosion":
        setMessage("💥 Explosion!");
        setBgColor("#330000");
        setTimeout(() => setBgColor("#0a0c10"), 700);
        break;
      case "fizz":
        setMessage("⚠️ Unstable reaction!");
        break;
      case "stable":
        setMessage("✅ Stable mix!");
        setBgColor("#003300");
        setTimeout(() => setBgColor("#0a0c10"), 1000);
        break;
      default:
        setMessage("❓ Unknown result");
    }

    // Update colors visually
    setBeakers((prev) =>
      prev.map((b) => {
        if (b.id === b1.id)
          return { ...b, color: mixColor, type: "mixed", fizz: effect };
        if (b.id === b2.id)
          return { ...b, color: "#202428", type: "used", fizz: effect };
        return b;
      })
    );

    // Clear fizz effect after animation
    setTimeout(() => {
      setBeakers((prev) => prev.map((b) => ({ ...b, fizz: null })));
    }, 1000);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-4 rounded-xl transition-colors duration-500"
      style={{ background: bgColor }}
    >
      <h2 className="text-cyan-400 font-bold text-2xl mb-2">🧪 Chemical Chaos</h2>
      <p className="text-gray-400 text-sm mb-4">{message}</p>

      <div className="flex justify-around w-full max-w-md bg-gradient-to-b from-[#2c2f34] to-[#1a1c20] border-2 border-gray-600 rounded-xl p-6 shadow-inner">
        {beakers.map((b) => (
          <div
            key={b.id}
            onClick={() => handleBeakerClick(b)}
            className={`relative w-12 h-28 border-2 border-gray-500 rounded-b-xl cursor-pointer overflow-hidden transition-transform duration-200 ${
              selected.includes(b.id) ? "outline outline-2 outline-cyan-400 -translate-y-1" : ""
            } ${b.fizz === "explosion" ? "animate-pulse border-red-500" : ""} ${
              b.fizz === "fizz" ? "brightness-150" : ""
            }`}
          >
            <div className="absolute top-1 w-full text-center text-gray-300 text-sm font-semibold">
              {String.fromCharCode(65 + b.id)}
            </div>
            <div
              className="absolute bottom-0 w-full h-3/5 rounded-b-xl transition-all duration-700"
              style={{ backgroundColor: b.color }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
