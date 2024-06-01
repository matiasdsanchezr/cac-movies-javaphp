import { options } from "./options.js";

const queries = Object.fromEntries(
  location.search
    .substring(1)
    .split("&")
    .map((item) => [item.split("=")[0], item.split("=")[1]])
);

const onMovieDetailsLoaded = (response) => {
  const genres = response.genres.map((genre) => genre.name).join(", ");
  const releaseDate = new Date(response.release_date);
  const hours = Math.floor(response.runtime / 60);
  const minutes = response.runtime % 60;

  const container = document.querySelector(".movie-detail");
  container.style.backgroundImage = `linear-gradient(to right top, #6d6969a7, #6d6969a7),
  url(https://image.tmdb.org/t/p/original${response.backdrop_path})`;

  const image = document.querySelector(".movie-detail__image");
  image.src = `https://image.tmdb.org/t/p/w500${response.poster_path}`;

  const title = document.querySelector(".movie-detail__title");
  title.textContent = `${response.title} (${releaseDate.getFullYear()})`;

  const details = document.querySelector(".movie-detail__details");
  details.textContent = `${releaseDate.toLocaleDateString()} • ${genres} • ${hours}h ${minutes}m`;

  const overview = document.querySelector(".movie-detail__overview");
  overview.textContent = response.overview;

  const credits = document.querySelector(".movie-detail__credits-container");
  credits.innerHTML = response.production_companies
    .map(
      (el) => `
      <div>
        <h3>${el.name}</h3>
        <p>${el.origin_country}</p>
      </div>`
    )
    .join("");

  const status = document.querySelector("#status");
  status.textContent =
    response.status == "Released" ? "Estrenada" : "En producción";

  const originalLanguage = document.querySelector("#original_language");
  let languageNames = new Intl.DisplayNames(["es"], { type: "language" });
  originalLanguage.textContent = languageNames.of(response.original_language);

  const budget = document.querySelector("#budget");
  budget.textContent =
    response.budget != 0
      ? response.budget.toLocaleString("es-AR", {
          style: "currency",
          currency: "USD",
        })
      : "Sin información";

  const revenue = document.querySelector("#revenue");
  revenue.textContent =
    response.budget != 0
      ? response.revenue.toLocaleString("es-AR", {
          style: "currency",
          currency: "USD",
        })
      : "Sin información";
};

const onMovieVideosLoaded = (response) => {
  const video = document.querySelector(".movie-trailer__iframe");
  video.src = `https://www.youtube.com/embed/${response.results[0].key}`;
};

const fetchMovieDetails = (id) => {
  fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-AR`, options)
    .then((response) => response.json())
    .then((response) => onMovieDetailsLoaded(response))
    .catch((err) => console.error(err));
};

const fetchEnglishMovieVideos = (id) => {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => onMovieVideosLoaded(response))
    .catch((err) => console.error(err));
};

const fetchSpanishMovieVideos = (id) => {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?language=es-AR`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.results.length > 0) onMovieVideosLoaded(response);
      else fetchEnglishMovieVideos(queries.id);
    })
    .catch((err) => console.error(err));
};

addEventListener("load", onload);
onload = () => {
  fetchMovieDetails(queries.id);
  fetchSpanishMovieVideos(queries.id);
};
