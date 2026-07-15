import { initializeModalHandler, openPlanModal } from './modal-handler.js';

const detailContainer = document.querySelector("#trailDetails");

let allHikes = [];

function getTrailIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("id");

    if (!value) {
        return null;
    }

    const normalized = value.trim();

    if (/^trail0*(\d+)$/i.test(normalized)) {
        return Number(RegExp.$1);
    }

    if (/^\d+$/u.test(normalized)) {
        return Number(normalized);
    }

    return normalized;
}

function showMessage(message) {
    if (!detailContainer) {
        return;
    }

    detailContainer.innerHTML = `<section class="hike-card"><p>${message}</p></section>`;
}

function renderTrail(trail) {
    if (!detailContainer) {
        return;
    }

    detailContainer.innerHTML = `
        <section class="hike-card">
            <img src="${escapeHtml(trail.image)}" alt="${escapeHtml(trail.name)}" />
            <h2>${escapeHtml(trail.name)}</h2>
            <p><strong>Location:</strong> ${escapeHtml(trail.location)}</p>
            <p><strong>Distance:</strong> ${trail.distance} miles from Rexburg</p>
            <p><strong>Length:</strong> ${escapeHtml(trail.length)}</p>
            <p><strong>Difficulty:</strong> ${escapeHtml(trail.difficulty)}</p>
            <p><strong>Elevation Gain:</strong> ${escapeHtml(trail.elevationGain)}</p>
            <p><strong>Estimated Time:</strong> ${escapeHtml(trail.time)}</p>
            <p>${escapeHtml(trail.description)}</p>
            
            <div class="trail-card-actions">
                <button class="plan-hike-btn" id="planHikeBtn" data-trail-id="${trail.id}">
                    Plan This Hike 🌲
                </button>
            </div>
        </section>
    `;

    // Add event listener to plan hike button
    const planBtn = document.getElementById('planHikeBtn');
    if (planBtn) {
        planBtn.addEventListener('click', () => {
            openPlanModal(trail, allHikes);
        });
    }
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

async function loadTrail() {
    const trailId = getTrailIdFromUrl();

    if (trailId == null) {
        showMessage("No trail ID provided in the URL.");
        return;
    }

    try {
        const response = await fetch("/data/trails.json");

        if (!response.ok) {
            throw new Error(`Could not load trail data. Status: ${response.status}`);
        }

        const trails = await response.json();
        allHikes = trails;
        const trail = trails.find((item) => item.id == trailId);

        if (!trail) {
            showMessage("Trail not found. Check the URL and try again.");
            return;
        }

        renderTrail(trail);
        initializeModalHandler(allHikes);
    } catch (error) {
        console.error("Error loading trail:", error);
        showMessage("Unable to load trail details at this time.");
    }
}

document.addEventListener("DOMContentLoaded", loadTrail);
