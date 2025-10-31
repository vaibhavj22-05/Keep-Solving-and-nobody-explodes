import { useLocation, useNavigate } from "react-router-dom";

export default function DiffuserPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roomCode = state?.roomCode;

  const handlePlayGame = () => {
    console.log("🎮 Redirecting to Game Page with room:", roomCode);
    navigate("/game", { state: { roomCode } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#111827] text-white font-mono">
      <h1 className="text-3xl text-red-500 mb-4">💣 Diffuser Interface</h1>
      <p className="text-gray-400 mb-2">Room Code: {roomCode}</p>
      <p className="mb-6 text-sm">This will show the full time bomb with all modules.</p>

      <button
        onClick={handlePlayGame}
        className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition"
      >
        ▶️ Play Game
      </button>
    </div>
  );
}
