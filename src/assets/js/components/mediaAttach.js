'use strict';

import $ from 'jquery';
import { GetOrSetId, GetObjectValue, MatchMimeType } from './helpers';
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
    this.id = GetOrSetId(this.$element, 'mda');
    this.template = $(`#${this.id}-item-template`).html();
    this.$empty = this.$element.find('[data-empty-state]');
    this.$grid = this.$element.find('[data-list-remove]');
    this.$item = $(this.template);
    this.$reveal = $(`#${this.options.mediaAttach}`);
    this.$anchor = $(`[data-open="${this.id}"]`).length ? $(`[data-open="${this.id}"]`) : $(`[data-toggle="${this.id}"]`);
    this.fieldName = this.$item.find('[data-value]').attr('name');
    this.$hidden = this.$element.find(`[name="${this.fieldName}"]`);
    this.required = this.$item.find('[data-value]').is('[required]');

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
      this.$hidden.removeAttr('required');
    } else {
      if (this.required) {
        this.$hidden.attr('required', 'required');
      }

      this.$empty.removeClass('hide');
    }

    this.$hidden.trigger('change');
  }

  /**
   * Builds single attachment item.
   * @param {Object} data - Image data object to build item from.
   * @function
   * @private
   */
  _buildItem(data) {
    var mediumKey = this.$item.find('[data-src]').attr('data-src');
    var mediumAltKey = this.$item.find('[data-src-alt]').attr('data-src-alt');
    var mediumUrl = this.$item.find('[data-url]').attr('data-url') || '[src]';
    var titleKey = this.$item.find('[data-text]').attr('data-text');
    var valueKey = this.$item.find('[data-value]').attr('data-value');
    var fnameKey = this.$item.find('[data-filename]').attr('data-filename');

    var item = this.$item.clone();
    var url = GetObjectValue(data, mediumKey, mediumAltKey);
    var title = GetObjectValue(data, titleKey);
    var value = GetObjectValue(data, valueKey);
    var fname = GetObjectValue(data, fnameKey);
    var previews = item.find('[data-mime-match]');

    if (previews.length) {
      var find = fname || url;
      var match = null;

      previews.each(function(index, el) {
        var regex = $(el).attr('data-mime-match');

        if (match == null && MatchMimeType(find, regex)) {
          match = regex;
        }
      });

      item.find(`[data-mime-match]:not([data-mime-match="${match}"])`).remove();
    }

    if (url) {
      var mediumSrc = mediumUrl.replace('[src]', url);

      if (previews.length) {
        item.find('[data-replace="src"]').attr('src', mediumSrc);
      } else {
        item.find('[data-src]').attr('src', mediumSrc);
      }
    }

    item.find('[data-text]').text(title);
    item.find('[data-value]').val(value);

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

    if (this.multiple) {
      this.$grid.append(items);
    } else {
      this.$grid.html(items);
    }

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
