export default function Card({ card, flipped, onClick }) {
  return (
    <div
      className="relative w-20 h-24 bg-indigo-600 rounded-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      {flipped ? (
        <img src={card.img} alt="card" className="w-full h-full rounded-lg" />
      ) : (
        <div className="w-full h-full bg-indigo-800 rounded-lg flex items-center justify-center text-2xl">
          ❓
        </div>
      )}
    </div>
  );
}
