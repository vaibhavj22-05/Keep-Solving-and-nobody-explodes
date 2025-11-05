import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { AlertTriangle, MessageSquare } from "lucide-react";

export default function ExpertQuestionPage() {
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();

  // Load stored question if available
  useEffect(() => {
    const stored = localStorage.getItem("currentQuestion");
    if (stored) setQuestion(JSON.parse(stored));
  }, []);

  // Listen for new question updates
  useEffect(() => {
  const handleQuestion = (data) => {
    console.log("🧩 New question received:", data);
    setQuestion(data);
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify({ question: data.question, answer: data.answer, moduleId: data.moduleId })
    );
  };

  socket.on("promptQuestion", handleQuestion);

  return () => socket.off("promptQuestion", handleQuestion);
}, []);

  if (!question) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
        <AlertTriangle className="w-10 h-10 text-yellow-400 mb-3" />
        <p className="text-gray-400 text-lg">
          Waiting for a new question from the diffuser...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <div className="mb-8 text-center z-10">
        <h1 className="text-4xl font-black text-cyan-400 drop-shadow-lg mb-2">
          EXPERT QUESTION
        </h1>
        <p className="text-gray-500 tracking-widest">
          Awaiting expert guidance...
        </p>
      </div>

      {/* Question Card */}
      <div className="relative z-10 bg-gray-900/70 border-2 border-cyan-500 rounded-2xl p-8 max-w-3xl w-full backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-300">Incoming Question</h2>
        </div>

        <p className="text-lg text-gray-200 leading-relaxed mb-4">
          {question.question || "No question text available."}
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/expert")}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 border-2 border-cyan-400 rounded-lg font-bold tracking-wider transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Manual
          </button>
        </div>
      </div>
    </div>
  );
}
