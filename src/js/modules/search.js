import { allHikes, displayHikes } from "./hikeData.js";
import { getFavorites, toggleFavorite } from "./favorites.js";

export function setupSearchListeners() {
  const hikeSearchInput = document.querySelector('input[placeholder="Search For New Hikes"]');
  const favoritesSearchInput = document.querySelector('input[placeholder="Search Through Your Favorites"]');
  const hikeCardsContainer = document.getElementById("hikeCards");
  const favoritesContainer = document.getElementById("favoriteTrails");

  // Get the forms and prevent their submission
  const hikeForms = document.querySelectorAll("form");
  
  hikeForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });

  // Setup hike search
  if (hikeSearchInput) {
    hikeSearchInput.addEventListener("input", () => filterHikes(hikeSearchInput, hikeCardsContainer));
  }

  // Setup favorites search
  if (favoritesSearchInput) {
    favoritesSearchInput.addEventListener("input", () => filterFavorites(favoritesSearchInput, favoritesContainer));
  }
}

function filterHikes(searchInput, container) {
  const searchTerm = searchInput.value.toLowerCase().trim();

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

function filterFavorites(searchInput, container) {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const favorites = getFavorites();

  if (!searchTerm) {
    displayFilteredFavorites(favorites, container);
    return;
  }

  const filteredFavorites = favorites.filter((hike) =>
    hike.name.toLowerCase().includes(searchTerm) ||
    hike.location.toLowerCase().includes(searchTerm) ||
    hike.difficulty.toLowerCase().includes(searchTerm)
  );

  displayFilteredFavorites(filteredFavorites, container);
}

function displayFilteredFavorites(favorites, container) {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML =
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

    container.appendChild(card);
  });
}


