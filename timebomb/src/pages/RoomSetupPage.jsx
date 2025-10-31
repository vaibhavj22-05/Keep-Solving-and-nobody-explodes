import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const RoleSelectionPage = () => {
  const { state } = useLocation();
  const roomCode = state?.roomCode;
  const navigate = useNavigate();

  const [myRole, setMyRole] = useState(null);
  const [roomReady, setRoomReady] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    socket.on("room-ready", ({ roomCode, players }) => {
      console.log("✅ Room ready:", roomCode, players);
      setRoomReady(true);
    });

    socket.on("role-assigned", ({ yourRole }) => {
      setMyRole(yourRole);
      console.log("You got role:", yourRole);
      setTimeout(() => navigate("/room", { state: { roomCode, role: yourRole } }), 1500);
    });

    socket.on("waiting-for-player", () => {
      alert("Waiting for another player to join...");
    });

    socket.on("error", (msg) => alert(msg));

    return () => {
      socket.off("room-ready");
      socket.off("role-assigned");
      socket.off("waiting-for-player");
      socket.off("error");
    };
  }, [roomCode, navigate]);

  const chooseRole = (role) => {
    if (!myRole && roomReady) {
      socket.emit("choose-role", { roomCode, role });
    } else if (!roomReady) {
      alert("Room not ready yet! Wait for the other player.");
    }
  };

  return (
    <div className="role-selection">
      <h2>Room Code: {roomCode}</h2>
      {!myRole ? (
        <div>
          <h3>Select your role</h3>
          <button disabled={!roomReady} onClick={() => chooseRole("diffuser")}>
            💥 Diffuser
          </button>
          <button disabled={!roomReady} onClick={() => chooseRole("expert")}>
            📖 Expert
          </button>
          {!roomReady && <p>Waiting for second player to join...</p>}
        </div>
      ) : (
        <h3>You are the {myRole.toUpperCase()}!</h3>
      )}
    </div>
  );
};

export default RoleSelectionPage;

