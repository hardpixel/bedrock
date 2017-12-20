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
    this.mediaHandler = this.options.mediaHandler;
    this.mediaSrc = this.options.mediaSrc
    this.mediaAlt = this.options.mediaAlt
    this.mediaUrl = this.options.mediaUrl
    this.shortcodeHandler = this.options.shortcodeHandler;

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
   * Gets value from object by dot notation.
   * @param {Object} obj - Object to get the key value from.
   * @param {String} path - Dot notated path to the key.
   * @function
   * @private
   */
  _getObjectValue(obj, path) {
    return new Function('_', `return _.${path}`)(obj);
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

    if (this.mediaHandler) {
      editor.addButton('image', {
        icon: 'image',
        tooltip: 'Insert/edit media',
        onclick: this._mediaButtonCallback.bind(this)
      });
    }

    if (this.shortcodeHandler) {
      editor.addButton('shortcode', {
        icon: 'template',
        tooltip: 'Insert/edit shortcodes',
        onclick: this._shortcodeButtonCallback.bind(this)
      });
    }
  }

  /**
   * Custom media button click callback.
   * @param {Object} event - Event passed from handler.
   * @function
   * @private
   */
  _mediaButtonCallback(event) {
    this.$reveal = $(`#${this.mediaHandler}`);
    this.$reveal.foundation('open');

    this.$reveal.off('insert.zf.media.reveal').on({
      'insert.zf.media.reveal': this._mediaInsert.bind(this)
    });
  }

  /**
   * Inserts media in the editor.
   * @param {Object} event - Event object passed from listener.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _mediaInsert(event, data) {
    $.each(data, function(index, data) {
      var url = this._getObjectValue(data, this.mediaSrc);
      var alt = this._getObjectValue(data, this.mediaAlt);
      var item = '<img src="' + this.mediaUrl.replace('[src]', url) + '" alt="' + alt + '" />';

      this.editor.insertContent(item);
    }.bind(this));
  }

  /**
   * Custom shortcode button click callback.
   * @param {Object} event - Event passed from handler.
   * @function
   * @private
   */
  _shortcodeButtonCallback(event) {
    this.$shortcode = $(`#${this.shortcodeHandler}`);
    this.$shortcode.foundation('open');

    this.$shortcode.off('insert.zf.shortcode.reveal').on({
      'insert.zf.shortcode.reveal': this._shortcodeInsert.bind(this)
    });
  }

  /**
   * Inserts shortcode in the editor.
   * @param {Object} event - Event object passed from listener.
   * @param {Array} data - Shortcode configuration data.
   * @function
   * @private
   */
  _shortcodeInsert(event, data) {
    var item = '[]';

    console.log(data);
    this.editor.insertContent(item);
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
  'image media shortcode',
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
  // 'image',
  'media',
  'fullscreen'
];

TinyMceEditor.defaults = {
  menubar: false,
  branding: false,
  entity_encoding: 'raw',
  max_height: 800,
  min_height: 300,
  autoresize_bottom_margin: 20,
  autoresize_max_height: 800,
  autoresize_min_height: 300,
  plugins: TinyMceEditor.plugins.join(' '),
  toolbar: TinyMceEditor.toolbar.join(' | '),
  content_style: "html { padding: 0 .5rem }"
};

export {TinyMceEditor};
