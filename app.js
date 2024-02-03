const gameListEl = document.querySelector(".games-list");

const getGames = async (filter = "", platforms = "", searchQuery = "") => {
  gameListEl.classList += " games__loading";
  try {
    let url =
      "https://api.rawg.io/api/games?key=c5a7f5669591401a9bc5b256edd49d68";

    // Add ordering filter to the URL
    if (filter) {
      url += `&ordering=${filter}`;
    }

    // Add parent platforms filter to the URL
    if (platforms) {
      url += `&parent_platforms=${platforms}`;
    }

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url);
    const gamesData = await response.json();

    // Clear existing games before appending new ones
    gameListEl.innerHTML = "";

    // Process and display each game
    gamesData.results.forEach((game) => {
      const gameEl = document.createElement("div");
      gameEl.className = "game";
      gameEl.innerHTML = `
        <figure class="game__img--wrapper">
          <img class="game__img" src="${game.background_image}" alt="${
        game.name
      }" />
        </figure>
        <div class="game__content">
          <div class="game__content--top">
            <div class="game__content--platform">
              ${game.parent_platforms
                .map(
                  (platform) =>
                    `<i class="fab fa-${getPlatformImage(
                      platform.platform.slug
                    )}"></i>`
                )
                .join("")}
            </div>
            <p class="rating">${game.metacritic ? game.metacritic : "N/A"}</p>
          </div>
          <h3 class="game__content--name">${game.name}</h3>
          <p class="game__content--release-date">${game.released}</p>
          <p class="game__content--genre">${game.genres
            .map((genre) => genre.name)
            .join(", ")}</p>
        </div>
      `;
      gameListEl.appendChild(gameEl);
    });
  } catch (error) {
    console.error("Failed to fetch games: ", error);
  }
};

function filterGames(event) {
  const filterValue = event.target.value;
  getGames(filterValue);
}

function filterPlatforms(event) {
  const platformValue = event.target.value;
  getGames("", platformValue);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchGames();
  }
}

function searchGames() {
  const query = document.getElementById("gameSearch").value;
  getGames("", "", query);
}

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
getGames();
