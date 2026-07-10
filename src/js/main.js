const cardsContainer = document.querySelector("#hikeCards");

const modal = document.querySelector("#hikeModal");
const closeModalButton = document.querySelector("#closeModal");

const modalImage = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName");
const modalLocation = document.querySelector("#modalLocation");
const modalDistance = document.querySelector("#modalDistance");
const modalDifficulty = document.querySelector("#modalDifficulty");
const modalDescription = document.querySelector("#modalDescription");

async function loadHikes() {
    try {
        const response = await fetch("src/data/trails.json");

        if (!response.ok) {
            throw new Error(
                `Could not load hikes. Status: ${response.status}`
            );
        }

        const hikes = await response.json();

        displayHikes(hikes);
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
            openModal(hike);
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

function openModal(hike) {
    if (!modal) {
        console.error('Could not find an element with id="hikeModal".');
        return;
    }

    modalImage.src = hike.image;
    modalImage.alt = hike.name;

    modalName.textContent = hike.name;
    modalLocation.textContent = `Location: ${hike.location}`;
    modalDistance.textContent = `Trail Length: ${hike.length}`;
    modalDifficulty.textContent = `Difficulty: ${hike.difficulty}`;
    modalDescription.textContent = hike.description;

    modal.classList.remove("hidden");
}

function closeHikeModal() {
    modal.classList.add("hidden");
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
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeHikeModal);
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeHikeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeHikeModal();
    }
});

loadHikes();