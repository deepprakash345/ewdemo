/**
 * Custom consent component
 * Based on: Checkbox
 *
 * Shows a consent checkbox under a visible title (default "Terms and Conditions").
 * Rendering, required validation and the error message come from the standard
 * checkbox and form model; this only adds the title and accessibility wiring.
 * It never submits or stores data itself.
 */

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 * @param {Object} fieldJson - The form json object for the component.
 */
export default async function decorate(fieldDiv, fieldJson) {
  const input = fieldDiv.querySelector('input[type="checkbox"]');
  if (!input) {
    return fieldDiv;
  }
  const { id } = input;

  const title = document.createElement('p');
  title.className = 'consent-title';
  title.id = `${id}-title`;
  title.textContent = fieldJson?.properties?.consentTitle || 'Terms and Conditions';
  fieldDiv.prepend(title);
  fieldDiv.classList.add('consent-wrapper');
  fieldDiv.setAttribute('role', 'group');
  fieldDiv.setAttribute('aria-labelledby', title.id);

  // Point at the shared help/error element (same id the form block uses for
  // validation messages) so errors are announced with the checkbox.
  input.setAttribute('aria-describedby', `${id}-description`);

  // Mirror the form block's invalid state for assistive technology.
  const syncInvalid = () => {
    if (fieldDiv.classList.contains('field-invalid')) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };
  new MutationObserver(syncInvalid).observe(fieldDiv, { attributes: true, attributeFilter: ['class'] });
  syncInvalid();

  return fieldDiv;
}
