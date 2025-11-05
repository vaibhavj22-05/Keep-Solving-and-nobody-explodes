import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function ExpertQuestionPage() {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  useEffect(() => {
  console.log("👀 ExpertQuestionPage mounted, listening for promptQuestion...");
}, []);


  useEffect(() => {
    socket.on("promptQuestion", (data) => {
      console.log("🧠 Received question:", data);
      setQuestionData(data);
      setSelected("");
    });

    return () => socket.off("promptQuestion");
  }, []);

  const handleSubmit = () => {
    if (!questionData || !selected) return;
    socket.emit("submitAnswer", {
      roomCode: questionData.roomCode,
      moduleId: questionData.moduleId,
      selectedAnswer: selected,
    });
  };

  if (!questionData) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-400">
        Waiting for a module to open...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
      <div className="bg-[#1c1c1c] p-8 rounded-2xl shadow-lg w-[480px] text-center border border-gray-700">
        <h1 className="text-2xl font-bold mb-6">Expert Module: {questionData.moduleId}</h1>
        <h2 className="text-lg mb-6">{questionData.question}</h2>

        <div className="flex flex-col gap-3 mb-6">
          {questionData.choices?.map((choice, index) => (
            <button
              key={index}
              onClick={() => setSelected(choice)}
              className={`px-4 py-2 rounded-lg border transition ${
                selected === choice
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            selected
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 cursor-not-allowed text-gray-300"
          }`}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
