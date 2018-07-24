'use strict';

import $ from 'jquery';
import { GetOrSetId, GetObjectValue } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Sticky } from 'foundation-sites/js/foundation.sticky';

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
    if (tinymce !== 'undefined') {
      this.$element.wrap('<div class="tiny-mce-editor"></div>');

      this.$media = $(`#${this.mediaHandler}`);
      this.$shortcode = $(`#${this.shortcodeHandler}`);

      this.id = GetOrSetId(this.$element, 'tme');
      this.$wrapper = this.$element.parents('.tiny-mce-editor:first');
      this.computed = { target: this.$element.get(0), setup: this._setupCallback.bind(this) };
      this.options = $.extend({}, this.options, this.computed);
      this.options = this._snakeCase(this.options);

      tinymce.init(this.options);
      this._events();
    } else {
      console.log('TinyMCE is not available! Please download and install TinyMCE.');
    }
  }

  /**
   * Adds event handlers to the tinymce-editor.
   * @function
   * @private
   */
  _events() {
    $(document).on({
      'scroll': this._stickyToolbar.bind(this)
    });
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
   * Make editor toolbar sticky.
   * @function
   * @private
   */
  _stickyToolbar() {
    var toolbar = this.$wrapper.find('.mce-top-part:first');
    var buttons = toolbar.find('.mce-container-body:first');
    var offset = this.$wrapper.offset().top;
    var height = this.$wrapper.height();
    var position = $(document).scrollTop();
    var limit = position > (offset + height - 100);

    buttons.addClass('sticky');

    if (position > offset && !limit) {
      toolbar.css('height', toolbar.height());
      buttons.css('width', toolbar.width());

      buttons.addClass('is-stuck');
    } else {
      buttons.removeClass('is-stuck');

      toolbar.css('height', '');
      buttons.css('width', '');
    }
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

    if (this.$media.length) {
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

    if (this.$shortcode.length) {
      editor.addButton('shortcode', {
        icon: 'template',
        tooltip: 'Insert/edit shortcode',
        onclick: this._shortcodeButtonCallback.bind(this),
        onPostRender: function() {
          var _this = this;

          editor.on('NodeChange', function(e) {
            var isActive = $(editor.selection.getNode()).hasClass('mce-shortcode-preview');
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
    this.$media.addClass('mce-in');

    this.$media.off('insert.zf.media.reveal').on({
      'insert.zf.media.reveal': this._mediaInsert.bind(this)
    });

    this.$media.foundation('open');
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
      var url = GetObjectValue(data, this.mediaSrc);
      var alt = GetObjectValue(data, this.mediaAlt);
      var item = '<img class="inline-image" src="' + this.mediaUrl.replace('[src]', url) + '" alt="' + alt + '" />';

      this.editor.insertContent(item);
    }.bind(this));

    this.$media.removeClass('mce-in');
  }

  /**
   * Custom shortcode button click callback.
   * @param {Object} event - Event passed from handler.
   * @function
   * @private
   */
  _shortcodeButtonCallback(event) {
    this.$shortcode.addClass('mce-in');

    this.activeShortcode = this.editor.selection.getNode();
    this.$activeShortcode = $(this.activeShortcode);

    var snippet = this.$activeShortcode.find('.mce-shortcode-snippet').text();
    this.shortcode.setSnippet(snippet);

    this.$shortcode.off('insert.zf.shortcode.reveal').on({
      'insert.zf.shortcode.reveal': this._shortcodeInsert.bind(this)
    });

    this.$shortcode.foundation('open');
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

    var name = `<span class="mce-shortcode-name">${label}</span>`;
    var preview = `<span class="mce-shortcode-snippet">${snippet}</span>`;
    var item = `<span data-mce-shortcode class="mce-shortcode-preview" contenteditable="false">${name}${preview}</span>`;

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
    var selected = this.$activeShortcode.hasClass('mce-shortcode-preview');

    if (selected) {
      this.editor.$(this.activeShortcode).replaceWith(preview);
    } else {
      this.editor.insertContent(`<p>${preview}</p>`);
    }

    this.$shortcode.removeClass('mce-in');
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
    padding: 1rem;
  }

  body, html {
    background: white;
    margin: 0;
    font-size: 100%;
  }

  .mce-shortcode-preview {
    display: inline-block;
    background: #f0f0f0;
    border: 1px dashed #cacaca;
    margin: 0;
    width: 100%;
  }

  .mce-shortcode-name, .mce-shortcode-snippet {
    display: inline-block;
    padding: .5rem 1rem;
    color: #888;
    white-space: nowrap;
    pointer-events: none;
    font-size: .8rem;
  }

  .mce-shortcode-name {
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
  invalid_elements: 'br',
  formats: {
    mark: { inline: 'mark' }
  }
};

export {TinyMceEditor};
