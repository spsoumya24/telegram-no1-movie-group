const banners = [
  {
    image: "banner1.jpg",
    title: "SPIDER-MAN: BRAND NEW DAY",
    quality: "⬇ Download • 480p • 720p • 1080p • [PreDvD]",
    link: "https://linkmake.in/view/EEg6cwrI7l"
  }
];

const bannerContainer = document.getElementById("banner-container");

banners.forEach(item => {

  const card = document.createElement("div");
  card.className = "banner-card";
card.innerHTML = `
<a href="${item.link}" target="_blank" class="banner">
    <img src="${item.image}" alt="${item.title}">
</a>

<a href="${item.link}" class="movie-info" target="_blank">
    <h2>${item.title}</h2>
    <p>${item.quality}</p>
</a>
`;

  bannerContainer.appendChild(card);

});