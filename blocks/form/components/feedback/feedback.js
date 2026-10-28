/**
 * Custom feedback component
 * Based on: Radio Group
 *
 * Shows the options of a radio group as thumbs up / thumbs down buttons.
 * The first option gets the thumbs up icon, the second the thumbs down icon.
 * Native radios stay in place (visually hidden), so keyboard support, the
 * selected state, the group label and the form model value come from the
 * standard radio group.
 */

// Material Icons "thumb_up" (Apache-2.0); thumbs down is the same shape rotated in CSS.
const THUMB_PATH = 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z';
const ICON_CLASSES = ['feedback-up', 'feedback-down'];

function createIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('feedback-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', THUMB_PATH);
  svg.append(path);
  return svg;
}

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 */
export default async function decorate(fieldDiv) {
  fieldDiv.classList.add('feedback-wrapper');
  fieldDiv.querySelectorAll(':scope > .radio-wrapper').forEach((option, index) => {
    const label = option.querySelector('label');
    if (label && ICON_CLASSES[index] && !label.querySelector('.feedback-icon')) {
      option.classList.add(ICON_CLASSES[index]);
      label.prepend(createIcon());
    }
  });
  return fieldDiv;
}
