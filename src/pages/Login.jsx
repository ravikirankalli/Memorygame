import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username);
      navigate("/settings");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-500 to-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Memory Card Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-3 rounded-md text-black w-64 mb-4 bg-auto"
      />
      <button
        onClick={handleLogin}
        className="bg-cyan-800 text-white-700 font-semibold px-6 py-2 rounded-md hover:bg-gray-400 transition"
      >
        Start Game
      </button>
    </div>
  );
}
