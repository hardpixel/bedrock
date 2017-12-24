'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Reveal } from 'foundation-sites/js/foundation.reveal';

/**
 * ShortcodeReveal module.
 * @module shortcodeReveal
 */

class ShortcodeReveal extends Plugin {
  /**
   * Creates a new instance of an shortcode-reveal.
   * @class
   * @name ShortcodeReveal
   * @fires ShortcodeReveal#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'ShortcodeReveal'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, ShortcodeReveal.defaults, this.$element.data(), options);
    this.reveal = new Foundation.Reveal(element, this.options);
    this.shortcodes = {};
    this.items = [];
    this.activeShortcode = null;

    this._init();
  }

  /**
   * Initializes the shortcode-reveal wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.$menu = this.$element.find('[data-menu]');
    this.$form = this.$element.find('[data-form]');
    this.$preview = this.$element.find('[data-preview]');
    this.$insert = this.$element.find('[data-insert]');
    this.shortcodesUrl = this.options.shortcodesUrl;
    this.formUrl = this.options.formUrl;
    this.previewUrl = this.options.previewUrl;
    this.formParams = '';

    this.$insert.addClass('disabled');

    this._getItems();
    this._events();
  }

  /**
   * Adds event handlers to the shortcode-reveal.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.reveal').on({
      'open.zf.reveal': this.open.bind(this),
      'closed.zf.reveal': this.close.bind(this)
    });

    this.$insert.off('click').on({
      'click': this.insert.bind(this)
    });

    this.$menu.off('click', '[data-name]').on({
      'click': this._loadShortcode.bind(this)
    }, '[data-name]');

    this.$form.off('input change', ':input').on({
      'input': this._loadPreview.bind(this),
      'change': this._loadPreview.bind(this)
    }, ':input');
  }

  /**
   * Gets shortcodes items JSON from url.
   * @function
   * @private
   */
  _getItems() {
    this.shortcodes = {};

    $.ajax(this.shortcodesUrl).done(function(response) {
      $.each(response, function(index, el) {
        this.shortcodes[el.name] = el;
      }.bind(this));

      this._appendMenuItems(response);

      if (this.reveal.isActive) {
        this.$menu.find('[data-name]:first').click();
      }
    }.bind(this));
  }

  /**
   * Loads shortcode with updated options.
   * @function
   * @private
   */
  _loadShortcode(event) {
    if (event) {
      this.activeShortcode = $(event.currentTarget).attr('data-name');
    } else {
      this.activeShortcode = this.$menu.find('[data-name]:first').attr('data-name');
    }

    this.$menu.find('li').removeClass('is-active');
    this.$menu.find(`li a[data-name="${this.activeShortcode}"]`).parent().addClass('is-active');

    this._getForm(this.activeShortcode);
  }

  /**
   * Loads preview with updated options.
   * @function
   * @private
   */
  _loadPreview(event) {
    var data = this.$form.find('form').serialize();

    if (event && event.type == 'change' && data != this.formValues) {
      this.formValues = data;
      this._getPreview(this.activeShortcode);
    }

    this._toggleInsert();
  }

  /**
   * Gets shortcode form from url.
   * @function
   * @private
   */
  _getForm(shortcode) {
    var url = this.formUrl.replace('[name]', shortcode);

    this.formValues = null;
    this.$form.html('');

    $.ajax(url).done(function(response) {
      this.$form.html(response);
      this.$form.foundation();

      this.$form.find('form').on('submit', function(event) {
        event.preventDefault();
      });

      this.formValues = this.$form.find('form').serialize();
      this._loadPreview();
    }.bind(this));
  }

