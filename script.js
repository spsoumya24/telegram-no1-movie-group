// Add, edit, or remove movie entries in movies.json. The website reads that file automatically.
fetch("movies.json?v=" + Date.now())
  .then(response => {
    if (!response.ok) throw new Error("Could not load movies.json");
    return response.json();
  })
  .then(movies => {
    const movieGrid = document.getElementById("movie-grid");
    const params = new URLSearchParams(window.location.search);
    const selectedMovie = params.get("movie");
    const visibleMovies = selectedMovie
      ? movies.filter(movie => String(movie.id).toLowerCase() === selectedMovie.toLowerCase())
      : movies;

    visibleMovies.forEach(movie => {
      const card = document.createElement("article");
      card.className = "movie-card";

      const image = document.createElement("img");
      image.src = movie.image;
      image.alt = movie.title || "Movie poster";
      image.loading = "lazy";
      card.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = movie.title || "Untitled Movie";
      card.appendChild(title);

      if (movie.link) {
        const link = document.createElement("a");
        link.href = movie.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "movie-card-link";
        link.setAttribute("aria-label", "Open " + (movie.title || "movie"));
        card.appendChild(link);
        card.classList.add("is-clickable");
        card.addEventListener("click", event => {
          if (event.target !== link) window.open(movie.link, "_blank", "noopener");
        });
      }
      movieGrid.appendChild(card);
    });
  })
  .catch(error => console.error("Movie data loading error:", error));

// Advertisement slots are configured separately in ads.js.
const adSlots = Array.isArray(window.MAITIHUB_ADS) ? window.MAITIHUB_ADS : [];
const adGrid = document.getElementById("ad-grid");
adSlots.forEach((slot, index) => {
  const element = slot.url ? document.createElement("a") : document.createElement("div");
  element.className = "ad-slot";
  element.setAttribute("aria-label", slot.alt || `Advertisement space ${index + 1}`);
  if (slot.url) {
    element.href = slot.url;
    element.target = "_blank";
    element.rel = "noopener noreferrer sponsored";
  }
  if (slot.image) {
    const image = document.createElement("img");
    image.src = slot.image;
    image.alt = slot.alt || "Sponsored banner";
    element.appendChild(image);
  }
  adGrid.appendChild(element);
});

document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(opened));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));
