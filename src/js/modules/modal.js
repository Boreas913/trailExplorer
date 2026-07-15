import { SELECTORS, REGEX } from "../constants.js";
import { escapeHtml } from "./utils.js";

export function openPlanModal(trailName) {
  const form = SELECTORS.planHikeForm;
  const confirmation = SELECTORS.confirmation;

  form.classList.remove("hidden");
  confirmation.classList.add("hidden");
  form.reset();

  clearErrorMessages();
  SELECTORS.trailInput.value = trailName;
  SELECTORS.modal.classList.remove("hidden");
}

function closeModal() {
  SELECTORS.modal.classList.add("hidden");
}

function clearErrorMessages() {
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  if (nameError) nameError.textContent = "";
  if (emailError) emailError.textContent = "";
}

export function setupModalListeners() {
  if (SELECTORS.closeModalBtn) {
    SELECTORS.closeModalBtn.addEventListener("click", closeModal);
  }

  if (SELECTORS.confirmCloseBtn) {
    SELECTORS.confirmCloseBtn.addEventListener("click", closeModal);
  }

  if (SELECTORS.modal) {
    SELECTORS.modal.addEventListener("click", (e) => {
      if (e.target === SELECTORS.modal) closeModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      SELECTORS.modal &&
      !SELECTORS.modal.classList.contains("hidden")
    ) {
      closeModal();
    }
  });

  if (SELECTORS.planHikeForm) {
    SELECTORS.planHikeForm.addEventListener("submit", handleFormSubmit);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = SELECTORS.nameInput.value.trim();
  const email = SELECTORS.emailInput.value.trim();
  const trail = SELECTORS.trailInput.value;
  const notes = SELECTORS.notesInput.value.trim() || "No additional notes";

  let isValid = true;
  const nameError =
    document.getElementById("nameError") || createErrorElement("nameError");
  const emailError =
    document.getElementById("emailError") || createErrorElement("emailError");

  if (!name) {
    nameError.textContent = "Name is required.";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  if (!REGEX.email.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  } else {
    emailError.textContent = "";
  }

  if (!isValid) return;

  SELECTORS.detailsBox.innerHTML = `
    <strong>Trail:</strong> ${escapeHtml(trail)}<br>
    <strong>Hiker:</strong> ${escapeHtml(name)}<br>
    <strong>Email:</strong> ${escapeHtml(email)}<br>
    <strong>Notes:</strong> "${escapeHtml(notes)}"
  `;

  SELECTORS.planHikeForm.classList.add("hidden");
  SELECTORS.confirmation.classList.remove("hidden");
}

function createErrorElement(id) {
  const elem = document.createElement("span");
  elem.id = id;
  elem.className = "error-message";
  const formGroup = document.querySelector(`[for="${id.replace("Error", "")}"]`)?.closest(".form-group");
  if (formGroup) formGroup.appendChild(elem);
  return elem;
}