  /**
   * Gets shortcode preview from url.
   * @function
   * @private
   */
  _getPreview(shortcode) {
    this.$preview.html('');

    var height = 320;
    var snippet = encodeURIComponent(this._buildShortcode(shortcode));
    var url = this.previewUrl.replace('[name]', shortcode);
    var frame = $(`<iframe frameborder="0" src="${url}?shortcode=${snippet}"></iframe>`);
    var styles = `
      html, body {
        background: transparent !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      #shortcode-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 800px;
        min-width: 400px;
        margin: auto;
      }
    `;

    this.$preview.html(frame);
    frame.css('opacity', 0);

    frame.on('load', function(event) {
      var content = frame.contents();
      var preview = content.find('body');

      content.find('head').append(`<style>${styles}</style>`);

      setTimeout(function () {
        height = preview.outerHeight();

        frame.css('min-height', height);
        frame.css('opacity', 1);
      }, 500);
    });
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
   * Toggles insert button if form is valid.
   * @function
   * @private
   */
  _toggleInsert() {
    if (this.formValid()) {
      this.$insert.removeClass('disabled');
    } else {
      this.$insert.addClass('disabled');
    }
  }

  /**
   * Appends all menu items to menu container.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _appendMenuItems(data) {
    this.items = [];

    var menu = $('<ul class="menu vertical icons icon-left"></ul>');
    this.clear();

    $.each(data, function(index, data) {
      var label = `<i class="${data.icon}"></i><span>${data.label}</span>`;
      var item = $(`<li><a data-name="${data.name}">${label}</a></li>`);

      this.items.push(item);
    }.bind(this));

    menu.html(this.items);
    this.$menu.html(menu);
  }

  /**
   * Parses form values into key/value object.
   * @function
   * @private
   */
  _getValues() {
    var options = {};
    var form = this.$form;
    var values = form.find('form').serializeArray();

    $.each(values, function(index, object) {
      var input = form.find(`[name="${object.name}"][data-attribute]`);
      var key = input.attr('data-attribute');

      if (key) {
        if (/^.*\[\]$/.test(object.name)) {
          if (options[key]) {
            options[key] = `${options[key]},${object.value}`;
          } else {
            options[key] = object.value;
          }
        } else {
          options[key] = object.value;
        }
      }
    });

    return options;
  }

  /**
   * Builds shortcode string.
   * @function
   * @private
   */
  _buildShortcode(name, values) {
    var params = '';

    if (!values) {
      values = this._getValues();
    }

    if (values) {
      $.each(values, function(key, value) {
        if (value) {
          params += ` ${key}="${value}"`;
        }
      });

      return `[${name}${params}]`;
    } else {
      return '';
    }
  }

  /**
   * Checks if form is valid to insert shortcode
   * @function
   */
  formValid() {
    var valid = true;
    var required = this.$form.find(':input[required]');

    $.each(required, function(index, el) {
      if (!$(el).val()) {
        valid = false;
      }
    });

    return valid;
  }

  /**
   * Checks if string has valid shortcode
   * @function
   */
  isValid(string) {
    var regex = /\[(\w+) (.+?)\]/g;
    var matches = string.match(regex);
    var valid = false;

    $.each(matches, function(index, match) {
      var groups = regex.exec(match);

      if (groups && this.shortcodes[groups[1]]) {
        valid = true;
      }
    }.bind(this));

    return valid;
  }

  /**
   * Gets shortcode extended information
   * @function
   */
  getInfo(shortcode) {
    return this.shortcodes[shortcode];
  }

  /**
   * Clears shortcode reveal state.
   * @function
   */
  clear() {
    this.$menu.html('');
    this.$form.html('');
    this.$preview.html('');
  }

  /**
   * Opens shortcode reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    this._getItems();

    if (!this.reveal.isActive) {
      this.reveal.open();
    }

    this.$element.trigger('open.zf.shortcode.reveal');
  }

  /**
   * Closes shortcode reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  close(event) {
    if (this.reveal.isActive) {
      this.reveal.close();
    }

    this.$element.trigger('closed.zf.shortcode.reveal');
    this.clear();
  }

  /**
   * Closes reveal and passes selected items objects.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  insert(event) {
    var values = this._getValues();
    var active = this.activeShortcode;
    var snippet = this._buildShortcode(active, values);

    this.reveal.close();
    this.$element.trigger('insert.zf.shortcode.reveal', [snippet, active, values]);
  }

  /**
   * Destroys the shortcode-reveal plugin.
   * @function
   * @private
   */
  _destroy() {
    this.reveal.destroy();
    this.$element.off('.zf.reveal');
    this.$insert.off('click');
  }
}

ShortcodeReveal.defaults = {};

export {ShortcodeReveal};
