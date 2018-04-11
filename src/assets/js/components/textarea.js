'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var autosize = require('autosize/dist/autosize');

/**
 * Textarea module.
 * @module textarea
 */

class Textarea extends Plugin {
  /**
   * Creates a new instance of an textarea.
   * @class
   * @name Textarea
   * @fires Textarea#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'Textarea'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, Textarea.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the textarea wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.wrap('<div class="textarea-container"></div>');
    this.$wrapper = this.$element.parent();

    var icon = `<i class="resize-grip"></i>`;
    var text = '<span>Characters</span>';
    var count = '<span class="count"></span>';

    this.$wrapper.append(`<div class="textarea-info">${count}${text}${icon}</div>`);
    this.$count = this.$wrapper.find('.count');

    this.update();
    this._events();
  }

  /**
   * Adds event handlers to the textarea.
   * @function
   * @private
   */
  _events() {
    autosize(this.$element);

    this.$element.off('keydown change').on({
      'keydown': this.update.bind(this),
      'change': this.update.bind(this)
    });
  }

  /**
   * Updates textarea info.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  update(event) {
    var value = this.$element.val().toString();
    this.$count.text(value.length);
  }

  /**
   * Destroys the textarea plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('input');
  }
}

Textarea.defaults = {};

export {Textarea};
