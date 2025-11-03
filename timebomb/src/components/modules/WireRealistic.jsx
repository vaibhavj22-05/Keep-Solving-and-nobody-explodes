import React, { useEffect, useState } from "react";

export default function WireRealistic() {
  const [correctWire, setCorrectWire] = useState("");
  const [status, setStatus] = useState("");
  const [wireSetup, setWireSetup] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // 🔊 Play sound helper
  const playSound = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.play();
  };

  // 🧩 Determine correct wire based on rules
  function determineCorrectWire(wires, answer = 7) {
    const colors = wires.map((w) => w.color);
    const count = wires.length;
    if (count === 3) return wires[1].id;
    if (count === 4) return wires[2].id;
    if (count === 5) return wires[3].id;
    return wires[Math.floor(Math.random() * wires.length)].id;
  }

  // 🧠 Reset if new session
  useEffect(() => {
    const sessionMarker = sessionStorage.getItem("sessionActive");
    if (!sessionMarker) {
      sessionStorage.setItem("sessionActive", "true");
      localStorage.removeItem("wireSetup");
      localStorage.removeItem("correctWire");
      localStorage.removeItem("wires_moduleCompleted");
      localStorage.removeItem("wires_moduleStatus");
    }
  }, []);

  // 🧩 Initialize wires
  useEffect(() => {
    const completed = localStorage.getItem("wires_moduleCompleted");
    if (completed === "true") {
      const prevStatus =
        localStorage.getItem("wires_moduleStatus") || "defused";
      setStatus(prevStatus);
      setDisabled(true);
      return;
    }

    const savedSetup = localStorage.getItem("wireSetup");
    const savedCorrect = localStorage.getItem("correctWire");

    if (savedSetup && savedCorrect) {
      setWireSetup(JSON.parse(savedSetup));
      setCorrectWire(savedCorrect);
    } else {
      const colors = ["red", "blue", "green", "yellow", "white", "black"];
      const wireCount = Math.floor(Math.random() * 3) + 3; // 3–5 wires
      const shuffled = [...colors]
        .sort(() => 0.5 - Math.random())
        .slice(0, wireCount);
      const positions = [70, 130, 190, 250, 310];
      const wires = shuffled.map((color, i) => ({
        id: `${color}Wire${i}`,
        y: positions[i],
        color,
      }));

      const correct = determineCorrectWire(wires);
      setWireSetup(wires);
      setCorrectWire(correct);

      localStorage.setItem("wireSetup", JSON.stringify(wires));
      localStorage.setItem("correctWire", correct);
    }
  }, []);

  // 🧩 Wire cutting logic
  useEffect(() => {
    if (wireSetup.length === 0 || disabled) return;

    wireSetup.forEach((wire) => {
      const path = document.getElementById(wire.id);
      if (path) path.addEventListener("click", () => cutWire(wire));
    });

    function cutWire(wire) {
      if (status || disabled) return;
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
        `M 20 ${wire.y} C 150 ${wire.y - 40}, 200 ${wire.y + 10}, 250 ${
          wire.y - 20
        }`,
        wire.color
      );
      const rightPath = createPath(
        `M 270 ${wire.y + 10} C 320 ${wire.y + 40}, 400 ${
          wire.y - 20
        }, 500 ${wire.y}`,
        wire.color
      );

      const spark = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      spark.setAttribute("cx", 260);
      spark.setAttribute("cy", wire.y);
      spark.setAttribute("r", 5);
      spark.classList.add("spark");

      svg.appendChild(leftPath);
      svg.appendChild(rightPath);
      svg.appendChild(spark);
      setTimeout(() => spark.remove(), 600);

      // ✅ Module logic (no redirects now)
      if (wire.id === correctWire) {
        setStatus("defused");
        playSound("/sounds/spike.mp3");
        localStorage.setItem("wires_moduleCompleted", "true");
        localStorage.setItem("wires_moduleStatus", "defused");
      } else {
        setStatus("exploded");
        playSound("/sounds/explosion.mp3");
        localStorage.setItem("wires_moduleCompleted", "true");
        localStorage.setItem("wires_moduleStatus", "exploded");
      }
      setDisabled(true);
    }

    return () => {
      wireSetup.forEach((wire) => {
        const path = document.getElementById(wire.id);
        if (path) path.removeEventListener("click", () => cutWire(wire));
      });
    };
  }, [wireSetup, correctWire, status, disabled]);

  return (
    <div className="relative w-[520px] h-[340px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000] flex flex-col items-center justify-center">
      {/* STOP Button */}
      <button
        disabled={disabled}
        className={`absolute bottom-[20px] right-[20px] px-6 py-2 font-bold rounded-full transition ${
          disabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white shadow-[0_0_15px_red] hover:bg-red-800"
        }`}
        onClick={() => {
          if (!status && !disabled) {
            setStatus("exploded");
            setDisabled(true);
            playSound("/sounds/explosion.mp3");
            localStorage.setItem("wires_moduleCompleted", "true");
            localStorage.setItem("wires_moduleStatus", "exploded");
          }
        }}
      >
        STOP
      </button>

      {/* Wire End Nodes */}
      {wireSetup.map((wire, i) => (
        <React.Fragment key={i}>
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
            style={{
              left: "10px",
              top: `${wire.y - 10}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
            style={{
              right: "10px",
              top: `${wire.y - 10}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
        </React.Fragment>
      ))}

      {/* SVG Wires */}
      <svg
        id="wires"
        className="absolute top-0 left-0 w-[520px] h-[340px] cursor-pointer"
      >
        {wireSetup.map((wire) => (
          <path
            key={wire.id}
            id={wire.id}
            className="wire-shadow"
            d={`M 20 ${wire.y} C 150 ${wire.y - 40}, 300 ${wire.y + 40}, 500 ${wire.y}`}
            stroke={wire.color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* ✅ Result Overlay */}
      {status && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
            status === "defused"
              ? "text-green-400 bg-black/70"
              : "text-red-500 bg-black/70"
          }`}
        >
          {status === "defused"
            ? "✅ MODULE SOLVED"
            : "💥 BOMB EXPLODED"}
        </div>
      )}

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
