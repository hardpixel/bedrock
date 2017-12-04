'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Triggers } from 'foundation-sites/js/foundation.util.triggers';

/**
 * MediaAttach module.
 * @module mediaAttach
 */

class MediaAttach extends Plugin {
  /**
   * Creates a new instance of an media-attach.
   * @class
   * @name MediaAttach
   * @fires MediaAttach#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'MediaAttach'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, MediaAttach.defaults, this.$element.data(), options);
    this.multiple = this.options.mediaMultiple;
    this.activeItems = [];

    this._init();
    Triggers.init($);
  }

  /**
   * Initializes the media-attach wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.template = $(`#${this.id}-item-template`).html();
    this.$empty = this.$element.find('.no-content');
    this.$grid = this.$element.find('[data-list-remove]');
    this.$item = $(this.template);
    this.$reveal = $(`#${this.options.mediaAttach}`);
    this.$anchor = $(`[data-open="${this.id}"]`).length ? $(`[data-open="${this.id}"]`) : $(`[data-toggle="${this.id}"]`);
    this.imageKey = this.$item.find('[data-src]').attr('data-src');
    this.imageUrl = this.$item.find('[data-url]').attr('data-url') || '[src]';
    this.titleKey = this.$item.find('[data-text]').attr('data-text');
    this.valueKey = this.$item.find('[data-value]').attr('data-value');

    this._events();
    this._updateActiveItems();
  }

  /**
   * Adds event handlers to the media-attach.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.trigger').on({
      'open.zf.trigger': this.open.bind(this)
    });

    this.$grid.off('changed.zf.remove.list').on({
      'changed.zf.remove.list': this._updateActiveItems.bind(this)
    });
  }

  /**
   * Updates active items on changes.
   * @function
   * @private
   */
  _updateActiveItems() {
    this.activeItems = this.$grid.children().toArray();
    this.$element.trigger('changed.zf.media.attach', [this.activeItems]);

    if (this.activeItems.length > 0) {
      this.$empty.addClass('hide');
    } else {
      this.$empty.removeClass('hide');
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
   * Builds single attachment item.
   * @param {Object} data - Image data object to build item from.
   * @function
   * @private
   */
  _buildItem(data) {
    var item = this.$item.clone();
    var url = this._getObjectValue(data, this.imageKey);
    var title = this._getObjectValue(data, this.titleKey);
    var value = this._getObjectValue(data, this.valueKey);

    item.find('img').attr('src', this.imageUrl.replace('[src]', url));
    item.find('small').text(title);
    item.find('input').val(value);

    return item;
  }

  /**
   * Appends all attachment items to grid.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _appendItems(data) {
    var items = [];

    $.each(data, function(index, data) {
      var item = this._buildItem(data)
      items.push(item);
    }.bind(this));

    this.$grid.append(items);
    this._updateActiveItems();
  }

  /**
   * Opens media reveal to select attachments.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    this.$reveal.foundation('multiSelect', this.multiple);
    this.$reveal.foundation('open');

    this.$reveal.off('insert.zf.media.reveal').on({
      'insert.zf.media.reveal': this.attach.bind(this)
    });
  }

  /**
   * Opens media reveal to select attachments.
   * @param {Object} event - Event object passed from listener.
   * @param {Array} data - Collection of image data objects to build items from.
   * @private
   */
  attach(event, data) {
    this._appendItems(data);
  }

  /**
   * Destroys the media-attach plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.trigger');
    this.$reveal.off('insert.zf.media.reveal');
    this.$grid.off('changed.zf.remove.list');
  }
}

MediaAttach.defaults = {};

export {MediaAttach};
