const detailContainer = document.querySelector("#trailDetails");

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
            <img src="${trail.image}" alt="${trail.name}" />
            <h2>${trail.name}</h2>
            <p><strong>Location:</strong> ${trail.location}</p>
            <p><strong>Distance:</strong> ${trail.distance} miles from Rexburg</p>
            <p><strong>Length:</strong> ${trail.length}</p>
            <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
            <p><strong>Elevation Gain:</strong> ${trail.elevationGain}</p>
            <p><strong>Estimated Time:</strong> ${trail.time}</p>
            <p>${trail.description}</p>
        </section>
    `;
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
        const trail = trails.find((item) => item.id == trailId);

        if (!trail) {
            showMessage("Trail not found. Check the URL and try again.");
            return;
        }

        renderTrail(trail);
    } catch (error) {
        console.error("Error loading trail:", error);
        showMessage("Unable to load trail details at this time.");
    }
}

document.addEventListener("DOMContentLoaded", loadTrail);
