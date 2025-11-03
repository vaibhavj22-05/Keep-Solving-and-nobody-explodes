import React, { useEffect, useState } from "react";

export default function StatusBulb({ moduleKey }) {
  const [color, setColor] = useState("red"); // default red (inactive/unsolved)

  useEffect(() => {
    const updateBulb = () => {
      const completed = localStorage.getItem(`${moduleKey}_moduleCompleted`);
      const status = localStorage.getItem(`${moduleKey}_moduleStatus`);

      if (completed === "true" && status === "defused") {
        setColor("green"); // ✅ Defused → Green
      } else {
        setColor("red"); // ❌ Default or exploded → Red
      }
    };

    updateBulb();

    const interval = setInterval(updateBulb, 500);
    window.addEventListener("storage", updateBulb);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateBulb);
    };
  }, [moduleKey]);

  return (
    <div
      className="w-4 h-4 rounded-full shadow-md transition-all duration-300"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
}
