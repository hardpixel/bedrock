'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * CustomPlugin module.
 * @module customPlugin
 */

class CustomPlugin extends Plugin {
  /**
   * Creates a new instance of an custom-plugin.
   * @class
   * @name CustomPlugin
   * @fires CustomPlugin#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'CustomPlugin'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, CustomPlugin.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the custom-plugin wrapper.
   * @function
   * @private
   */
  _init() {

  }

  /**
   * Adds event handlers to the custom-plugin.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Destroys the custom-plugin plugin.
   * @function
   */
  _destroy() {

  }
}

CustomPlugin.defaults = {};

export {CustomPlugin};
