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

    this.$element.off('click', 'a[data-name]').on({
      'click': this._loadShortcode.bind(this)
    }, 'a[data-name]');
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
   * Gets shortcodes items JSON from url.
   * @function
   * @private
   */
  _loadShortcode(event) {
    if (event) {
      this.activeShortcode = $(event.currentTarget).attr('data-name');
    } else {
      this.activeShortcode = this.$menu.find('a[data-name]:first').attr('data-name');
    }

    this._getForm(this.activeShortcode);
    this._getPreview(this.activeShortcode);
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
  _getPreview(shortcode) {
    var url = this.previewUrl.replace('[name]', shortcode);
    var frame = $('<iframe frameborder="0"></iframe>');

    $.ajax(url).done(function(response) {
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
    this.clear();

    $.each(data, function(index, data) {
      var item = $(`<li><a data-name="${data.name}"><i class="${data.icon}"></i><span>${data.label}</span></a></li>`);
      this.items.push(item);
    }.bind(this));

    var menu = $('<ul class="menu vertical icons icon-left"></ul>');
    menu.html(this.items);

    this.$menu.html(menu);
  }

  /**
   * Clears shortcode reveal state.
   * @function
   */
  clear() {
    this.items = [];
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
    var items = [];

    this.reveal.close();
    this.$element.trigger('insert.zf.shortcode.reveal', [items]);
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
