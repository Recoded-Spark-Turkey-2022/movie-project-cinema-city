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
const aboutUsBtn = document.querySelector(".aboutUs-btn");

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

  renderMovie(movieRes, credits, related.results, trailer, images);
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
    <img src="${
      movie.backdrop_path
        ? BACKDROP_BASE_URL + movie.backdrop_path
        : "./assets/movie-poster.png"
    }" alt="${movie.title} poster" style=${
      !movie.backdrop_path ? "max-height:150px;object-fit:contain;" : null
    }>
  <div class="card-body >

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
actorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  CONTAINER.innerHTML = ``;

  const url = constructUrl(`person/popular`);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "row");
      if (data.results) {
        data.results.map((actorBlock) => {
          if (actorBlock.known_for.length > 0) {
            const actorDiv = document.createElement("div");
            actorDiv.setAttribute("class", "col-sm-12 col-md-6 col-lg-3");

            actorDiv.innerHTML = `


      <div class="card mb-4" style="height:38em;">
      <img src="${BACKDROP_BASE_URL + actorBlock.profile_path}" alt="${
              actorBlock.name
            } actor">
      <div class="card-body">
  
      <h3 class="card-title text-black">${actorBlock.name}</h3>
        <div class="mt-3 text-start">Gender: <b>${
          actorBlock.gender === 1 ? "Female" : "Male"
        }</b> </div>
        <div class="mt-3 text-start">Popularity: <b>${
          actorBlock.popularity
        }</b></div>

      </div>
    </div>`;

            actorDiv.addEventListener("click", async () => {
              const fetchedActorMovies = await fetchActorsMovies(actorBlock.id);
              CONTAINER.innerHTML = "";
              renderMovies(fetchedActorMovies.cast);
            });
            rowDiv.append(actorDiv);
            CONTAINER.appendChild(rowDiv);
          }
        });
      }
    });
});

