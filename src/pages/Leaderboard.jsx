import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("memory_leaderboard");
    const board = raw ? JSON.parse(raw) : [];
    // make sure sort is enforced (time asc, moves asc, date asc)
    board.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      if (a.moves !== b.moves) return a.moves - b.moves;
      return new Date(a.date) - new Date(b.date);
    });
    setScores(board);
  }, []);

  const handleBack = () => navigate("/game");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="w-full max-w-3xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <button onClick={handleBack} className="bg-indigo-600 px-4 py-2 rounded">
            Back to Game
          </button>
        </div>

        <div className="bg-gray-800 rounded shadow p-4">
          {scores.length === 0 ? (
            <p className="text-gray-300">No scores yet — be the first!</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="p-2">#</th>
                  <th>Name</th>
                  <th>Time (s)</th>
                  <th>Moves</th>
                  <th>Difficulty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => (
                  <tr key={idx} className="border-t border-gray-700">
                    <td className="p-2 align-top">{idx + 1}</td>
                    <td className="p-2">{s.name}</td>
                    <td className="p-2 font-mono">{s.time}</td>
                    <td className="p-2 font-mono">{s.moves}</td>
                    <td className="p-2">{s.difficulty}</td>
                    <td className="p-2 text-sm text-gray-400">
                      {new Date(s.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
