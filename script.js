fetch("movies.json")
  .then(response => response.json())
  .then(banners => {

    const bannerContainer =
      document.getElementById("banner-container");

    banners.forEach(item => {

      const card = document.createElement("div");

      card.className = "banner-card";

      card.innerHTML = `
        <a href="${item.link}"
           target="_blank"
           class="banner">

          <img src="${item.image}"
               alt="${item.title}">

        </a>

        <a href="${item.link}"
           target="_blank"
           class="movie-info">

          <h2>${item.title}</h2>

          <p>${item.quality}</p>

        </a>
      `;

      bannerContainer.appendChild(card);

    });

  })
  .catch(error => {

    console.error("Movie data loading error:", error);

  });