// render related movies:
const renderRelatedMovies = (movies) => {
  movies.map((movie) => {
    const relatedDiv = document.getElementById("relatedmovies");
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "col-2 related-movie");
    movieDiv.innerHTML = `
        <img src="${
          movie.backdrop_path
            ? BACKDROP_BASE_URL + movie?.backdrop_path
            : "./assets/default image.jpg"
        }" alt="${movie.title} poster" width='150'>
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

  renderSearch(movieRes, personRes, searchWord);
};
//search event listener:
let searchWord;
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  searchWord = e.target[0].value;

  e.target[0].value = "";

  fetchSearchResults(searchWord);
});
//
const renderSearch = (movies, persons) => {
  const searchContainer = document.createElement("div");
  const searchHeader = document.createElement("h2");
  searchHeader.setAttribute("id", "search-header");
  searchHeader.innerText = "Search Result";
  searchContainer.append(searchHeader);
  searchContainer.setAttribute("id", "search-container");

  //const searchContainer = document.getElementById("search-container");
  const parentButton = document.createElement("section");
  parentButton.setAttribute("id", "parent-Button");
  // parentButton.style.cssText = ";display: flex;justify-content: space-between;";
  const next = document.createElement("button");
  next.innerText = "next";

  const pre = document.createElement("button");
  pre.innerText = "pre";

  if (i === 1) {
    pre.disabled = true;
  }
  parentButton.append(next, pre);
  searchContainer.append(parentButton);
  next.addEventListener("click", function () {
    i += 1;
    fetchSearchResults(searchWord, i);
  });
  pre.addEventListener("click", function () {
    i -= 1;
    fetchSearchResults(searchWord, i);
  });

  renderNewSearch(movies, persons, searchContainer);
};
//render search
const renderNewSearch = (movies, persons, container) => {
  // const searchContainer = document.getElementById("search-container");

  const rowDiv = document.createElement("div");
  rowDiv.setAttribute("class", "row");
  const headerPerson = document.createElement("h2");
  headerPerson.innerText = "Person Results";
  headerPerson.setAttribute("class", "person-header");
  rowDiv.append(headerPerson);
  persons.forEach((person) => {
    const resDiv = document.createElement("div");
    resDiv.setAttribute("class", "single-item col-sm-12 col-md-6 col-lg-4");
    resDiv.innerHTML = `
  <h6 class="">${person.name}</h6>
  <img src="${
    person.profile_path
      ? BACKDROP_BASE_URL + person.profile_path
      : "./assets/person-default.jpg"
  }" alt="${person.name} profile" >
     `;

    resDiv.addEventListener("click", async () => {
      const fetchedActorMovies = await fetchActorsMovies(person.id);
      CONTAINER.innerHTML = "";
      renderMovies(fetchedActorMovies.cast);
    });
    // should add link to actor profile: resDiv.addEventListener("click", () => {})
    rowDiv.append(resDiv);
    container.append(rowDiv);
    CONTAINER.append(container);
  });
  const rowDiv2 = document.createElement("div");
  const headerMovie = document.createElement("h2");
  headerMovie.innerText = "Movie Results";
  headerMovie.setAttribute("class", "movie-header");
  rowDiv2.setAttribute("class", "row");
  rowDiv2.append(headerMovie);
  movies.forEach((movie) => {
    const resDiv = document.createElement("div");
    resDiv.setAttribute("class", "single-item col-sm-12 col-md-6 col-lg-4");
    resDiv.innerHTML = `
  <h6 class="">${movie.title}</h6>
  <img src="${
    movie.backdrop_path
      ? BACKDROP_BASE_URL + movie.backdrop_path
      : "./assets/default image.jpg"
  }" alt="${movie.title} poster" >
     `;

    resDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    rowDiv2.append(resDiv);
    container.append(rowDiv2);
    CONTAINER.innerHTML = "";
    CONTAINER.append(container);
  });
};
//END search function:******//
//****filter function */
const filterSection = document.querySelector(".filter");
const filterFunc = async (e) => {
  if (e.target.value === "latest") {
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    const url = `${constructUrl(
      "discover/movie"
    )}&sort_by=primary_release_date.desc&primary_release_date.lte=${today}&page=1`;
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
const renderMovie = (movie, credits, related, trailer, images) => {
  // actors:
  const fiveAcrtors = [];

  if (credits.cast.length != 0) {
    for (let i = 0; i <= 4; i++) {
      if (credits.cast[i]) fiveAcrtors.push(` ${credits.cast[i].name}`);
    }
  }

  //directors:
  let director = credits.crew.filter((person) => {
    return person.job === "Director";
  });

  if (director.length != 0) {
    director = director[0].name;
  }

  //companies:
  const companies = movie.production_companies.map((company) => [
    company.name,
    company.logo_path,
  ]);

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-sm-12 col-lg-8">
         
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + images.backdrops[2]?.file_path
             } style="${
    images.backdrops[2]?.file_path ? "display:block" : "display:none"
  }">
      

           
        </div>
        <div  class="${
          images.backdrops[2]?.file_path
            ? "movie-detail col-sm-12  col-lg-4"
            : "movie-detail col-12"
        } ">
            

 ${
   images.logos[1]?.file_path
     ? `<img  style="${
         images.backdrops[2]?.file_path ? "display:block" : "display:none"
       }" id="movie-backdrop" class="mb-4" src=${
         BACKDROP_BASE_URL + images.logos[1]?.file_path
       }>`
     : `<h2 class="fw-bold text-capitalize  mb-3 text-uppercase">${movie.title} </h2> `
 }      
 
 

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
          <p> ${director}</p>
          <p> <b>Production companies:</b><ul id="movie-production-company"></ul></p>
        </div>
        <div class="col-12" id='trailer'>
        </div>
        <div >
            <h3>related movies:</h3>
            <div  class="row" id="relatedmovies"></div>
        </div>

      </div>`;

  companies.forEach((com) => {
    const company = document.getElementById("movie-production-company");
    let li = document.createElement("li");

    com[0] || com[1]
      ? (li.innerHTML = `${com[0]} <img  src="${PROFILE_BASE_URL}${com[1]}" alt="" height="18">`)
      : null;
    company.append(li);
  });

  renderRelatedMovies(related);
  //trailer

  const trailerSection = document.getElementById("trailer");
  let trailerKey;
  if (trailer.results.length != 0) {
    trailerSection.innerHTML = `<iframe id="ytplayer" type="text/html" width="100%" height="360"
    src="https://www.youtube.com/embed/${trailer.results[0].key}?autoplay=1"
    frameborder="0"></iframe>`;
  }
};

