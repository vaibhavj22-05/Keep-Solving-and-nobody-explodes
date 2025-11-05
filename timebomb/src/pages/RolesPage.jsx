import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function RolesPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roomCode = state?.roomCode;

  const [yourRole, setYourRole] = useState(null);
  const [status, setStatus] = useState("Waiting for second player...");

  useEffect(() => {
    socket.on("waiting-for-player", () => {
      console.log("🕒 Waiting for another player");
      setStatus("Waiting for second player...");
    });

    socket.on("role-assigned", ({ yourRole }) => {
      console.log("🎯 Role assigned:", yourRole);
      setYourRole(yourRole);
      setStatus(`✅ You are the ${yourRole.toUpperCase()}!`);

      setTimeout(() => {
        if (yourRole === "diffuser") {
          navigate("/diffuser", { replace: true, state: { roomCode } }); // ✅ FIXED
        } else {
          navigate("/expert", { replace: true, state: { roomCode } }); // ✅ FIXED
        }
      }, 1500);
    });

    return () => {
      socket.off("waiting-for-player");
      socket.off("role-assigned");
    };
  }, [navigate, roomCode]);

  const handleChoose = (role) => {
    console.log("🧩 Role chosen:", role);
    socket.emit("choose-role", { roomCode, role });
    setStatus(`You chose ${role} — waiting for server...`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0c10] text-white font-mono">
      <h1 className="text-2xl mb-4 text-cyan-400">Room Code: {roomCode}</h1>

      {!yourRole ? (
        <div className="flex space-x-4">
          <button
            onClick={() => handleChoose("diffuser")}
            className="px-6 py-3 bg-red-600 rounded hover:bg-red-500"
          >
            💥 Diffuser
          </button>
          <button
            onClick={() => handleChoose("expert")}
            className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500"
          >
            📖 Expert
          </button>
        </div>
      ) : (
        <h2 className="mt-4 text-xl">{status}</h2>
      )}

      <p className="mt-6 text-gray-400">{status}</p>
    </div>
  );
}
