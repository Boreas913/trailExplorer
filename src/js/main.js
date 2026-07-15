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

// src/js/main.js (or trail.js)
import { renderModalTrailPreview } from './render.js';

// Elements
const modal = document.getElementById('hikeModal');
const planForm = document.getElementById('planHikeForm');
const formContainer = document.getElementById('formContainer');
const formConfirmation = document.getElementById('formConfirmation');
const confirmationText = document.getElementById('confirmationText');
const confirmedTrailDetails = document.getElementById('confirmedTrailDetails');

// 1. OPEN MODAL FUNCTION
export function openPlanHikeModal(trail) {
  if (!modal) return;
  
  // Reset form and UI state
  planForm.reset();
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  formContainer.classList.remove('hidden');
  formConfirmation.classList.add('hidden');

  // Populate hidden field and preview
  document.getElementById('selectedTrailId').value = trail.id;
  renderModalTrailPreview(trail, 'selectedTrailPreview');

  // Show Modal
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

// 2. CLOSE MODAL FUNCTION
function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

// Event Listeners for Closing
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('closeConfirmBtn')?.addEventListener('click', closeModal);
document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

// Escape key to close modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 3. FORM VALIDATION AND SUBMISSION
planForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('hikeName');
  const emailInput = document.getElementById('hikeEmail');
  const notesInput = document.getElementById('hikeNotes');
  
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');

  let isValid = true;

  // Validate Name
  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Name is required.';
    isValid = false;
  } else {
    nameError.textContent = '';
  }

  // Validate Email (Valid format using Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  } else {
    emailError.textContent = '';
  }

  if (!isValid) return;

  // Retrieve Form & Trail Details
  const hikerName = nameInput.value.trim();
  const hikerEmail = emailInput.value.trim();
  const hikerNotes = notesInput.value.trim();
  
  // Grab current trail preview HTML to clone into the confirmation window
  const trailDetailsHtml = document.getElementById('selectedTrailPreview').innerHTML;

  // Update Confirmation Screen
  confirmationText.innerHTML = `Hey <strong>${hikerName}</strong>! We've saved your plan. An email containing your itinerary and custom notes has been dispatched to <strong>${hikerEmail}</strong>.`;
  confirmedTrailDetails.innerHTML = `
    ${trailDetailsHtml}
    ${hikerNotes ? `<div style="margin-top: 10px; font-size: 0.9rem; font-style: italic; color: #555;"><strong>Your notes:</strong> "${hikerNotes}"</div>` : ''}
  `;

  // Transition UI to Confirmation view
  formContainer.classList.add('hidden');
  formConfirmation.classList.remove('hidden');
});

// Function to open modal and pass trail data
export function openPlanModal(trailName) {
  const modal = document.getElementById('hikeModal');
  const trailInput = document.getElementById('modalTrailSelect');
  const form = document.getElementById('planHikeForm');
  const confirmation = document.getElementById('modalConfirmation');

  // Reset modal views
  form.classList.remove('hidden');
  confirmation.classList.add('hidden');
  form.reset();

  // Populate read-only trail name
  trailInput.value = trailName;
  modal.classList.remove('hidden');
}

// Function to close modal
function closeModal() {
  document.getElementById('hikeModal').classList.add('hidden');
}

// Initialize Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');
  const planHikeForm = document.getElementById('planHikeForm');

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', closeModal);

  if (planHikeForm) {
    planHikeForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page refresh

      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      const trail = document.getElementById('modalTrailSelect').value;
      const notes = document.getElementById('userNotes').value || "None";

      // Populate confirmation details view
      const detailsBox = document.getElementById('confirmationDetails');
      detailsBox.innerHTML = `
        <strong>Trail:</strong> ${trail}<br>
        <strong>Sent To:</strong> ${name} (${email})<br>
        <strong>Notes:</strong> "${notes}"
      `;

      // Toggle form / confirmation windows
      document.getElementById('planHikeForm').classList.add('hidden');
      document.getElementById('modalConfirmation').classList.remove('hidden');
    });
  }
});

document.addEventListener("DOMContentLoaded", loadHikes);