'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * SelectBox module.
 * @module selectBox
 */

class SelectBox extends Plugin {
  /**
   * Creates a new instance of an select-box.
   * @class
   * @name SelectBox
   * @fires SelectBox#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'SelectBox'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, SelectBox.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the select-box wrapper.
   * @function
   * @private
   */
  _init() {
    this.$input = this.$element.find('input');
    this.$dropdown = this.$element.find('[data-dropdown]');

    this._events();
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {
    this.$element.off('click', 'li').on({
      'click': this.select.bind(this)
    }, 'li');
  }

  /**
   * Opens the select dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  open(event) {
    this.$element.trigger('open.zf.select.box');
  }

  /**
   * Selects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  select(event) {
    var text = $(event.target).text();

    this.$input.val(text);
    this.$dropdown.foundation('close');

    this.$element.trigger('change');
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Unselects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  unselect(event) {
    this.$element.trigger('change');
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Destroys the select-box plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.trigger');
  }
}

SelectBox.defaults = {};

export {SelectBox};
