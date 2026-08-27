fetch("https://raw.githubusercontent.com/spsoumya24/telegram-no1-movie-group/refs/heads/main/movies.json?v=" + Date.now())
  .then(response => response.json())
  .then(banners => {

    const bannerContainer =
      document.getElementById("banner-container");

    // URL থেকে movie ID নেওয়া
    const params = new URLSearchParams(window.location.search);
    const selectedMovie = params.get("movie");

    // যদি ?movie= থাকে, শুধু সেই movie দেখাবে
    if (selectedMovie) {
      banners = banners.filter(item =>
        item.id === selectedMovie.toLowerCase()
      );
    }

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
