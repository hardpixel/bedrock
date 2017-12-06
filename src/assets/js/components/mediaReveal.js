'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Reveal } from 'foundation-sites/js/foundation.reveal';

/**
 * MediaReveal module.
 * @module mediaReveal
 */

class MediaReveal extends Plugin {
  /**
   * Creates a new instance of an media-reveal.
   * @class
   * @name MediaReveal
   * @fires MediaReveal#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'MediaReveal'; // ie9 back compat
    this.$element = element;
    this.id = this.$element.attr('id');
    this.options = $.extend({}, MediaReveal.defaults, this.$element.data(), options);
    this.template = $(`#${this.id}-item-template`).html();
    this.items = [];
    this.selectedItems = [];
    this.reveal = new Foundation.Reveal(element, this.options);
    this.mediaUrl = this.options.mediaUrl;
    this.mediaKey = this.options.mediaKey;
    this.$insert = this.$element.find('[data-insert]');
    this.$grid = this.$element.find('[data-list-select]');
    this.$item = $(this.template);
    this.imageKey = this.$item.find('[data-src]').attr('data-src');
    this.imageUrl = this.$item.find('[data-url]').attr('data-url') || '[src]';
    this.titleKey = this.$item.find('[data-text]').attr('data-text');

    this._init();
    this._events();
  }

  /**
   * Initializes the media-reveal wrapper.
   * @function
   * @private
   */
  _init() {
    this.$insert.addClass('disabled');
  }

  /**
   * Adds event handlers to the media-reveal.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.reveal').on({
      'open.zf.reveal': this.open.bind(this),
      'closed.zf.reveal': this.close.bind(this)
    });

    this.$grid.off('changed.zf.select.list').on({
      'changed.zf.select.list': this.select.bind(this)
    });

    this.$insert.off('click').on({
      'click': this.insert.bind(this)
    });
  }

  /**
   * Gets media items JSON from url.
   * @function
   * @private
   */
  _getItems() {
    $.ajax(this.mediaUrl).done(function(response) {
      if (this.mediaKey) {
        response = this._getObjectValue(response, this.mediaKey);
      }

      this._appendItems(response);
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
   * Builds single attachment item.
   * @param {Object} data - Image data object to build item from.
   * @function
   * @private
   */
  _buildItem(data) {
    var item = this.$item.clone();
    var url = this._getObjectValue(data, this.imageKey);
    var title = this._getObjectValue(data, this.titleKey);

    item.find('[data-src]').attr('src', this.imageUrl.replace('[src]', url));
    item.find('[data-text]').text(title);
    item.data('imageObject', data);

    return item;
  }

  /**
   * Appends all attachment items to grid.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _appendItems(data) {
    $.each(data, function(index, data) {
      var item = this._buildItem(data)
      this.items.push(item);
    }.bind(this));

    this.$grid.append(this.items);
  }

  /**
   * Switches multi select mode.
   * @param {Boolean} enable - Enable/disable multiple mode.
   * @function
   */
  multiSelect(enable) {
    this.$grid.foundation('multiSelect', enable);
  }

  /**
   * Opens media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    this._getItems();

    if (!this.reveal.isActive) {
      this.reveal.open();
    }

    this.$element.trigger('open.zf.media.reveal');
  }

  /**
   * Closes media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  close(event) {
    this.items = [];
    this.selectedItems = [];

    if (this.reveal.isActive) {
      this.reveal.close();
    }

    this.$grid.empty();
    this.$grid.foundation('unselectAll');

    this.$element.trigger('closed.zf.media.reveal');
  }

  /**
   * Updates insert button and data on item selection.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} items - Items passed from listSelect element.
   * @private
   */
  select(event, items) {
    this.selectedItems = items;
    this.$element.trigger('changed.zf.media.reveal', [this.selectedItems]);

    if (items.length) {
      this.$insert.removeClass('disabled');
    } else {
      this.$insert.addClass('disabled');
    }
  }

  /**
   * Closes reveal and passes selected items objects.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  insert(event) {
    var items = [];

    $.each(this.selectedItems, function(index, item) {
      items.push($(item).data('imageObject'));
    });

    this.reveal.close();
    this.$element.trigger('insert.zf.media.reveal', [items]);
  }

  /**
   * Destroys the media-reveal plugin.
   * @function
   * @private
   */
  _destroy() {
    this.reveal.destroy();
    this.$element.off('.zf.reveal');
    this.$grid.off('changed.zf.select.list');
    this.$insert.off('click');
  }
}

MediaReveal.defaults = {};

export {MediaReveal};
