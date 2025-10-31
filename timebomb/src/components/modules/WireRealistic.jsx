import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WireRealistic() {
  const [correctWire, setCorrectWire] = useState("");
  const [status, setStatus] = useState("");
  const [wireSetup, setWireSetup] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  // 🔊 Play sound helper
  const playSound = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.play();
  };

  // 🧠 Detect full reload using sessionStorage marker
  useEffect(() => {
    const sessionMarker = sessionStorage.getItem("sessionActive");
    if (!sessionMarker) {
      // This only runs once per full page reload (new session)
      sessionStorage.setItem("sessionActive", "true");
      localStorage.removeItem("wireSetup");
      localStorage.removeItem("correctWire");
      localStorage.removeItem("moduleCompleted");
      localStorage.removeItem("moduleStatus");
    }
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem("moduleCompleted");
    if (completed === "true") {
      const prevStatus = localStorage.getItem("moduleStatus") || "defused";
      setStatus(prevStatus);
      setDisabled(true);
      if (prevStatus === "exploded") playSound("/sounds/explosion.mp3");
      return;
    }

    // Load saved setup if available
    const savedSetup = localStorage.getItem("wireSetup");
    const savedCorrect = localStorage.getItem("correctWire");

    if (savedSetup && savedCorrect) {
      setWireSetup(JSON.parse(savedSetup));
      setCorrectWire(savedCorrect);
    } else {
      // 🎲 Randomize wires (only once per session)
      const colors = ["red", "blue", "green", "yellow", "white", "black"];
      const shuffled = [...colors].sort(() => 0.5 - Math.random()).slice(0, 3);
      const positions = [80, 150, 220];
      const wires = shuffled.map((color, i) => ({
        id: `${color}Wire`,
        y: positions[i],
        color,
      }));
      const randomCorrect = wires[Math.floor(Math.random() * wires.length)].id;

      setWireSetup(wires);
      setCorrectWire(randomCorrect);

      localStorage.setItem("wireSetup", JSON.stringify(wires));
      localStorage.setItem("correctWire", randomCorrect);
    }
  }, []);

  // 🧨 Redirect when bomb explodes
  useEffect(() => {
    if (status === "exploded") {
      setTimeout(() => {
        navigate("/exploded");
      }, 1500); // small delay for sound and effect
    }
  }, [status, navigate]);

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

      if (wire.id === correctWire) {
        setStatus("defused");
        playSound("/sounds/spikePlant.mp3");
        localStorage.setItem("moduleCompleted", "true");
        localStorage.setItem("moduleStatus", "defused");
      } else {
        setStatus("exploded");
        playSound("/sounds/explosion.mp3");
        localStorage.setItem("moduleCompleted", "true");
        localStorage.setItem("moduleStatus", "exploded");
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
    <div className="relative w-[520px] h-[320px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000] flex flex-col items-center justify-center">
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
            localStorage.setItem("moduleCompleted", "true");
            localStorage.setItem("moduleStatus", "exploded");
          }
        }}
      >
        STOP
      </button>

      {/* Wire End Nodes */}
      {[70, 140, 210].map((top, i) => (
        <React.Fragment key={i}>
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222] shadow-[inset_0_0_3px_#000,0_0_4px_#111]"
            style={{
              left: "10px",
              top: `${top}px`,
              background:
                "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222] shadow-[inset_0_0_3px_#000,0_0_4px_#111]"
            style={{
              right: "10px",
              top: `${top}px`,
              background:
                "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
        </React.Fragment>
      ))}

      {/* SVG Wires */}
      <svg
        id="wires"
        className="absolute top-0 left-0 w-[520px] h-[320px] cursor-pointer"
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
          {status === "defused" ? "✅ MODULE SOLVED" : "💥 BOMB EXPLODED"}
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
