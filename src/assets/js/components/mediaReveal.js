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
    this.options = $.extend({}, MediaReveal.defaults, this.$element.data(), options);
    this.items = [];
    this.selectedItems = [];
    this.reveal = new Foundation.Reveal(element, this.options);
    this.mediaUrl = this.options.mediaUrl;
    this.mediaKey = this.options.mediaKey;
    this.$insert = this.$element.find('[data-insert]');
    this.$grid = this.$element.find('[data-list-select]');
    this.$item = this.$grid.find('[data-list-item]').detach();
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
      if (this.mediaKey)
        response = this._getObjectValue(response, this.mediaKey);

      this._appendItems(response);
    }.bind(this));
  }

  /**
   * Gets value from object by dot notation.
   * @function
   * @private
   */
  _getObjectValue(obj, path) {
    return new Function('_', 'return _.' + path)(obj);
  }

  /**
   * Builds single attachment item.
   * @function
   * @private
   */
  _buildItem(data) {
    var item = this.$item.clone();
    var url = this._getObjectValue(data, this.imageKey);
    var title = this._getObjectValue(data, this.titleKey);

    item.find('img').attr('src', this.imageUrl.replace('[src]', url));
    item.find('small').text(title);
    item.data('imageObject', data);

    return item;
  }

  /**
   * Appends all attachment items to grid.
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
   * Open media reveal
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    this._getItems();
    this.$element.trigger('open.zf.media.reveal');
  }

  /**
   * Close media reveal
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  close(event) {
    this.items = [];
    this.selectedItems = [];

    this.$grid.empty();
    this.$element.trigger('closed.zf.media.reveal');
  }

  /**
   * Select items
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  select(event, items) {
    this.selectedItems = items;
    this.$element.trigger('changed.zf.media.reveal', [this.selectedItems]);

    if (items.length)
      this.$insert.removeClass('disabled');
    else
      this.$insert.addClass('disabled');
  }

  /**
   * Insert items
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  insert(event) {
    var items = [];

    $.each(this.selectedItems, function(index, item) {
      items.push($(item).data('imageObject'));
    });

    this.$element.trigger('insert.zf.media.reveal', [items]);
  }

  /**
   * Destroys the media-reveal plugin.
   * @function
   */
  _destroy() {

  }
}

MediaReveal.defaults = {};

export {MediaReveal};
