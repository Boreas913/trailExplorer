import { allHikes, displayHikes } from "./hikeData.js";
import { getFavorites, toggleFavorite, refreshHikeFavoriteButton } from "./favorites.js";

const hikeSearchInput = document.querySelector('input[placeholder="Search For New Hikes"]');
const favoritesSearchInput = document.querySelector('input[placeholder="Search Through Your Favorites"]');
const hikeCardsContainer = document.getElementById("hikeCards");
const favoritesContainer = document.getElementById("favoriteTrails");

export function setupSearchListeners() {
  if (hikeSearchInput) {
    hikeSearchInput.addEventListener("input", filterHikes);
  }
  if (favoritesSearchInput) {
    favoritesSearchInput.addEventListener("input", filterFavorites);
  }
}

function filterHikes() {
  const searchTerm = hikeSearchInput.value.toLowerCase().trim();

  if (!searchTerm) {
    displayHikes(allHikes);
    return;
  }

  const filteredHikes = allHikes.filter((hike) =>
    hike.name.toLowerCase().includes(searchTerm) ||
    hike.location.toLowerCase().includes(searchTerm) ||
    hike.difficulty.toLowerCase().includes(searchTerm)
  );

  displayHikes(filteredHikes);
}

function filterFavorites() {
  const searchTerm = favoritesSearchInput.value.toLowerCase().trim();
  const favorites = getFavorites();

  if (!searchTerm) {
    displayFilteredFavorites(favorites);
    return;
  }

  const filteredFavorites = favorites.filter((hike) =>
    hike.name.toLowerCase().includes(searchTerm) ||
    hike.location.toLowerCase().includes(searchTerm) ||
    hike.difficulty.toLowerCase().includes(searchTerm)
  );

  displayFilteredFavorites(filteredFavorites);
}

function displayFilteredFavorites(favorites) {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      "<p>No favorite hikes found. Click the heart icon on a hike card to add it to your favorites.</p>";
    return;
  }

  favorites.forEach((hike) => {
    const card = document.createElement("section");
    card.classList.add("hike-card");

    card.innerHTML = `
      <button
        class="favorite-btn favorited"
        type="button"
        aria-label="Remove ${hike.name} from favorites"
        data-id="${hike.id}"
      >
        ♥
      </button>

      <h2>${hike.name}</h2>
      <p><strong>Location:</strong> ${hike.location}</p>
      <p>
        <strong>Distance:</strong>
        ${hike.distance} miles from Rexburg
      </p>
      <p><strong>Difficulty:</strong> ${hike.difficulty}</p>
    `;

    const favoriteButton = card.querySelector(".favorite-btn");

    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(hike);
    });

    card.addEventListener("click", () => {
      window.location.href = `trail.html?id=${hike.id}`;
    });

    favoritesContainer.appendChild(card);
  });
}

