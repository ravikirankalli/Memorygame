// src/utils/preloadImages.js
export function preloadImages(urls = []) {
  // returns a Promise that resolves when all images either load or error
  const promises = urls.map(
    (u) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ url: u, status: "loaded" });
        img.onerror = () => resolve({ url: u, status: "error" });
        img.src = u;
      })
  );
  return Promise.all(promises);
}
