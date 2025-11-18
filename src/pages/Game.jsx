import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCards } from "../utils/generateCards";
import { preloadImages } from "../utils/preloadImages";
import Card from "../components/Card";

export default function Game() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";
  const difficulty = localStorage.getItem("difficulty") || "easy";

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    resetGame();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Check win condition
  useEffect(() => {
    const pairsCount = cards.length / 2;
    if (pairsCount > 0 && matched.length === pairsCount) {
      stopTimer();
      setIsFinished(true);
      saveScoreToLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  function startTimer() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function resetGame() {
    stopTimer();
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setIsFinished(false);
    setHasStarted(false);

    const generated = generateCards(difficulty);
    const urls = generated.map((c) => c.img);

    setIsLoading(true);
    await preloadImages(urls);
    setCards(generated);
    setIsLoading(false);
  }

  const handleFlip = (index) => {
    if (isFinished) return;
    if (flipped.length === 2 || flipped.includes(index)) return;

    if (!hasStarted) {
      setHasStarted(true);
      startTimer();
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (cards[first].id === cards[second].id) {
        setMatched((prev) =>
          prev.includes(cards[first].id) ? prev : [...prev, cards[first].id]
        );
      }

      setTimeout(() => setFlipped([]), 800);
    }
  };

  function saveScoreToLeaderboard() {
    try {
      const raw = localStorage.getItem("memory_leaderboard");
      const board = raw ? JSON.parse(raw) : [];

      const entry = {
        name: username,
        time,
        moves,
        difficulty,
        date: new Date().toISOString(),
      };

      board.push(entry);
      board.sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        if (a.moves !== b.moves) return a.moves - b.moves;
        return new Date(a.date) - new Date(b.date);
      });

      localStorage.setItem(
        "memory_leaderboard",
        JSON.stringify(board.slice(0, 20))
      );
    } catch (e) {
      console.error("Failed to save leaderboard:", e);
    }
  }

  const handleRestart = () => resetGame();
  const openLeaderboard = () => navigate("/leaderboard");

  const gridCols =
    difficulty === "easy"
      ? "grid-cols-4"
      : difficulty === "medium"
      ? "grid-cols-6"
      : "grid-cols-8";

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center py-6">
      <div className="w-full max-w-6xl px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
            <p className="text-sm text-gray-300">
              Difficulty: {difficulty.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-900 px-4 py-2 rounded">
              ⏱ <span className="font-mono">{time}s</span>
            </div>
            <div className="bg-gray-900 px-4 py-2 rounded">
              🌀 Moves: <span className="font-mono">{moves}</span>
            </div>

            <button
              onClick={handleRestart}
              className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              New Game
            </button>

            <button
              onClick={openLeaderboard}
              className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
            >
              Leaderboard
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin mb-4"></div>
            <p>Loading images... please wait</p>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-3 justify-center`}>
            {cards.map((card, index) => (
              <Card
                key={index}
                card={card}
                flipped={flipped.includes(index) || matched.includes(card.id)}
                onClick={() => handleFlip(index)}
              />
            ))}
          </div>
        )}

        {isFinished && (
          <div className="mt-6 p-4 bg-green-900/60 rounded text-center">
            <h2 className="text-2xl font-bold">🎉 Congratulations — You Won!</h2>
            <p className="mt-2">
              Time: <span className="font-mono">{time}s</span> • Moves:{" "}
              <span className="font-mono">{moves}</span>
            </p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={handleRestart}
                className="bg-white text-black px-4 py-2 rounded-md"
              >
                Play Again
              </button>
              <button
                onClick={openLeaderboard}
                className="bg-yellow-400 text-black px-4 py-2 rounded-md"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
