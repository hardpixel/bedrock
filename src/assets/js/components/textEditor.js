'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

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
    this.$element.wrap('<div class="text-editor"></div>');
    this.options = $.extend({}, this.options, { target: this.$element.get(0) });

    if (tinymce !== 'undefined') {
      this.editor = tinymce.init(this.options);
    } else {
      console.log('TinyMCE is not available! Please download and install TinyMCE.');
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

TextEditor.toolbar = [
  'formatselect', 'bold italic underline',
  'alignleft aligncenter alignright alignjustify',
  'bullist numlist outdent indent', 'removeformat',
  'fullscreen'
];

TextEditor.defaults = {
  menubar: false,
  branding: false,
  plugins: 'paste link autoresize table wordcount fullscreen',
  toolbar: [TextEditor.toolbar.join(' | ')]
};

export {TextEditor};
