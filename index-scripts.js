import { options } from "./options.js";

let currentPage = 1;

// Obtener una plantilla para los elementos peliculas en la sección Trending Movies
const trendingMovieTemplate = document
  .querySelector(".trending__container")
  .querySelector(".movie-card");
trendingMovieTemplate.remove();

/** Cuando se complete el fetching de peliculas populares desde TMDB cargar la seccion Trending Movies */
const onPopularMoviesFetched = (response) => {
  const movies = response.results;
  const trendingMovieContainer = document.querySelector(".trending__container");
  trendingMovieContainer.querySelectorAll(".movie-card").forEach((el) => {
    el.remove();
  });

  movies.forEach((movie) => {
    const movieCard = trendingMovieTemplate.cloneNode(true);

    const image = movieCard.querySelector(".movie-card__image");
    image.src = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`;

    const title = movieCard.querySelector(".movie-card__title");
    title.textContent = movie.title;

    const link = movieCard.querySelector(".movie-card__link");
    link.href = `./detalles.html?id=${movie.id}`;

    trendingMovieContainer.append(movieCard);
  });
};

/** Cuando se complete el fetching de peliculas mas valoradas desde TMDB cargar la seccion Top Rated Movies */
const onTopRatedMoviesFetched = (response) => {
  const movies = response.results;
  const topMoviesContainer = document.querySelector(".top-movies__container");
  const topMoviesCard = topMoviesContainer.querySelector(
    ".top-movies__movie-card"
  );

  movies.forEach((movie) => {
    const movieCard = topMoviesCard.cloneNode(true);

    const image = movieCard.querySelector(".movie-card__image");
    image.src = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`;

    const title = movieCard.querySelector(".movie-card__title");
    title.textContent = movie.title;

    const link = movieCard.querySelector(".movie-card__link");
    link.href = `./detalles.html?id=${movie.id}`;

    topMoviesContainer.append(movieCard);
  });

  topMoviesCard.remove();
};

/** Hacer un fetch de peliculas populares */
const fetchPopularMovies = (page) => {
  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=es-AR&page=${page}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      onPopularMoviesFetched(response);
    })
    .catch((err) => console.error(err));
};

const fetchTopRatedMovies = (page) => {
  const baseUrl = `https://api.themoviedb.org/3/movie/top_rated?language=es-AR&page=`;
  fetch(`${baseUrl}${page}`, options)
    .then((response) => response.json())
    .then((response) => {
      onTopRatedMoviesFetched(response);
    })
    .catch((err) => console.error(err));
};

addEventListener("load", onload);
onload = () => {
  fetchPopularMovies(1);
  fetchTopRatedMovies(1, onTopRatedMoviesFetched);
};

const buttonPrevious = document.querySelector("#trending-button-previous");
buttonPrevious.style.display = "none";
buttonPrevious.addEventListener("click", () => {
  currentPage -= 1;
  if (currentPage <= 1) buttonPrevious.style.display = "none";
  fetchPopularMovies(currentPage);
});

const buttonNext = document.querySelector("#trending-button-next");
buttonNext.addEventListener("click", () => {
  currentPage += 1;
  console.log(`fetching page ${currentPage}`);
  if (currentPage > 1) buttonPrevious.style.display = "block";
  fetchPopularMovies(currentPage);
});
