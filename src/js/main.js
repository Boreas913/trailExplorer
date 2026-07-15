const cardsContainer = document.querySelector("#hikeCards");
const favoritesContainer = document.querySelector("#favoriteTrails");

let allHikes = [];

async function loadHikes() {
    try {
        const response = await fetch("/data/trails.json");

        if (!response.ok) {
            throw new Error(
                `Could not load hikes. Status: ${response.status}`
            );
        }

        const hikes = await response.json();
        allHikes = hikes;

        displayHikes(hikes);
        displayFavorites();
    } catch (error) {
        console.error("Error loading hikes:", error);

        if (cardsContainer) {
            cardsContainer.innerHTML =
                "<p>Unable to load hikes. Check the JSON file path.</p>";
        }
    }
}

function displayHikes(hikes) {
    if (!cardsContainer) {
        console.error('Could not find an element with id="hikeCards".');
        return;
    }

    cardsContainer.innerHTML = "";

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

        cardsContainer.appendChild(card);
    });
}

function updateFavoriteButton(button, hike) {
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

function refreshHikeFavoriteButton(hikeId) {
    const hike = allHikes.find((item) => item.id === hikeId);
    const button = document.querySelector(
        `#hikeCards .favorite-btn[data-id="${hikeId}"]`
    );

    if (button && hike) {
        updateFavoriteButton(button, hike);
    }
}

function displayFavorites() {
    if (!favoritesContainer) {
        return;
    }

    const favorites = getFavorites();
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML =
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

        favoritesContainer.appendChild(card);
    });
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch (error) {
        console.error("Could not read favorites:", error);
        return [];
    }
}

function isFavorite(id) {
    return getFavorites().some((favorite) => favorite.id === id);
}

function toggleFavorite(hike) {
    let favorites = getFavorites();

    if (isFavorite(hike.id)) {
        favorites = favorites.filter(
            (favorite) => favorite.id !== hike.id
        );
    } else {
        favorites.push(hike);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

document.addEventListener("DOMContentLoaded", loadHikes);