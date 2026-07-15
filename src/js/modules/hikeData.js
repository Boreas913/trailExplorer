import { SELECTORS, CONFIG } from "../constants.js";
import { toggleFavorite, isFavorite } from "./favorites.js";

export let allHikes = [];

export async function loadHikes() {
  try {
    const response = await fetch(CONFIG.dataPath);

    if (!response.ok) {
      throw new Error(
        `Could not load hikes. Status: ${response.status}`
      );
    }

    const hikes = await response.json();
    allHikes = hikes;

    displayHikes(hikes);
  } catch (error) {
    console.error("Error loading hikes:", error);

    if (SELECTORS.cardsContainer) {
      SELECTORS.cardsContainer.innerHTML =
        "<p>Unable to load hikes. Check the JSON file path.</p>";
    }
  }
}

export function displayHikes(hikes) {
  if (!SELECTORS.cardsContainer) {
    console.error('Could not find an element with id="hikeCards".');
    return;
  }

  SELECTORS.cardsContainer.innerHTML = "";

  hikes.forEach((hike) => {
    const card = document.createElement("section");
    card.classList.add("hike-card");

    card.innerHTML = `
      <button
        class="favorite-btn"
        type="button"
        aria-label="Add ${hike.name} to favorites"
        data-id="${hike.id}"
      >
        ♡
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

    updateFavoriteButton(favoriteButton, hike);

    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(hike);
      updateFavoriteButton(favoriteButton, hike);
    });

    card.addEventListener("click", () => {
      window.location.href = `trail.html?id=${hike.id}`;
    });

    SELECTORS.cardsContainer.appendChild(card);
  });
}

export function updateFavoriteButton(button, hike) {
  const favorited = isFavorite(hike.id);

  button.textContent = favorited ? "♥" : "♡";
  button.classList.toggle("favorited", favorited);

  button.setAttribute(
    "aria-label",
    favorited
      ? `Remove ${hike.name} from favorites`
      : `Add ${hike.name} to favorites`
  );
}

export function refreshHikeFavoriteButton(hikeId) {
  const hike = allHikes.find((item) => item.id === hikeId);
  const button = document.querySelector(
    `#hikeCards .favorite-btn[data-id="${hikeId}"]`
  );

  if (button && hike) {
    updateFavoriteButton(button, hike);
  }
}
