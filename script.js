"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".main-container");
const homeBtn = document.querySelector(".home-btn");
const actorBtn = document.querySelector(".actor-btn");
const genreSection = document.querySelector(".genres");
const formBox = document.querySelector(".formBox");
const formInput = document.querySelector(".form-control");
const scrollIcon = document.querySelector(".scroll-icon");
// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();

  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

//******GENRES */
const fetchGenreMovies = async (id) => {
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&with_genres=${id}`;

  const res = await fetch(url);
  const data = await res.json();
  CONTAINER.innerHTML = "";
  renderMovies(data.results);
  return data;
};
const fetchGenreList = async () => {
  const url = constructUrl("genre/movie/list");
  const res = await fetch(url);
  const data = await res.json();
  data.genres;
  data?.genres.forEach((genre) => {
    const { id, name } = genre;
    const optionforGenres = document.createElement("option");
    optionforGenres.setAttribute("value", `${id}`);
    optionforGenres.setAttribute("class", "dropdown-item");
    optionforGenres.innerText = name;
    genreSection.append(optionforGenres);
  });
  return data;
};
fetchGenreList();
//*******GENRES */

//popularity.desc => list according to popularity

//primary_release_date.desc => get latest movies
//topRated  => top_rated
//popular => popular
//upcoming=> upcoming
//now playing=> now_playing

//******Search Actor */

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies?.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

//******Rendering ActorDetailspage */

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
     
    
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);

///*Home Btn */

homeBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";

  autorun();
});

//*******displaying movies According to their Genres */
genreSection.addEventListener("click", (e) => {
  const genreId = e.target.value;
  fetchGenreMovies(genreId);
});

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

scrollIcon.addEventListener("click", goToTop);
