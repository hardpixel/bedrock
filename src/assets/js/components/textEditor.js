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
    this.$container = $('<div></div>')
    this.options = $.extend({}, TextEditor.defaults, this.$element.data(), options);
    this.editor = null;

    this._init();
  }

  /**
   * Initializes the text-editor wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.append(this.$container);
    this.editor = new Quill(this.$container.get(0), this.options);

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

TextEditor.defaults = {
  theme: 'snow',
  minHeight: '300',
  modules: {
    toolbar: [
      [{ 'header': [2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, 'blockquote'],
      ['align', { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }
};

export {TextEditor};
