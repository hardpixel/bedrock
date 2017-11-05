'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

import tinymce from 'tinymce';

import 'tinymce/themes/inlite';
import 'tinymce/themes/modern';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/fullscreen';


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

    this.editor = tinymce.init({
      target: this.$element.get(0),
      menubar: false,
      branding: false,
      skin_url: './assets/tinymce/skins/lightgray',
      plugins: 'paste link autoresize table wordcount fullscreen',
      toolbar: ['formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | fullscreen']
    });
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

};

export {TextEditor};
