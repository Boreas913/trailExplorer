import { SELECTORS, CONFIG } from "../constants.js";
import { refreshHikeFavoriteButton } from "./hikeData.js";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
  } catch (error) {
    console.error("Could not read favorites:", error);
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((favorite) => favorite.id === id);
}

export function toggleFavorite(hike) {
  let favorites = getFavorites();

  if (isFavorite(hike.id)) {
    favorites = favorites.filter(
      (favorite) => favorite.id !== hike.id
    );
  } else {
    favorites.push(hike);
  }

  localStorage.setItem(CONFIG.storageKey, JSON.stringify(favorites));
  displayFavorites();
}

export function displayFavorites() {
  if (!SELECTORS.favoritesContainer) {
    return;
  }

  const favorites = getFavorites();
  SELECTORS.favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    SELECTORS.favoritesContainer.innerHTML =
      "<p>No favorite hikes yet. Click the heart icon on a hike card to add it to your favorites.</p>";
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
      refreshHikeFavoriteButton(hike.id);
    });

    card.addEventListener("click", () => {
      window.location.href = `trail.html?id=${hike.id}`;
    });

    SELECTORS.favoritesContainer.appendChild(card);
  });
}
