/**
 * Modal Handler for Plan Your Hike Form
 * Manages form submission, validation, and confirmation display
 */

export function initializeModalHandler(allHikes = []) {
  const modal = document.getElementById('hikeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmCloseBtn = document.getElementById('closeConfirmBtn');
  const planHikeForm = document.getElementById('planHikeForm');
  const formContainer = document.getElementById('formContainer');
  const formConfirmation = document.getElementById('formConfirmation');

  if (!modal || !planHikeForm) {
    console.warn('Modal or form elements not found');
    return;
  }

  // Close modal button
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Confirm/close button on confirmation screen
  if (confirmCloseBtn) {
    confirmCloseBtn.addEventListener('click', closeModal);
  }

  // Close when clicking overlay
  const modalOverlay = modal.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Form submission with validation
  planHikeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('hikeName');
    const email = document.getElementById('hikeEmail');
    const notes = document.getElementById('hikeNotes');
    const selectedTrailId = document.getElementById('selectedTrailId');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');

    let isValid = true;

    // Validate Name
    const nameValue = name.value.trim();
    if (!nameValue) {
      nameError.textContent = 'Name is required.';
      isValid = false;
    } else {
      nameError.textContent = '';
    }

    // Validate Email format
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    } else {
      emailError.textContent = '';
    }

    if (!isValid) return;

    // Get trail info
    const trailId = parseInt(selectedTrailId.value);
    const trail = allHikes.find(h => h.id === trailId);
    const notesValue = notes.value.trim();

    // Build confirmation message
    const confirmationText = document.getElementById('confirmationText');
    const confirmedTrailDetails = document.getElementById('confirmedTrailDetails');

    confirmationText.innerHTML = `
      Hey <strong>${escapeHtml(nameValue)}</strong>! We've saved your plan. 
      An email containing your itinerary has been sent to <strong>${escapeHtml(emailValue)}</strong>.
    `;

    if (trail) {
      confirmedTrailDetails.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <strong>Trail:</strong> ${escapeHtml(trail.name)}<br>
          <strong>Location:</strong> ${escapeHtml(trail.location)}<br>
          <strong>Difficulty:</strong> ${escapeHtml(trail.difficulty)}<br>
          <strong>Distance:</strong> ${trail.distance} miles from Rexburg<br>
          <strong>Estimated Time:</strong> ${escapeHtml(trail.time)}
        </div>
        ${notesValue ? `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ccc;"><strong>Your Notes:</strong> "${escapeHtml(notesValue)}"</div>` : ''}
      `;
    }

    // Switch to confirmation view
    if (formContainer) formContainer.classList.add('hidden');
    if (formConfirmation) formConfirmation.classList.remove('hidden');
  });

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
    }
    // Re-enable page scrolling when the modal is closed
    try {
      document.body.style.overflow = '';
    } catch (e) {
      // Ignore if document.body is not available for some reason
    }
  }
}

export function openPlanModal(trail, allHikes = []) {
  const modal = document.getElementById('hikeModal');
  const planHikeForm = document.getElementById('planHikeForm');
  const formContainer = document.getElementById('formContainer');
  const formConfirmation = document.getElementById('formConfirmation');
  const selectedTrailId = document.getElementById('selectedTrailId');
  const selectedTrailPreview = document.getElementById('selectedTrailPreview');

  if (!modal || !planHikeForm) return;

  // Reset form
  planHikeForm.reset();

  // Clear error messages
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  if (nameError) nameError.textContent = '';
  if (emailError) emailError.textContent = '';

  // Set trail data
  if (selectedTrailId && trail) {
    selectedTrailId.value = trail.id;
  }

  // Display trail preview
  if (selectedTrailPreview && trail) {
    selectedTrailPreview.innerHTML = `
      <strong>${escapeHtml(trail.name)}</strong><br>
      <span style="font-size: 0.9rem; color: #666;">
        ${escapeHtml(trail.location)} • ${escapeHtml(trail.length)} • ${escapeHtml(trail.difficulty)}
      </span>
    `;
  }

  // Show form, hide confirmation
  if (formContainer) formContainer.classList.remove('hidden');
  if (formConfirmation) formConfirmation.classList.add('hidden');

  // Prevent background from scrolling while modal is open
  try {
    document.body.style.overflow = 'hidden';
  } catch (e) {
    // Ignore if document.body is not available
  }

  // Open modal
  modal.classList.remove('hidden');
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
