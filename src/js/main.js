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

// Modal functions
export function openPlanModal(trailName) {
  const modal = document.getElementById('hikeModal');
  const trailInput = document.getElementById('modalTrailSelect');
  const form = document.getElementById('planHikeForm');
  const confirmation = document.getElementById('modalConfirmation');

  // Reset modal views
  form.classList.remove('hidden');
  confirmation.classList.add('hidden');
  form.reset();

  // Clear error messages
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  if (nameError) nameError.textContent = '';
  if (emailError) emailError.textContent = '';

  // Populate read-only trail name
  trailInput.value = trailName;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('hikeModal').classList.add('hidden');
}

// Initialize Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');
  const planHikeForm = document.getElementById('planHikeForm');
  const modal = document.getElementById('hikeModal');

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking overlay
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Escape key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (planHikeForm) {
    planHikeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const trail = document.getElementById('modalTrailSelect').value;
      const notes = document.getElementById('userNotes').value.trim() || "No additional notes";

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;
      const nameError = document.getElementById('nameError') || createErrorElement('nameError');
      const emailError = document.getElementById('emailError') || createErrorElement('emailError');

      // Validate Name
      if (!name) {
        nameError.textContent = 'Name is required.';
        isValid = false;
      } else {
        nameError.textContent = '';
      }

      // Validate Email
      if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      if (!isValid) return;

      // Populate confirmation details view
      const detailsBox = document.getElementById('confirmationDetails');
      detailsBox.innerHTML = `
        <strong>Trail:</strong> ${escapeHtml(trail)}<br>
        <strong>Hiker:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}<br>
        <strong>Notes:</strong> "${escapeHtml(notes)}"
      `;

      // Toggle form / confirmation windows
      document.getElementById('planHikeForm').classList.add('hidden');
      document.getElementById('modalConfirmation').classList.remove('hidden');
    });
  }
});

function createErrorElement(id) {
  const elem = document.createElement('span');
  elem.id = id;
  elem.className = 'error-message';
  const formGroup = document.querySelector(`[for="${id.replace('Error', '')}"]`)?.closest('.form-group');
  if (formGroup) formGroup.appendChild(elem);
  return elem;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener("DOMContentLoaded", loadHikes);