/* eslint-env mocha */
/**
 * Unit tests for the custom consent component decorator.
 */
import assert from 'assert';
import decorate from '../../blocks/form/components/consent/consent.js';
import { updateOrCreateInvalidMsg } from '../../blocks/form/util.js';

function makeCheckboxField(id = 'consent') {
  const wrapper = document.createElement('div');
  wrapper.className = 'checkbox-wrapper field-wrapper';
  wrapper.dataset.required = 'true';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.name = id;
  input.required = true;
  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = 'Are you sure you want to share this data?';
  wrapper.append(input, label);
  return { wrapper, input };
}

describe('Consent component', () => {
  describe('Standard behavior', () => {
    it('should add a title that labels the field group', async () => {
      const { wrapper } = makeCheckboxField();
      await decorate(wrapper, { properties: { consentTitle: 'Terms and Conditions' } });
      const title = wrapper.querySelector('.consent-title');
      assert.ok(title);
      assert.strictEqual(title.textContent, 'Terms and Conditions');
      assert.strictEqual(wrapper.firstElementChild, title);
      assert.strictEqual(wrapper.getAttribute('role'), 'group');
      assert.strictEqual(wrapper.getAttribute('aria-labelledby'), title.id);
      assert.ok(wrapper.classList.contains('consent-wrapper'));
    });

    it('should keep the checkbox unchecked, required and labelled', async () => {
      const { wrapper, input } = makeCheckboxField();
      await decorate(wrapper, {});
      assert.strictEqual(input.checked, false);
      assert.strictEqual(input.required, true);
      assert.strictEqual(wrapper.querySelector('label[for="consent"]').textContent, 'Are you sure you want to share this data?');
    });

    it('should link the checkbox to the shared validation message element', async () => {
      const { wrapper, input } = makeCheckboxField();
      document.body.append(wrapper);
      await decorate(wrapper, {});
      assert.strictEqual(input.getAttribute('aria-describedby'), 'consent-description');
      const msg = updateOrCreateInvalidMsg(input, 'Confirm that you want to share this data.');
      assert.strictEqual(msg.id, 'consent-description');
      assert.strictEqual(msg.getAttribute('aria-live'), 'polite');
      assert.strictEqual(document.getElementById(input.getAttribute('aria-describedby')).textContent, 'Confirm that you want to share this data.');
      wrapper.remove();
    });

    it('should set aria-invalid when the field is already invalid', async () => {
      const { wrapper, input } = makeCheckboxField();
      wrapper.classList.add('field-invalid');
      await decorate(wrapper, {});
      assert.strictEqual(input.getAttribute('aria-invalid'), 'true');
    });
  });

  describe('Edge cases', () => {
    it('should default the title to Terms and Conditions', async () => {
      const { wrapper } = makeCheckboxField();
      await decorate(wrapper, undefined);
      assert.strictEqual(wrapper.querySelector('.consent-title').textContent, 'Terms and Conditions');
    });

    it('should leave a field without a checkbox untouched', async () => {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-wrapper';
      const result = await decorate(wrapper, {});
      assert.strictEqual(result, wrapper);
      assert.strictEqual(wrapper.querySelector('.consent-title'), null);
      assert.strictEqual(wrapper.getAttribute('role'), null);
    });
  });
});
