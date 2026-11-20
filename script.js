// movies.json is the single source for Featured Movies, Latest Updates and the 3 rotating movie slides.
const movieGrid = document.getElementById('movie-grid');
const heroSlide = document.getElementById('movie-slide');
const heroImage = document.getElementById('hero-movie-image');
const heroTitle = document.getElementById('hero-movie-title');
const dots = [...document.querySelectorAll('#slider-dots button')];
let movies = [];
let currentMovieSlide = 0;
let slideTimer;

function movieDestination(movie) { return movie.link || `?movie=${encodeURIComponent(movie.id)}`; }
function renderMovieCard(movie) {
  const card = document.createElement('a'); card.className = 'movie-card'; card.href = movieDestination(movie);
  if (movie.link) { card.target = '_blank'; card.rel = 'noopener noreferrer'; }
  const image = document.createElement('img'); image.src = movie.image; image.alt = movie.title || 'Movie poster'; image.loading = 'lazy'; card.appendChild(image);
  const title = document.createElement('h3'); title.textContent = movie.title || 'Untitled Movie'; card.appendChild(title); return card;
}
function showSlide(index) {
  if (!movies.length) return;
  const total = Math.min(3, movies.length) + 1; // fixed Telegram slide + up to 3 movie slides
  const slideIndex = ((index % total) + total) % total;
  currentMovieSlide = slideIndex;
  const telegramSlide = document.getElementById('telegram-slide');
  if (slideIndex === 0) {
    telegramSlide.classList.add('is-active');
    heroSlide.classList.remove('is-active');
  } else {
    telegramSlide.classList.remove('is-active');
    heroSlide.classList.add('is-active');
    const movie = movies[slideIndex - 1];
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
fetch('movies.json?v=' + Date.now()).then(r => { if (!r.ok) throw new Error('movies.json not found'); return r.json(); }).then(data => {
  movies = Array.isArray(data) ? data : [];
  const params = new URLSearchParams(location.search); const selected = params.get('movie');
  const visible = selected ? movies.filter(m => String(m.id).toLowerCase() === selected.toLowerCase()) : movies;
  visible.forEach(movie => movieGrid.appendChild(renderMovieCard(movie)));
  if (movies.length) { showSlide(0); startSlider(); }
}).catch(err => console.error('Movie data loading error:', err));

// Four-slide rotation: fixed Telegram promotion, followed by the latest three movies.
dots.forEach((dot, i) => dot.addEventListener('click', () => {
  showSlide(i);
  startSlider();
}));

const adGrid = document.getElementById('ad-grid');
(window.MAITIHUB_ADS || [{image:'',url:''},{image:'',url:''}]).forEach((ad, i) => {
  const slot = ad.url ? document.createElement('a') : document.createElement('div'); slot.className = 'ad-slot';
  if (ad.url) { slot.href=ad.url; slot.target='_blank'; slot.rel='noopener noreferrer sponsored'; }
  if (ad.image) { const img=document.createElement('img'); img.src=ad.image; img.alt=ad.alt || 'Sponsored banner'; slot.appendChild(img); }
  adGrid.appendChild(slot);
});
document.getElementById('year').textContent = new Date().getFullYear();
const toggle=document.querySelector('.menu-toggle'), nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
