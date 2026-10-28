/* eslint-env mocha */
/**
 * Unit tests for the custom feedback (thumbs up / thumbs down) component decorator.
 */
import assert from 'assert';
import decorate from '../../blocks/form/components/feedback/feedback.js';

function makeRadioGroup(options = [['up', 'Yes'], ['down', 'No']]) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'radio-group-wrapper field-wrapper';
  const legend = document.createElement('legend');
  legend.textContent = 'Was this form easy to use?';
  fieldset.append(legend);
  options.forEach(([value, text], index) => {
    const option = document.createElement('div');
    option.className = 'radio-wrapper';
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = `feedback-${index}`;
    input.name = 'feedback';
    input.value = value;
    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.textContent = text;
    option.append(input, label);
    fieldset.append(option);
  });
  return fieldset;
}

describe('Feedback component', () => {
  describe('Standard behavior', () => {
    it('should mark the group as a feedback component', async () => {
      const fieldset = makeRadioGroup();
      const result = await decorate(fieldset, {});
      assert.strictEqual(result, fieldset);
      assert.ok(fieldset.classList.contains('feedback-wrapper'));
    });

    it('should add thumbs up to the first option and thumbs down to the second', async () => {
      const fieldset = makeRadioGroup();
      await decorate(fieldset, {});
      const [up, down] = fieldset.querySelectorAll('.radio-wrapper');
      assert.ok(up.classList.contains('feedback-up'));
      assert.ok(down.classList.contains('feedback-down'));
      assert.ok(up.querySelector('label > svg.feedback-icon'));
      assert.ok(down.querySelector('label > svg.feedback-icon'));
    });

    it('should hide icons from assistive technology and keep the label text', async () => {
      const fieldset = makeRadioGroup();
      await decorate(fieldset, {});
      fieldset.querySelectorAll('svg.feedback-icon').forEach((svg) => {
        assert.strictEqual(svg.getAttribute('aria-hidden'), 'true');
        assert.strictEqual(svg.getAttribute('focusable'), 'false');
      });
      const labels = [...fieldset.querySelectorAll('label')].map((l) => l.textContent);
      assert.deepStrictEqual(labels, ['Yes', 'No']);
    });

    it('should keep the native radios so keyboard and selection still work', async () => {
      const fieldset = makeRadioGroup();
      await decorate(fieldset, {});
      const radios = fieldset.querySelectorAll('input[type="radio"]');
      assert.strictEqual(radios.length, 2);
      radios[1].checked = true;
      assert.strictEqual(fieldset.querySelector('input:checked').value, 'down');
    });
  });

  describe('Edge cases', () => {
    it('should not add icons twice when decorated again', async () => {
      const fieldset = makeRadioGroup();
      await decorate(fieldset, {});
      await decorate(fieldset, {});
      assert.strictEqual(fieldset.querySelectorAll('svg.feedback-icon').length, 2);
    });

    it('should leave options beyond the second without an icon', async () => {
      const fieldset = makeRadioGroup([['up', 'Yes'], ['down', 'No'], ['maybe', 'Not sure']]);
      await decorate(fieldset, {});
      const third = fieldset.querySelectorAll('.radio-wrapper')[2];
      assert.strictEqual(third.querySelector('svg'), null);
      assert.strictEqual(third.className, 'radio-wrapper');
    });
  });
});
