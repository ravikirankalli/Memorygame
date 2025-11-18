import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Settings() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");

  const handleStart = () => {
    localStorage.setItem("difficulty", difficulty);
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Select Difficulty</h2>
      <div className="flex gap-4 mb-6">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            className={`px-6 py-2 rounded-md ${
              difficulty === level ? "bg-indigo-500" : "bg-gray-700"
            }`}
            onClick={() => setDifficulty(level)}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={handleStart}
        className="bg-green-500 px-6 py-2 rounded-md hover:bg-green-600"
      >
        Start Game
      </button>
    </div>
  );
}
