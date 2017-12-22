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
    this.shortcodes = [];
    this.shortcodeNames = [];
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

    // this.$insert.addClass('disabled');

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

    this.$form.off('change', ':input:visible').on({
      'change': this._loadPreview.bind(this)
    }, ':input:visible');
  }

  /**
   * Gets shortcodes items JSON from url.
   * @function
   * @private
   */
  _getItems() {
    $.ajax(this.shortcodesUrl).done(function(response) {
      this.shortcodes = response;

      this._appendMenuItems(response);
      this._loadShortcode();
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

    this._getForm(this.activeShortcode);
    this._getPreview(this.activeShortcode);
  }

  /**
   * Loads preview with updated options.
   * @function
   * @private
   */
  _loadPreview(event) {
    var data = this.$form.find('form').serialize();
    this._getPreview(this.activeShortcode, data);
  }

  /**
   * Gets shortcode form from url.
   * @function
   * @private
   */
  _getForm(shortcode) {
    var url = this.formUrl.replace('[name]', shortcode);

    $.ajax(url).done(function(response) {
      this.$form.html(response);
      this.$form.foundation();
    }.bind(this));
  }

  /**
   * Gets shortcode preview from url.
   * @function
   * @private
   */
  _getPreview(shortcode, data) {
    var url = this.previewUrl.replace('[name]', shortcode);
    var frame = $('<iframe frameborder="0"></iframe>');

    $.ajax({url: url, data: data}).done(function(response) {
      this.$preview.html(frame);

      frame.on('load', function(event) {
        $(this).contents().find('html').html(response);
      });
    }.bind(this));
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
   * Appends all menu items to menu container.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _appendMenuItems(data) {
    this.items = [];
    this.shortcodeNames = [];

    var menu = $('<ul class="menu vertical icons icon-left"></ul>');
    this.clear();

    $.each(data, function(index, data) {
      var label = `<i class="${data.icon}"></i><span>${data.label}</span>`;
      var item = $(`<li><a data-name="${data.name}">${label}</a></li>`);

      this.shortcodeNames.push(data.name);
      this.items.push(item);
    }.bind(this));

    menu.html(this.items);
    this.$menu.html(menu);
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
      var name = groups[1];

      if ($.inArray(name, this.shortcodeNames) !== -1) {
        valid = true;
      }
    }.bind(this));

    return valid;
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

    // this.$element.trigger('open.zf.shortcode.reveal');
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
    var params = '';
    var items = {};
    var values = this.$form.find('form').serializeArray();

    $.each(values, function(index, object) {
      var key = object.name.replace('[]', '');

      if (/^.*\[\]$/.test(object.name)) {
        if (items[key]) {
          items[key] = `${items[key]},${object.value}`;
        } else {
          items[key] = object.value;
        }
      } else {
        items[key] = object.value;
      }
    });

    $.each(items, function(key, value) {
      if (value) {
        params += ` ${key}="${value}"`;
      }
    });

    var snippet = `[${this.activeShortcode} ${params}]`;

    this.reveal.close();
    this.$element.trigger('insert.zf.shortcode.reveal', [snippet]);
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
