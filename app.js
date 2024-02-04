//select the element that the games will be displayed
const gameListEl = document.querySelector(".games-list");

//function that gets the game data
const getGames = async (filter = "", platforms = "", searchQuery = "") => {
  toggleLoading(true);
  try {
    let url =
      "https://api.rawg.io/api/games?key=c5a7f5669591401a9bc5b256edd49d68";

    // append ordering filter to the URL
    if (filter) {
      url += `&ordering=${filter}`;
    }

    // Append parent platforms filter to the URL
    if (platforms) {
      url += `&parent_platforms=${platforms}`;
    }
    // Append search query to the URL
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    //fetch game data from API
    const response = await fetch(url);
    const gamesData = await response.json();
    displayGames(gamesData.results); // display fetched games
    } catch (error) {
  console.error("Failed to fetch games: ", error);
  }
};

// display games on the page.
function displayGames(games) {
  gameListEl.innerHTML = ""; // Clear existing games.
  games.forEach((game) => {
    const gameEl = document.createElement("div");
    gameEl.className = "game";
    gameEl.innerHTML = gameHtml(game);
    gameListEl.appendChild(gameEl);
  });
  toggleLoading(false); 
}


// function that generate HTML for a game
function gameHtml(game) {
  return `
      <div class="game__card">
      <figure class="game__img--wrapper">
        <img class="game__img" src="${checkImage(game.background_image) }" alt="${
      game.name
    }" />
      </figure>
      <div class="game__content">
      <div class="games__overlay not__allowed">
      <p class="games__overlay--text">More Info→</>
      </div>
        <div class="game__content--top">
          <div class="game__content--platform">
            ${game.parent_platforms
              .map(
                (platform) =>
                  `<i class="game__platform fab fa-${getPlatformImage(
                    platform.platform.slug
                  )}"></i>`
              )
              .join("")}
          </div>
          <p class="rating ${getRatingClass(game.metacritic)}">${game.metacritic ? game.metacritic : "N/A"}</p>
        </div>
        <h3 class="game__content--name">${game.name}</h3>
        <p class="game__content--release-date">Release date: ${game.released}</p>
        <p class="game__content--genre">Genre: ${game.genres
          .map((genre) => genre.name)
          .join(", ")}</p>
      </div>
      </div>
    `;
  
}

//filter games based on selection
function filterGames(event) {
  const filterValue = event.target.value;
  const platformValue = document.getElementById("platformFilter").value;
  const searchValue = document.getElementById("gameSearch").value;
  if(searchValue === "") {
    document.querySelector(".games__header--title span.purple").textContent = "";
  }

  getGames(filterValue, platformValue, searchValue); 
}

//filter games based on platform selection
function filterPlatforms(event) {
  const platformValue = event.target.value;
  const filterValue = document.getElementById("gameFilter").value; 
  const searchValue = document.getElementById("gameSearch").value;
  if(searchValue === "") {
    document.querySelector(".games__header--title span.purple").textContent = "";
  }
  getGames(filterValue, platformValue, searchValue); 
}

//handles enter key press in searching games
function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchGames();
  }
}

//searches games based on the query entered
function searchGames() {
  const query = document.getElementById("gameSearch").value;
  document.querySelector(".games__header--title span.purple").textContent = query;
  document.getElementById("gameFilter").value = "";
  document.getElementById("platformFilter").value = "";
  getGames("", "", query);
}

// returns the icon for the specific icon
function getPlatformImage(platformName) {
  if (platformName.includes("nintendo")) {
    return "neos";
  } else if (platformName.includes("xbox")) {
    return "xbox";
  } else if (platformName.includes("playstation")) {
    return "playstation";
  } else if (platformName.includes("pc")) {
    return "windows";
  } else if (platformName.includes("mac")) {
    return "apple";
  } else if (platformName.includes("linux")) {
    return "linux";
  }
  return;
}
// determines the class and color for game rating based on its value
function getRatingClass(rating) {
  if (rating > 69) {
    return 'rating-green';
  } else if (rating > 49) {
    return 'rating-yellow';
  } else if (rating <= 49 && rating !== null) {
    return 'rating-red';
  }
  return '';
}
getGames();

//check if image exist
function checkImage(image) {
  return image || "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg";
}

//show or hides the loading indicator
function toggleLoading(isLoading) {
  if (isLoading) {
    gameListEl.classList.add("games__loading");
  } else {
    gameListEl.classList.remove("games__loading");
  }
}

//intial fetch of games on window load
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');
  document.querySelector(".games__header--title span.purple").textContent = searchQuery;
  if (searchQuery) {
    getGames("", "", searchQuery);
  }
};
