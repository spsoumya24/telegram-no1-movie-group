// MaitiHub24: movies.json is the single source for slider and movie cards.
// Pagination: show exactly 4 movie cards per page. No index.html or style.css change is required.

const movieGrid = document.getElementById('movie-grid');
const heroSlide = document.getElementById('movie-slide');
const heroImage = document.getElementById('hero-movie-image');
const heroTitle = document.getElementById('hero-movie-title');
const dots = [...document.querySelectorAll('#slider-dots button')];
let movies = [];
let currentMovieSlide = 0;
let slideTimer;
let currentPage = 1;
const MOVIES_PER_PAGE = 4;

// Add pagination styling here so only this script.js file needs replacing.
const paginationStyle = document.createElement('style');
paginationStyle.textContent = `
  .movie-pagination{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;margin:24px 0 8px;padding:8px 0}
  .movie-pagination button{min-width:40px;height:40px;padding:0 12px;border:1px solid #34404b;border-radius:10px;background:#111b25;color:#dce5ed;font-weight:700;font-size:14px;cursor:pointer}
  .movie-pagination button.active{background:#229ed9;border-color:#229ed9;color:#fff}
  .movie-pagination button:disabled{opacity:.4;cursor:not-allowed}
  .movie-pagination .page-info{width:100%;text-align:center;color:#8f9ba7;font-size:12px;margin-top:4px}
`;
document.head.appendChild(paginationStyle);

function movieDestination(movie) {
  return movie.link || `?movie=${encodeURIComponent(movie.id)}`;
}

function renderMovieCard(movie) {
  const card = document.createElement('a');
  card.className = 'movie-card';
  card.href = movieDestination(movie);
  if (movie.link) {
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
  }
  const image = document.createElement('img');
  image.src = movie.image;
  image.alt = movie.title || 'Movie poster';
  image.loading = 'lazy';
  card.appendChild(image);
  const title = document.createElement('h3');
  title.textContent = movie.title || 'Untitled Movie';
  card.appendChild(title);
  return card;
}

function renderMoviePage() {
  if (!movieGrid) return;
  movieGrid.innerHTML = '';
  const pageCount = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const start = (currentPage - 1) * MOVIES_PER_PAGE;
  movies.slice(start, start + MOVIES_PER_PAGE).forEach(movie => movieGrid.appendChild(renderMovieCard(movie)));

  let pagination = document.getElementById('movie-pagination');
  if (!pagination) {
    pagination = document.createElement('nav');
    pagination.id = 'movie-pagination';
    pagination.className = 'movie-pagination';
    pagination.setAttribute('aria-label', 'Movie pages');
    movieGrid.insertAdjacentElement('afterend', pagination);
  }
  pagination.innerHTML = '';
  if (pageCount <= 1) return;

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = '‹ Previous';
  previous.disabled = currentPage === 1;
  previous.addEventListener('click', () => changePage(currentPage - 1));
  pagination.appendChild(previous);

  for (let page = 1; page <= pageCount; page++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(page);
    if (page === currentPage) {
      button.className = 'active';
      button.setAttribute('aria-current', 'page');
    }
    button.addEventListener('click', () => changePage(page));
    pagination.appendChild(button);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next ›';
  next.disabled = currentPage === pageCount;
  next.addEventListener('click', () => changePage(currentPage + 1));
  pagination.appendChild(next);

  const info = document.createElement('div');
  info.className = 'page-info';
  info.textContent = `Page ${currentPage} of ${pageCount} · ${movies.length} movies`;
  pagination.appendChild(info);
}

function changePage(page) {
  const pageCount = Math.ceil(movies.length / MOVIES_PER_PAGE);
  if (page < 1 || page > pageCount) return;
  currentPage = page;
  renderMoviePage();
  document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showSlide(index) {
  if (!movies.length) return;
  const slideMovies = movies.slice(0, 3);
  const total = slideMovies.length + 1; // fixed Telegram slide + latest 3 movies
  const slideIndex = ((index % total) + total) % total;
  currentMovieSlide = slideIndex;
  const telegramSlide = document.getElementById('telegram-slide');
  if (slideIndex === 0) {
    telegramSlide?.classList.add('is-active');
    heroSlide?.classList.remove('is-active');
  } else {
    telegramSlide?.classList.remove('is-active');
    heroSlide?.classList.add('is-active');
    const movie = slideMovies[slideIndex - 1];
    heroImage.src = movie.image;
    heroImage.alt = movie.title || 'Movie poster';
    heroTitle.textContent = movie.title || 'Latest Movie';
    heroSlide.href = movieDestination(movie);
    heroSlide.target = movie.link ? '_blank' : '_self';
    heroSlide.rel = movie.link ? 'noopener noreferrer' : '';
  }
  dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
}

function startSlider() {
  clearInterval(slideTimer);
  const total = Math.min(3, movies.length) + 1;
  if (movies.length) slideTimer = setInterval(() => showSlide((currentMovieSlide + 1) % total), 4500);
}

fetch('movies.json?v=' + Date.now())
  .then(response => {
    if (!response.ok) throw new Error('movies.json not found');
    return response.json();
  })
  .then(data => {
    movies = Array.isArray(data) ? data : [];
    const params = new URLSearchParams(location.search);
    const selectedId = params.get('movie');
    if (selectedId) {
      const selectedMovie = movies.find(movie => String(movie.id).toLowerCase() === selectedId.toLowerCase());
      if (selectedMovie) {
        movieGrid.innerHTML = '';
        movieGrid.appendChild(renderMovieCard(selectedMovie));
        const oldPagination = document.getElementById('movie-pagination');
        oldPagination?.remove();
      } else {
        renderMoviePage();
      }
    } else {
      renderMoviePage();
    }
    if (movies.length) {
      showSlide(0);
      startSlider();
    }
  })
  .catch(error => console.error('Movie data loading error:', error));

// Slider dots: fixed Telegram slide + up to three latest movie slides.
dots.forEach((dot, index) => dot.addEventListener('click', () => {
  showSlide(index);
  startSlider();
}));

// Advertisement zones are controlled separately through ads.js.
const adGrid = document.getElementById('ad-grid');
if (adGrid) {
  (window.MAITIHUB_ADS || [{ image: '', url: '' }, { image: '', url: '' }]).forEach(ad => {
    const slot = ad.url ? document.createElement('a') : document.createElement('div');
    slot.className = 'ad-slot';
    if (ad.url) {
      slot.href = ad.url;
      slot.target = '_blank';
      slot.rel = 'noopener noreferrer sponsored';
    }
    if (ad.image) {
      const image = document.createElement('img');
      image.src = ad.image;
      image.alt = ad.alt || 'Sponsored banner';
      slot.appendChild(image);
    }
    adGrid.appendChild(slot);
  });
}

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}
