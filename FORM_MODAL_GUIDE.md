# Plan Your Hike - Form Modal Implementation Guide

## Overview
This implementation provides a complete form modal system that allows users to plan their hikes by filling in their personal information (name, email) and optional notes. The form includes email validation and displays a confirmation screen with the selected trail details.

## Features

### ✅ Form Fields
- **Name** (Required) - Text input for user's full name
- **Email** (Required) - Email input with format validation
- **Notes** (Optional) - Textarea for additional hiking notes (gear reminders, dates, safety notes)
- **Trail Selection** - Read-only display of the selected trail

### ✅ Validation
- **Name Validation**: Checks if field is not empty
- **Email Validation**: Uses regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` to ensure:
  - Valid email format (has @ symbol)
  - Has domain name
  - Has top-level domain (TLD)
- Error messages display inline below each field

### ✅ User Experience
- Modal opens when user clicks "Plan Your Hike" button
- Closes with:
  - X button (top-right)
  - Clicking overlay background
  - Pressing ESC key
- Smooth transition between form and confirmation states
- XSS protection with HTML escaping

### ✅ Confirmation Screen
Displays:
- Success message with user's name
- Trail details (name, location, difficulty, distance, time)
- User's email where itinerary was sent
- User's notes (if provided)
- "Awesome, let's go!" button to return to exploring

## File Structure

### HTML
- **index.html** - Home page with modal
- **trail.html** - Trail detail page with modal

### JavaScript
- **main.js** - Handles home page hike loading and modal integration
- **trail.js** - Handles trail detail page and modal initialization
- **modal-handler.js** - Core modal logic (form validation, submission, UI states)
- **render.js** - Helper functions for rendering trail previews

### CSS
- **style.css** - Complete styling for modal, form, and confirmation states

## Implementation Details

### Modal Structure
```html
<section id="hikeModal" class="modal-overlay hidden">
  <div class="modal-content">
    <button id="closeModalBtn" class="close-btn">&times;</button>
    
    <!-- Form State -->
    <form id="planHikeForm" novalidate>
      <!-- Form fields here -->
    </form>

    <!-- Confirmation State -->
    <div id="modalConfirmation" class="hidden">
      <!-- Confirmation content here -->
    </div>
  </div>
</section>
```

### Form Submission Flow
1. User fills out form fields
2. On submit, JavaScript validates:
   - Name is not empty
   - Email matches validation regex
3. If valid:
   - Collects trail, name, email, and notes data
   - Builds confirmation message with trail details
   - Hides form, shows confirmation
4. User clicks "Awesome, let's go!" to close modal

### Email Validation
The regex pattern validates emails by checking for:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```
- `^` - Start of string
- `[^\s@]+` - One or more characters that are not whitespace or @
- `@` - Required @ symbol
- `[^\s@]+` - Domain name (at least one character)
- `\.` - Literal dot before TLD
- `[^\s@]+` - TLD (at least one character)
- `$` - End of string

Examples:
- ✅ `john@example.com` - Valid
- ✅ `user.name+tag@domain.co.uk` - Valid
- ❌ `john` - Invalid (missing @)
- ❌ `john@example` - Invalid (missing TLD)
- ❌ `@example.com` - Invalid (missing username)

## CSS Classes

### Modal
- `.modal-overlay` - Full-screen overlay with blur background
- `.modal-content` - White card container
- `.close-btn` - Close button styling
- `.hidden` - Hide element (display: none)

### Form
- `.form-group` - Container for label + input + error
- `.error-message` - Red text for validation errors
- `.submit-btn` - Green button styling

### Trail Preview
- `.selected-trail-preview` - Light background box showing selected trail
- `.confirmed-itinerary` - Light background box on confirmation screen

## Usage on Home Page (index.html)

### Triggering Modal
1. User clicks "Plan Hike" on any trail card
2. `openPlanModal()` is called with trail name
3. Modal opens with form state
4. Trail name is populated in readonly field

```javascript
export function openPlanModal(trailName) {
  const modal = document.getElementById('hikeModal');
  const form = document.getElementById('planHikeForm');
  
  form.reset();
  document.getElementById('modalTrailSelect').value = trailName;
  modal.classList.remove('hidden');
}
```

## Usage on Trail Page (trail.html)

### Triggering Modal
1. User views trail details
2. Clicks "Plan This Hike 🌲" button
3. `openPlanModal()` is called with full trail object
4. Modal opens with form and trail preview

```javascript
import { openPlanModal } from './modal-handler.js';

const planBtn = document.getElementById('planHikeBtn');
planBtn.addEventListener('click', () => {
  openPlanModal(trail, allHikes);
});
```

## Styling Details

### Modal Appearance
- **Width**: 90% on mobile, 500px max on desktop
- **Background**: Light cream color (#fcfaf2)
- **Border**: 2px forest green (#4a5d4e)
- **Overlay**: Semi-transparent black (0.6 opacity) with blur effect
- **Shadow**: 10px blur at 25% opacity

### Form Inputs
- **Padding**: 0.75rem
- **Border**: 1px solid light gray (#d9d9d9)
- **Focus**: Green border (#4a5d4e) with subtle shadow
- **Textarea**: Resizable vertically

### Buttons
- **Primary Color**: #4a5d4e (forest green)
- **Hover**: Darkens to #3b4d3f
- **Width**: 100% of container
- **Padding**: 0.75rem
- **Font**: Bold, 1rem

## Error Handling

### Display Errors
Errors appear immediately below invalid field:
```html
<input type="text" id="userName" required>
<span class="error-message" id="nameError"></span>
```

### Error Messages
- **Name**: "Name is required."
- **Email**: "Please enter a valid email address."

### Clear Errors
- Errors clear when form is valid
- Errors clear when modal is reopened

## Security Features

### XSS Protection
- HTML escape function used for user input:
```javascript
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
```

### Form Validation
- Client-side validation prevents empty submissions
- Email regex ensures valid format
- No server interaction (frontend only)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Test Modal Opens
1. Click "Plan Your Hike" on any trail card
2. Modal should appear with overlay
3. Trail name should be populated

### Test Name Validation
1. Click submit without entering name
2. Error message should appear: "Name is required."
3. Enter name, error should disappear

### Test Email Validation
1. Try invalid emails:
   - "test" → Error: "Please enter a valid email address."
   - "test@example" → Error
   - "@example.com" → Error
2. Try valid emails:
   - "john@example.com" → Success
   - "user+tag@domain.co.uk" → Success

### Test Confirmation
1. Fill form with valid data
2. Click "Email Me My Hike Plan"
3. Confirmation screen should show:
   - Success message with name
   - Trail details
   - User email
   - User notes (if provided)

### Test Close Methods
1. Click X button → Modal closes
2. Click overlay → Modal closes
3. Press ESC key → Modal closes
4. Click "Awesome, let's go!" → Modal closes

## Future Enhancements

Potential features to add:
- Backend email integration (send actual emails)
- Save plans to user account
- Multiple trail selection
- Date picker for hike date
- Equipment checklist
- Weather integration
- Difficulty filter
- Trail ratings and reviews

## Notes

- Currently, the form displays a confirmation but does not send actual emails
- Email validation is client-side only
- All trail data is loaded from `/data/trails.json`
- Modal state persists while page is loaded
- Form data is cleared when modal is reopened
