'use strict';

import $ from 'jquery';
import { GetOrSetId, GetObjectValue, MatchMimeType } from './helpers';
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
    this.$dropzone = this.$element.find('[data-dropzone-upload]');
    this.options = $.extend({}, MediaReveal.defaults, this.$element.data(), options);
    this.reveal = new Foundation.Reveal(element, this.options);
    this.items = [];
    this.selectedItems = [];

    this._init();
  }

  /**
   * Initializes the media-reveal wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'mrv');
    this.template = $(`#${this.id}-item-template`).html();
    this.mediaUrl = this.options.mediaUrl;
    this.mediaKey = this.options.mediaKey;
    this.uniqueKey = this.options.uniqueKey || 'id';
    this.$insert = this.$element.find('[data-insert]');
    this.$grid = this.$element.find('[data-list-select]');
    this.$item = $(this.template);

    this.$insert.addClass('disabled');

    this._events();
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

    this.$dropzone.off('.zf.dropzone.upload').on({
      'queuecomplete.zf.dropzone.upload': this._uploadComplete.bind(this)
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
        response = GetObjectValue(response, this.mediaKey);
      }

      this._appendItems(response);
    }.bind(this));
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
    var fnameKey = this.$item.find('[data-filename]').attr('data-filename');

    var item = this.$item.clone();
    var key = GetObjectValue(data, this.uniqueKey);
    var url = GetObjectValue(data, mediumKey, mediumAltKey);
    var title = GetObjectValue(data, titleKey);
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
    item.data('imageObject', data);
    item.data('uniqueKey', key);

    return item;
  }

  /**
   * Appends all attachment items to grid.
   * @param {Array} data - Collection of image data objects to build items from.
   * @function
   * @private
   */
  _appendItems(data) {
    this.clear();

    $.each(data, function(index, data) {
      var item = this._buildItem(data);
      if (item) this.items.push(item);
    }.bind(this));

    this.$grid.html(this.items);
  }

  /**
   * Switches ui elements when uploads are completed.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _uploadComplete(event) {
    var tabs = this.$element.find('[data-tabs]');
    var tab  = this.$grid.parents('.tabs-panel:first');

    tabs.foundation('selectTab', tab);
    this.$grid.empty();

    this.items = [];
    this._getItems();

    this.$dropzone.foundation('clear');
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
   * Clears media modal items and selected items.
   * @function
   */
  clear() {
    this.items = [];
    this.selectedItems = [];

    this.$grid.empty();
    this.$grid.foundation('unselectAll');
  }

  /**
   * Opens media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    if (!this.reveal.isActive) {
      this.reveal.open();
    }

    setTimeout(this._getItems.bind(this), 300);
    this.$element.trigger('open.zf.media.reveal');
  }

  /**
   * Closes media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  close(event) {
    if (this.reveal.isActive) {
      this.reveal.close();
    }

    this.$element.trigger('closed.zf.media.reveal');
    this.clear();
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
    this.$dropzone.off('.zf.dropzone.upload');
  }
}

MediaReveal.defaults = {};

export {MediaReveal};