//****ABout Us */
function aboutUs() {
  CONTAINER.innerHTML = `
  <div class="row">
  <div class="banner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="250"
      viewBox="0 0 192.756 192.756"
      class="home-logo"
    >
      <g fill-rule="evenodd" clip-rule="evenodd">
        <path fill="transparent" d="M0 0h192.756v192.756H0V0z" />
        <path
          d="M178.125 85.164l-7.535-4.385 13.662-5.725-1.029-4.904-9.045-7.682 6.59-2.744-1.033-4.901-5.438-5.434 4.197-1.76-1.297-6.465-20.557-22.945-19.469 7.974 2.537 11.578-10.174-8.34-10.4 4.409 1.143 4.862-4.785-3.444-9.473 3.791.41 6.466-5.158-4.294-10.99 4.575 3.379 9.134-8.971-4.479c-2.564-1.092-6.981-.5-9.859 1.008-3.578 1.875-6.84 3.647-8.483 9.758l-7.629-2.875-19.692 8.252.516 7.316-10.872-3.073-20.166 8.576 12.824 62.194 43.729-.53c1.744 8.939 3.576 17.458 5.003 23.425 1.083 4.529 6.981 11.775 15.686 9.657 7.519-1.829 27.152-6.476 34.003-8.1 1.6-.194 3.262-.663 4.924-1.36 8.83-3.695 12.396-9.92 10.492-18.98l-1.254-6 4.277-.106 6.977-2.923-.734-3.519 8.529.254 6.979-2.923-1.369-6.5 13.098 1.596 6.977-2.917-2.502-11.899 1.982-25.618zm-76.918-42.601l-.133-.115.055-.021.078.136z"
        />
        <path
          d="M101.721 139.825l-13.006 5.444 2.088 10.326c.508 2.477.284 5.07-2.557 6.254-2.682 1.118-3.864-.879-4.382-3.347l-7.14-34.047c-.519-2.475-.294-5.063 2.38-6.196 2.843-1.18 4.027.812 4.551 3.291l1.747 8.343 13.081-5.479-1.391-6.64c-2.747-13.107-10.482-13.209-20.022-9.215-2.655 1.11-5.145 2.552-7.241 4.405l-11.266-53.68-18.83 7.885 3.521 45.388-.163.062-14.546-40.766-19.236 8.046 12.719 60.616 10.482-4.391-10.853-51.751.152-.07 18.421 48.591 11.509-4.818-3.294-54.917.155-.067 10.854 51.763 4.619-1.931c-.586 2.92-.581 6.292.245 10.241l5.776 27.576c2.917 13.878 11.527 14.447 20.191 10.813 11.039-4.62 15.488-12.404 13.111-23.729l-1.675-8zM98.693 99.779l8.483 40.409 8.724-3.652-8.476-40.4-8.731 3.643zM133.266 91.982l-1.289-6.128-20.911 8.752 1.284 6.125 6.095-2.547 7.194 34.277 8.724-3.652-7.201-34.275 6.104-2.552zM156.662 75.527l-8.504 3.551.16 17.41-.089.04-6.584-14.719-8.506 3.569 12.756 22.43 3.125 14.872 8.72-3.648-3.125-14.867 2.047-28.638z"
          fill="#123258"
        />
        <path
          d="M71.115 86.707c1.946 9.249 7.738 9.607 13.522 7.19 5.776-2.42 10.493-7.177 8.548-16.429l-3.859-18.383c-1.936-9.249-7.728-9.607-13.5-7.19-5.775 2.422-10.503 7.174-8.56 16.423l3.849 18.389zm6.066-28.339c1.834-.767 2.629.564 2.974 2.209l4.76 22.702c.35 1.642.198 3.373-1.645 4.145-1.834.765-2.625-.564-2.974-2.211L75.529 62.51c-.334-1.641-.184-3.374 1.652-4.142zM117.227 79.383l-2.219-43.021-8.141 3.411 2.746 32.733-.103.051-8.637-30.286-9.351 3.923 14.259 37.984 11.446-4.795zM137.324 70.973l-8.467-40.408-8.73 3.65 8.482 40.406 8.715-3.648zM164.748 59.491l-1.291-6.122-9.346 3.914-2.757-13.167 9.027-3.786-1.281-6.123-9.032 3.781-1.861-8.854 9.355-3.917-1.292-6.129-18.067 7.565 8.473 40.406 18.072-7.568z"
          fill="#123258"
        />
      </g>
    </svg>
  </div>
  <div class="welcome-message">
    <i class="ghost-icon fa-solid fa-ghost"></i>
    <h2>Welcome</h2>
    <i class="ghost-icon fa-solid fa-ghost"></i>
  </div>
  <div class="information">
      <div class="text-container">
          <p class="mt-5 fw-bold">
            This project created by Recoded Movie City Team
          </p>
          <p class="mt-1">
            Main purpose of the project is to fetch TMDB Movie API and display
            information regarding movies.
          </p>
          <p class="mt-1">
               Homepage always display trending movies, but you are not limited to display only trending ones.
          </p>
          <p class="mt-0">
          You can apply any filter method you like thanks to  dropdown menus displayed on the navbar. You can target specific genres or even you can search for specific movie  or person from search box area.
              </p>
          <p class="mt-1">Once you clicked on a movie poster, you will see details regarding the chosen movie and we also related movie section as well.</p>
          <p class="mt-1">So go on don't waste your time on reading,  It is time to explore this  generous movie library   &#128515</p>
      </div>
      <ul class="team-list">
        <li><h3>Team Cinema City</h3></li>
        <li>
            <span>Batoul Tenbakjy </span>
            <a href="linkedin.com/in/batoul-sudki-tenbakjy" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
              
             
            <a href="https://github.com/batoulst" target="_blank">          <i class="fa-brands fa-github"></i>   </a>
   
        </li>
        <li>
            <span>Mosab As</span>
            <a href="https://www.linkedin.com/in/mosab-as/?originalSubdomain=tr" target="_blank">
            <i class="fa-brands fa-linkedin"></i>
          </a></i>
            <a href="https://github.com/mosab-as" target="_blank">  <i class="fa-brands fa-github"></i> </a>
          

        </li>
        <li>
            <span>Samet Hozman</span>
            <a href="https://www.linkedin.com/in/samethozman/" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
            
            <a href="https://github.com/samethozman" target="_blank"
            >  <i class="fa-brands fa-github"></i> </a
          >
        </li>
        <li>
            <span>Halil İbrahim Çelik</span>
         
            <a href="https://www.linkedin.com/in/halil-ibrahim-celik" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
        
            <a href="https://github.com/halilibrahimcelik" target="_blank"
            >    <i class="fa-brands fa-github"></i> </a
          >


        </li>
      </ul>
  </div>
</div>`;
}

aboutUsBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";
  aboutUs();
});
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
