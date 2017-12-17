'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * InlineEditBox module.
 * @module inlineEditBox
 */

class InlineEditBox extends Plugin {
  /**
   * Creates a new instance of an inline-edit-box.
   * @class
   * @name InlineEditBox
   * @fires InlineEditBox#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'InlineEditBox'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, InlineEditBox.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the inline-edit-box wrapper.
   * @function
   * @private
   */
  _init() {
    this.$input = this.$element.find(':input');
    this.$preview = this.$element.find('[data-preview]');

    this._updatePreview();
    this._events();
  }

  /**
   * Adds event handlers to the inline-edit-box.
   * @function
   * @private
   */
  _events() {
    this.$element.off('click', '[data-edit]').on({
      'click': this._handleClick.bind(this)
    }, '[data-edit]');

    this.$element.off('click', '[data-save]').on({
      'click': this._handleClick.bind(this)
    }, '[data-save]');

    this.$element.off('keydown', ':input').on({
      'keydown': this._handleKey.bind(this)
    }, ':input');

    this.$element.off('.zf.trigger').on({
      'update.zf.trigger': this._updatePreview.bind(this),
      'edit.zf.trigger': this.edit.bind(this),
      'save.zf.trigger': this.save.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this)
    });
  }

  /**
   * Updates preview element.
   * @function
   * @private
   */
  _updatePreview() {
    var pattern = this.$preview.attr('data-value') || '[val]';
    var placeholder = this.$preview.attr('data-placeholder');
    var value = this.$input.val();
    var result = pattern.replace('[val]', value);

    if (value) {
      this.$preview.text(result);

      if (this.$preview.is('a')) {
        this.$preview.attr('href', result);
      }
    } else {
      this.$preview.text(placeholder);

      if (this.$preview.is('a')) {
        this.$preview.removeAttr('href');
      }
    }
  }

  /**
   * Handles click events on items.
   * @function
   * @private
   */
  _handleClick(event) {
    var target = $(event.currentTarget);

    if (target.is('[data-edit]')) {
      this.$element.trigger('edit.zf.trigger');
    }

    if (target.is('[data-save]')) {
      this.$element.trigger('save.zf.trigger');
    }
  }

  /**
   * Handles key events on inputs.
   * @function
   * @private
   */
  _handleKey(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      this.$element.trigger('save.zf.trigger');

      return false;
    }
  }

  /**
   * Shows inline edit input
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  edit(event) {
    this.$element.addClass('is-editing');
    this.$input.trigger('focus');
    this._updatePreview();
  }

  /**
   * Hides inline edit input
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  save(event) {
    this.$element.removeClass('is-editing');
    this._updatePreview();
  }

  /**
   * Toggles inline edit input
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  toggle(event) {
    if (this.$element.hasClass('is-editing')) {
      this.$element.trigger('save.zf.trigger');
    } else {
      this.$element.trigger('edit.zf.trigger');
    }
  }

  /**
   * Destroys the inline-edit-box plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.removeClass('is-editing');
    this.$element.off('click', '[data-edit]');
    this.$element.off('click', '[data-save]');
    this.$element.off('keydown', ':input');
    this.$element.off('.zf.trigger');
  }
}

InlineEditBox.defaults = {};

export {InlineEditBox};
