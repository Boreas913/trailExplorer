// DOM Selectors
export const SELECTORS = {
  cardsContainer: document.querySelector("#hikeCards"),
  favoritesContainer: document.querySelector("#favoriteTrails"),
  modal: document.getElementById("hikeModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  confirmCloseBtn: document.getElementById("confirmCloseBtn"),
  planHikeForm: document.getElementById("planHikeForm"),
  trailInput: document.getElementById("modalTrailSelect"),
  confirmation: document.getElementById("modalConfirmation"),
  nameInput: document.getElementById("userName"),
  emailInput: document.getElementById("userEmail"),
  notesInput: document.getElementById("userNotes"),
  detailsBox: document.getElementById("confirmationDetails"),
};

// Regular Expressions
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Configuration
export const CONFIG = {
  dataPath: "/data/trails.json",
  storageKey: "favorites",
};
