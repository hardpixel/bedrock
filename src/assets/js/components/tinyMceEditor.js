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

    this.id = this.$element.attr('id');
    this.computed = { target: this.$element.get(0), setup: this._setupCallback.bind(this) };
    this.options = $.extend({}, this.options, this.computed);
    this.options = this._snakeCase(this.options);

    if (tinymce !== 'undefined') {
      tinymce.init(this.options);
    } else {
      console.log('TinyMCE is not available! Please download and install TinyMCE.');
    }
  }

  /**
   * Converts keys from PascalCase to snake_case.
   * @function
   * @private
   */
  _snakeCase(originalObject) {
    var newObject = {};

    for (var key in originalObject) {
      var new_key = key.replace( /([A-Z])/g, "_$1" ).toLowerCase();
      newObject[new_key] = originalObject[key];
    }

    return newObject;
  }

  /**
   * Sets setup callback.
   * @param {Object} editor - Tiny mce editor instance.
   * @function
   * @private
   */
  _setupCallback(editor) {
    this.editor = editor;

    editor.on('change', function () {
      tinymce.triggerSave();
      this.$element.trigger('change');
    }.bind(this));
  }

  /**
   * Destroys the tiny-mce-editor plugin.
   * @function
   * @private
   */
  _destroy() {
    if (this.editor) {
      tinymce.remove(`#${this.id}`);
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
  'removeformat pastetext',
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
  entity_encoding: 'raw',
  max_height: 800,
  min_height: 300,
  autoresize_bottom_margin: 0,
  autoresize_max_height: 800,
  autoresize_min_height: 300,
  plugins: TinyMceEditor.plugins.join(' '),
  toolbar: TinyMceEditor.toolbar.join(' | '),
  content_style: "html { padding: 0 .5rem }"
};

export {TinyMceEditor};
