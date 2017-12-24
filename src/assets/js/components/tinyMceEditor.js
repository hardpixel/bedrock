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

    this.$media = $(`#${this.mediaHandler}`);
    this.$shortcode = $(`#${this.shortcodeHandler}`);

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
    var _this = this;

    this.editor = editor;
    this.shortcode = this.$shortcode.data('zfPlugin');

    editor.on('change', function (event) {
      editor.save();
      _this.$element.trigger('change');
    });

    editor.on('preInit', function () {
      editor.serializer.addAttributeFilter(
        'data-mce-shortcode',
        _this._shortcodeCleanup()
      );
    });

    editor.on('setContent', function (event) {
      _this._shortcodeSetup(event, editor);
    });

    editor.addButton('mark', {
      icon: 'backcolor',
      tooltip: 'Mark/unmark text',
      onclick: this._markButtonCallback.bind(this),
      onPostRender: function() {
        var _this = this;

        editor.on('NodeChange', function(e) {
          var isActive = $(editor.selection.getNode()).is('mark');
          _this.active(isActive);
        })
      }
    });

    if (this.mediaHandler) {
      editor.addButton('image', {
        icon: 'image',
        tooltip: 'Insert/edit media',
        onclick: this._mediaButtonCallback.bind(this),
        onPostRender: function() {
          var _this = this;

          editor.on('NodeChange', function(e) {
            var isActive = $(editor.selection.getNode()).hasClass('inline-image');
            _this.active(isActive);
          })
        }
      });
    }

    if (this.shortcodeHandler) {
      editor.addButton('shortcode', {
        icon: 'template',
        tooltip: 'Insert/edit shortcode',
        onclick: this._shortcodeButtonCallback.bind(this),
        onPostRender: function() {
          var _this = this;

          editor.on('NodeChange', function(e) {
            var isActive = $(editor.selection.getNode()).hasClass('shortcode-preview');
            _this.active(isActive);
          })
        }
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
    this.$media.foundation('open');

    this.$media.off('insert.zf.media.reveal').on({
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
      var item = '<img class="inline-image" src="' + this.mediaUrl.replace('[src]', url) + '" alt="' + alt + '" />';

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
    this.$shortcode.foundation('open');

    this.$shortcode.off('insert.zf.shortcode.reveal').on({
      'insert.zf.shortcode.reveal': this._shortcodeInsert.bind(this)
    });
  }

  /**
   * Builds shortcode preview markup.
   * @param {Object} event - Event object passed from listener.
   * @param {Array} data - Shortcode configuration data.
   * @function
   * @private
   */
  _shortcodePreview(snippet, shortcode, options) {
    var data = this.shortcode.getInfo(shortcode);

    if (data) {
      var label = data.label;
    } else {
      var label = shortcode;
    }

    var name = `<span class="shortcode-name">${label}</span>`;
    var preview = `<span class="shortcode-snippet">${snippet}</span>`;
    var item = `<span data-mce-shortcode class="shortcode-preview" contenteditable="false">${name}${preview}</span>`;

    return item;
  }

  /**
   * Clears shortcode markup.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} editor - Editor instance.
   * @function
   * @private
   */
  _shortcodeCleanup(event, editor) {
    return function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var text = node.lastChild;

        text.name = 'div';
        text.attr('class', 'shortcode');

        nodes[i].parent.replace(text);
      }
    };
  }

  /**
   * Replaces cleaned shortcodes to preview markup.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} editor - Editor instance.
   * @function
   * @private
   */
  _shortcodeSetup(event, editor) {
    if (this.shortcodeHandler) {
      editor.$('.shortcode').each(function (index, elm) {
        var $elm = editor.$(elm);
        var snippet = $elm.text();
        var shortcode = snippet.split(' ')[0].replace('[', '');
        var preview = this._shortcodePreview(snippet, shortcode);

        $elm.replaceWith(`<p>${preview}</p>`);
      }.bind(this));
    }
  }

  /**
   * Inserts shortcode in the editor.
   * @param {Object} event - Event object passed from listener.
   * @param {Array} data - Shortcode configuration data.
   * @function
   * @private
   */
  _shortcodeInsert(event, snippet, shortcode, options) {
    var preview = this._shortcodePreview(snippet, shortcode, options);
    this.editor.insertContent(`<p>${preview}</p>`);
  }

  /**
   * Custom mark button click callback.
   * @param {Object} event - Event passed from handler.
   * @function
   * @private
   */
  _markButtonCallback(event) {
    this.editor.formatter.toggle('mark');
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
  'blockquote shortcode link image bullist numlist mark',
  'alignleft aligncenter alignright',
  'formatselect removeformat pastetext',
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

TinyMceEditor.styles = `
  html {
    padding: 0 .5rem;
  }

  .shortcode-preview {
    display: inline-block;
    background: #f0f0f0;
    border: 1px dashed #cacaca;
    margin: 0;
    width: 100%;
  }

  .shortcode-name, .shortcode-snippet {
    display: inline-block;
    padding: .5rem 1rem;
    color: #888;
    white-space: nowrap;
    pointer-events: none;
    font-size: .8rem;
  }

  .shortcode-name {
    color: #555;
    font-weight: bold;
    border-right: 1px dashed #cacaca;
    text-transform: capitalize;
  }
`

TinyMceEditor.defaults = {
  menubar: false,
  branding: false,
  entity_encoding: 'raw',
  min_height: 300,
  autoresize_bottom_margin: 20,
  autoresize_min_height: 300,
  plugins: TinyMceEditor.plugins.join(' '),
  toolbar: TinyMceEditor.toolbar.join(' | '),
  content_style: TinyMceEditor.styles,
  formats: {
    mark: { inline: 'mark' }
  }
};

export {TinyMceEditor};
