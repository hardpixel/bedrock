'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var Quill = require('quill/dist/quill.js');

/**
 * TextEditor module.
 * @module textEditor
 */

class TextEditor extends Plugin {
  /**
   * Creates a new instance of an text-editor.
   * @class
   * @name TextEditor
   * @fires TextEditor#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'TextEditor'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, TextEditor.defaults, this.$element.data(), options, { modules: { toolbar: '#toolbar' } });
    this.editor = new Quill(this.$element.get(0), this.options);

    this._init();
  }

  /**
   * Initializes the text-editor wrapper.
   * @function
   * @private
   */
  _init() {
    if (this.options.minHeight) {
      this.$element.css('min-height', this.options.minHeight + 'px');
    }
  }

  /**
   * Adds event handlers to the text-editor.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Destroys the text-editor plugin.
   * @function
   */
  _destroy() {

  }
}

TextEditor.defaults = {};

export {TextEditor};
