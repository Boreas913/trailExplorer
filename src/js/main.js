import { loadHikes, displayHikes } from "./modules/hikeData.js";
import { displayFavorites } from "./modules/favorites.js";
import { setupModalListeners, openPlanModal } from "./modules/modal.js";
import { setupSearchListeners } from "./modules/search.js";

export { openPlanModal };

document.addEventListener("DOMContentLoaded", () => {
  loadHikes();
  displayFavorites();
  setupModalListeners();
  setupSearchListeners();
});