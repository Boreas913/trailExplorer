// src/js/render.js

/**
 * Renders the preview of a trail inside the planning modal
 * @param {Object} trail 
 */
export function renderModalTrailPreview(trail, targetElementId) {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center;">
      ${trail.image ? `<img src="${trail.image}" alt="${trail.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;">` : ''}
      <div>
        <strong style="font-size: 1.1rem; color: #2d5a27;">${trail.name}</strong><br>
        <span style="font-size: 0.85rem; color: #666;">${trail.location} • ${trail.distance} miles • ${trail.difficulty}</span>
      </div>
    </div>
  `;
}