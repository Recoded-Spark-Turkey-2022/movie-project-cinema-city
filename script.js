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
  const credits = await fetchActors(movie.id);
  const related = await fetchRelatedMovies(movie.id);
  const trailer = await fetchTrailer(movie.id);
  const images = await fetchImages(movie.id);
  renderMovie(
    movieRes,
    credits,
    related.results,
    trailer.results[0].key,
    images
  );
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
// fetch related movies
const fetchRelatedMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};
//fetch the actors :
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};
//fetch trailer:
const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};
const fetchImages = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/images`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  const rowDiv = document.createElement("div");
  rowDiv.setAttribute("class", "row");
  movies?.map((movie) => {
    const mainPageDiv = document.createElement("div");

    mainPageDiv.setAttribute("class", "col-sm-12 col-md-6 col-lg-3");
    mainPageDiv.innerHTML = `
    <div class="card mb-4" style="height:28em;">
    <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
  <div class="card-body">

  <h3 class="card-title text-black">${movie.title}</h3>
     <div class="truncate-text"> <p class="card-text">${
       movie.overview
     }</p></div>
     <div class="mt-3 text-end">Rating: <b>${movie.vote_average}</b> /10</div>
  </div>
</div>`;
    mainPageDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    rowDiv.append(mainPageDiv);
    CONTAINER.appendChild(rowDiv);
  });
};

// fetch actors movies
const fetchActorsMovies = async (person_id) => {
  const url = constructUrl(`person/${person_id}/movie_credits`);
  const res = await fetch(url);
  return res.json();
};


//******Rendering ActorDetailspage */
actorBtn.addEventListener('click',(e)=>{
  e.preventDefault()
  CONTAINER.innerHTML = ``;
  
  const url = constructUrl(`person/popular`);
  fetch(url)
  .then(res =>res.json())
  .then(data => {
  const rowDiv = document.createElement("div");
  rowDiv.setAttribute("class", "row");
  // console.log(actorsList)
  if(data.results)
  {
    data.results.map((actorBlock) => {
      const actorDiv = document.createElement("div");
      actorDiv.setAttribute("class", "col-sm-12 col-md-6 col-lg-3")

      actorDiv.innerHTML = `
      <div class="card mb-4" style="height:38em;">
      <img src="${BACKDROP_BASE_URL + actorBlock.profile_path}" alt="${
        actorBlock.name
      } actor">
      <div class="card-body">
  
      <h3 class="card-title text-black">${actorBlock.name}</h3>
        <div class="mt-3 text-start">Gender: <b>${(actorBlock.gender === 1) ? "Female":"Male"}</b> </div>
        <div class="mt-3 text-start">Popularity: <b>${actorBlock.popularity}</b></div>

      </div>
    </div>`;
      actorDiv.addEventListener("click", async() => {
          const fetchedActorMovies = await fetchActorsMovies(actorBlock.id)
          CONTAINER.innerHTML= ""
           renderMovies( fetchedActorMovies.cast ) ;
      });
      rowDiv.append(actorDiv);
      CONTAINER.appendChild(rowDiv);
  
    })
  }
})

})

// render related movies:
const renderRelatedMovies = (movies) => {
  movies.map((movie) => {
    const relatedDiv = document.getElementById("relatedmovies");
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "col");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster" width='150'>
        <h6>${movie.title}</h6>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    relatedDiv.appendChild(movieDiv);
  });
};

//******search function:******//
let i = 1;
const fetchSearchResults = async (searchWord, i) => {
  const url = `${constructUrl(`search/multi`)}&query=${searchWord}&page=${i}`;
  const res = await fetch(url);
  const searchRes = await res.json();
  const movieRes = searchRes.results.filter((e) => e.media_type === "movie");
  const personRes = searchRes.results.filter((e) => e.media_type === "person");
  renderSearch(movieRes, personRes,searchWord);
};
//search event listener:
let searchWord;
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  searchWord = e.target[0].value;
  e.target[0].value='';
  fetchSearchResults(searchWord);
});
//

const renderSearch = (movies, persons,searchWord) => {
  CONTAINER.innerHTML = `
