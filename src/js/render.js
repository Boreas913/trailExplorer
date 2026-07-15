import { openPlanModal } from './main.js';

/**
 * Generates the HTML string or DOM elements for a trail card
 * @param {Object} trail - The trail data object (e.g., { name: 'Cascade Falls', difficulty: 'Easy', ... })
 */
export function renderTrailCard(trail) {
  // Create card element
  const card = document.createElement('div');
  card.className = 'trail-card';

  card.innerHTML = `
    <img src="${trail.image || 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=300&q=80'}" alt="${trail.name}" class="trail-card-image">
    <div class="trail-card-content">
      <h3>${trail.name}</h3>
      <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
      <p>${trail.description || 'A beautiful scenic trail waiting to be explored.'}</p>
      
      <div class="trail-card-actions">
        <button class="plan-hike-btn" data-trail-name="${trail.name}">
          Plan Hike 🌲
        </button>
      </div>
    </div>
  `;

  // Attach event listener directly to the button inside this card
  const planBtn = card.querySelector('.plan-hike-btn');
  planBtn.addEventListener('click', (e) => {
    const trailName = e.target.getAttribute('data-trail-name');
    openPlanModal(trailName);
  });

  return card;
}

/**
 * Renders a trail preview in the modal
 * @param {Object} trail - The trail data object
 * @param {String} containerId - The ID of the container to render into
 */
export function renderModalTrailPreview(trail, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <strong>${trail.name}</strong><br>
    <span style="font-size: 0.9rem; color: #666;">
      ${trail.location} • ${trail.length} • ${trail.difficulty}
    </span>
  `;
}