'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * TinyMceEditor module.
 * @module tinyMceEditor
 */

class TinyMceEditor extends Plugin {
  /**
   * Creates a new instance of an tiny-mce-editor.
   * @class
   * @name TinyMceEditor
   * @fires TinyMceEditor#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'TinyMceEditor'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, TinyMceEditor.defaults, this.$element.data(), options);
    this.editor = null;

    this._init();
  }

  /**
   * Initializes the tiny-mce-editor wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.wrap('<div class="tiny-mce-editor"></div>');
    this.options = $.extend({}, this.options, { target: this.$element.get(0) });

    if (tinymce !== 'undefined') {
      this.editor = tinymce.init(this.options);
    } else {
      console.log('TinyMCE is not available! Please download and install TinyMCE.');
    }
  }

  /**
   * Destroys the tiny-mce-editor plugin.
   * @function
   */
  _destroy() {
    if (this.editor) {
      tinymce.remove('#' + this.$element.attr('id'));
      this.$element.unwrap();
    } else {
      console.log('No editor instance found! Maybe you are missing TinyMCE.');
    }
  }
}

TinyMceEditor.toolbar = [
  'bold italic underline strikethrough',
  'bullist numlist blockquote',
  'alignleft aligncenter alignright alignjustify',
  'outdent indent',
  'link unlink',
  'formatselect',
  'charmap',
  'removeformat pastetext',
  'undo redo',
  'fullscreen'
];

TinyMceEditor.plugins = [
  'paste',
  'link',
  'lists',
  'charmap',
  'autoresize',
  'table',
  'wordcount',
  'fullscreen'
];

TinyMceEditor.defaults = {
  menubar: false,
  branding: false,
  plugins: TinyMceEditor.plugins.join(' '),
  toolbar: TinyMceEditor.toolbar.join(' | ')
};

export {TinyMceEditor};
