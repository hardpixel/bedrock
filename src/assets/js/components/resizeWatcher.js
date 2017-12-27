'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * ResizeWatcher module.
 * @module resizeWatcher
 */

class ResizeWatcher extends Plugin {
  /**
   * Creates a new instance of an resize-watcher.
   * @class
   * @name ResizeWatcher
   * @fires ResizeWatcher#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'ResizeWatcher'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, ResizeWatcher.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the resize-watcher wrapper.
   * @function
   * @private
   */
  _init() {
    this._triggerChanged = this._debounce(function(e) {
      if (e.target.innerHTML.length > 0) {
        $(document).trigger('contentchanged');
      }
    }, 250);

    this._events();
  }

  /**
   * Adds event handlers to the resize-watcher.
   * @function
   * @private
   */
  _events() {
    $(document).on('DOMSubtreeModified', this._triggerChanged);
    $(document).on('contentchanged', this._resizeAttachments.bind(this));
  }

  /**
   * Debounces function.
   * @function
   * @private
   */
  _debounce(func, wait, immediate) {
    var timeout;

    return function() {
      var context = this;
      var args = arguments;

      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);

      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /** Resizes attachments.
   * @function
   * @private
   */
  _resizeAttachments() {
    $('.attachments-grid:visible').each(function(index, el) {
      var available = $(el).width();
      var columns = Math.round(available / 170);
      var existing = $(el).attr('data-grid-columns');

      if (columns != existing) {
        if (columns > 9) {
          columns = 9;
        }

        if (columns > 0) {
          $(el).attr('data-grid-columns', columns);
        }
      }
    });
  }

  /**
   * Destroys the resize-watcher plugin.
   * @function
   * @private
   */
  _destroy() {
    $(document).off('contentchanged');
  }
}

ResizeWatcher.defaults = {};

export {ResizeWatcher};
