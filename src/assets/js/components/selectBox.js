'use strict';

import $ from 'jquery';
import Select2 from 'select2/dist/js/select2';
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
    var options = {}

    if (this.options.list) {
      options['theme'] = 'list';
    }

    this.$element.select2(options);
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Destroys the select-box plugin.
   * @function
   * @private
   */
  _destroy() {

  }
}

SelectBox.defaults = {};

export {SelectBox};
