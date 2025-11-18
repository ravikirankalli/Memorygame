// src/utils/generateCards.js
export const generateCards = (difficulty) => {
  const cardCount = difficulty === "easy" ? 8 : difficulty === "medium" ? 18 : 32;
  const pairs = cardCount / 2;
  const images = Array.from({ length: pairs }, (_, i) => ({
    id: i,
    img: `https://picsum.photos/200/260?random=${i + Math.floor(Math.random()*1000)}`,
  }));
  const cards = [...images, ...images].sort(() => Math.random() - 0.5);
  return cards;
};
