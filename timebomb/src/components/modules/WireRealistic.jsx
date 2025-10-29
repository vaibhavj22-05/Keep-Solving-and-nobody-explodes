// components/modules/WireRealistic.jsx
import React, { useEffect } from "react";

export default function WireRealistic() {
  useEffect(() => {
    const wires = [
      { id: "redWire", y: 80, color: "red" },
      { id: "blueWire", y: 150, color: "blue" },
      { id: "greenWire", y: 220, color: "lime" },
    ];

    wires.forEach((wire) => {
      const path = document.getElementById(wire.id);
      if (path) {
        path.addEventListener("click", () => cutWire(wire));
      }
    });

    function cutWire(wire) {
      const path = document.getElementById(wire.id);
      if (!path || path.dataset.cut === "true") return;
      path.dataset.cut = "true";

      const svg = path.parentNode;
      path.remove();

      const createPath = (d, color) => {
        const newPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        newPath.setAttribute("d", d);
        newPath.setAttribute("stroke", color);
        newPath.setAttribute("stroke-width", 6);
        newPath.setAttribute("fill", "none");
        newPath.setAttribute("stroke-linecap", "round");
        newPath.classList.add("wire-shadow");
        return newPath;
      };

      const leftPath = createPath(
        `M 20 ${wire.y} C 150 ${wire.y - 40}, 200 ${wire.y + 10}, 250 ${wire.y - 20}`,
        wire.color
      );

      const rightPath = createPath(
        `M 270 ${wire.y + 10} C 320 ${wire.y + 40}, 400 ${wire.y - 20}, 500 ${wire.y}`,
        wire.color
      );

      const spark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      spark.setAttribute("cx", 260);
      spark.setAttribute("cy", wire.y);
      spark.setAttribute("r", 5);
      spark.classList.add("spark");

      svg.appendChild(leftPath);
      svg.appendChild(rightPath);
      svg.appendChild(spark);

      setTimeout(() => spark.remove(), 600);
    }

    return () => {
      wires.forEach((wire) => {
        const path = document.getElementById(wire.id);
        if (path) path.removeEventListener("click", () => cutWire(wire));
      });
    };
  }, []);

  return (
    <div className="bomb relative w-[520px] h-[320px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000]">
      <div className="timer absolute top-[15px] left-1/2 -translate-x-1/2 bg-black text-red-500 text-2xl px-6 py-2 rounded-lg border-2 border-red-900 shadow-inner">
        00:45
      </div>
      <button className="stop-btn absolute bottom-[20px] right-[20px] bg-red-600 text-white px-6 py-2 font-bold rounded-full shadow-[0_0_15px_red] hover:bg-red-800 transition">
        STOP
      </button>

      {/* Nodes */}
      {[70, 140, 210].map((top, i) => (
        <React.Fragment key={i}>
          <div
            className="node absolute w-[20px] h-[20px] rounded-full border-2 border-[#222] shadow-[inset_0_0_3px_#000,0_0_4px_#111]"
            style={{
              left: "10px",
              top: `${top}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
          <div
            className="node absolute w-[20px] h-[20px] rounded-full border-2 border-[#222] shadow-[inset_0_0_3px_#000,0_0_4px_#111]"
            style={{
              right: "10px",
              top: `${top}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
        </React.Fragment>
      ))}

      {/* Wires */}
      <svg
        id="wires"
        className="absolute top-0 left-0 w-[520px] h-[320px] cursor-pointer"
      >
        <path
          id="redWire"
          className="wire-shadow"
          d="M 20 80 C 150 40, 300 120, 500 80"
          stroke="red"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          id="blueWire"
          className="wire-shadow"
          d="M 20 150 C 150 110, 300 190, 500 150"
          stroke="blue"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          id="greenWire"
          className="wire-shadow"
          d="M 20 220 C 150 180, 300 260, 500 220"
          stroke="lime"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Extra CSS */}
      <style>{`
        .spark {
          fill: yellow;
          opacity: 0.9;
          animation: sparkAnim 0.5s ease-out forwards;
        }
        @keyframes sparkAnim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .wire-shadow {
          filter: drop-shadow(0 0 2px #000);
        }
      `}</style>
    </div>
  );
}