<div class='row' id='search-container'>
<h2> Results for: ${searchWord}</h2>`;
  const searchContainer = document.getElementById("search-container");

  const next = document.createElement("button");
  next.innerText = "next";

  const pre = document.createElement("button");
  pre.innerText = "pre";

  if (i === 1) {
    pre.disabled = true;
  }
  searchContainer.append(next, pre);
  next.addEventListener("click", function () {
    i += 1;
    fetchSearchResults(searchWord, i);
  });
  pre.addEventListener("click", function () {
    i -= 1;
    fetchSearchResults(searchWord, i);
  });

  renderNewSearch(movies, persons);
};
//render search
const renderNewSearch = (movies, persons) => {
  const searchContainer = document.getElementById("search-container");
  persons.forEach((person) => {
    const resDiv = document.createElement("div");
    resDiv.setAttribute("class", "col-md-6");
    resDiv.innerHTML = `
  <h6 class="">${person.name}</h6>
  <img src="${BACKDROP_BASE_URL + person.profile_path}" alt="${
      person.name
    } profile" width='150'>
     `;
    // should add link to actor profile: resDiv.addEventListener("click", () => {})
    searchContainer.append(resDiv);
  });
  movies.forEach((movie) => {
    const resDiv = document.createElement("div");
    resDiv.setAttribute("class", "col-md-6");
    resDiv.innerHTML = `
  <h6 class="">${movie.title}</h6>
  <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster" width='150'>
     `;
    resDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    searchContainer.append(resDiv);
  });
};
//END search function:******//
//****filter function */
const filterSection = document.querySelector(".filter");
const filterFunc = async (e) => {
  if (e.target.value === "latest") {
    const url = `${constructUrl(
      "discover/movie"
    )}&sort_by=primary_release_date.desc&primary_release_year=2022`;

    const res = await fetch(url);
    const movies = await res.json();  
    CONTAINER.innerHTML = "";
    renderMovies(movies.results);
    return;
  }
  const url = constructUrl(`movie/${e.target.value}`);
  const res = await fetch(url);
  const movies = await res.json();
  CONTAINER.innerHTML = "";
  renderMovies(movies.results);
};
filterSection.addEventListener("click", filterFunc);

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, related, trailerKey, images) => {
  // actors:

  const fiveAcrtors = [];
  for (let i = 0; i <= 4; i++) {
    fiveAcrtors.push(` ${credits.cast[i].name}`);
  }
  //directors:
  const director = credits.crew.filter((person) => {
    return person.job === "Director";
  });
  //companies:
  const companies = movie.production_companies.map((company) => [
    company.name,
    company.logo_path,
  ]);

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-sm-12 col-lg-8">
         
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + images.backdrops[2].file_path
             }>
      

           
        </div>
        <div  class="movie-detail col-sm-12  col-lg-4">
            
        <img id="movie-backdrop" class="mb-4" src=${
          BACKDROP_BASE_URL + images.logos[0]?.file_path
        }>
<div>
<p  id="movie-release-date"><i class="fa-solid fa-calendar-days"></i> ${
    movie.release_date
  }  <span class="popUp-info">Release Date</span></p>

<p id="movie-runtime"><i class="fa-solid fa-clock"></i> ${
    movie.runtime
  } Minutes 
<span class="popUp-info">Run Time</span>
</p>
<p id="movie-language"><i class="fa-solid fa-language"></i>${movie.spoken_languages.map(
    (singleLanguge) => ` ${singleLanguge.english_name}`
  )}
<span class="popUp-info">Languages</span>
</p>

<p id="movie-rating"> <i class="fa-solid fa-star"></i> ${
    movie.vote_average
  }/10  <span class="popUp-info">Rating</span> </p>
<p id="movie-count"> <i class="fa-solid fa-person-booth"></i> ${
    movie.vote_count
  } 
<span class="popUp-info">Number of Votes</span>
</p>
</div>
           

  <a id="imdb-icon" href="https://www.imdb.com/title/${
    movie.imdb_id
  }"  target="_blank"> <i class="fa-brands fa-imdb"></i>
          
            </a>
            
            
        </div>
        <div class="col-12 mt-4">
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>
        <h5>Actors:</h5>
        <ul id="actors" class="list-unstyled">
          <p> ${fiveAcrtors}</p>
        </ul>
        <h5>Director:</h5>
          <p> ${director[0].name}</p>
          <p> <b>Production companies:</b><ul id="movie-production-company"></ul></p>
        </div>
        <div class="col-12" id='trailer'>
            <iframe id="ytplayer" type="text/html" width="100%" height="360"
            src="https://www.youtube.com/embed/${trailerKey}?autoplay=1"
            frameborder="0"></iframe>
        </div>
        <div >
            <h3>related movies:</h3>
            <div  class="row" id="relatedmovies"></div>
        </div>

      </div>`;

  companies.forEach((com) => {
    const company = document.getElementById("movie-production-company");
    let li = document.createElement("li");
    li.innerHTML = `${com[0]} <img  src="${PROFILE_BASE_URL}${com[1]}" alt="" height="18">`;
    company.append(li);
  });

  renderRelatedMovies(related);
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

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollIcon.classList.add("active");
  } else {
    scrollIcon.classList.add("active");
  }
});
const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

scrollIcon.addEventListener("click", goToTop);
