'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * ListRemove module.
 * @module listRemove
 */

class ListRemove extends Plugin {
  /**
   * Creates a new instance of an list-remove.
   * @class
   * @name ListRemove
   * @fires ListRemove#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'ListRemove'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, ListRemove.defaults, this.$element.data(), options);
    this.activeItems = [];

    this._events();
  }

  /**
   * Adds event handlers to the list-remove.
   * @function
   * @private
   */
  _events() {
    this.$element.find('[data-remove]').off('click').on({
      'click': this._handleClick.bind(this)
    });

    this.$element.find('[data-list-item]').off('.zf.trigger').on({
      'remove.zf.trigger': this.select.bind(this)
    });
  }

  /**
   * Updates active items on changes.
   * @function
   * @private
   */
  _updateActiveItems() {
    this.activeItems = this.$element.find('[data-list-item]');
    this.$element.trigger('changed.zf.remove.list', [this.activeItems]);
  }

  /**
   * Handles click events on items.
   * @function
   * @private
   */
  _handleClick(event) {
    var target = $(event.currentTarget).parents('[data-list-item]:first');
    target.trigger('remove.zf.trigger');
  }

  /**
   * Remove list item
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  remove(event) {
    $(event.currentTarget).remove();
    this._updateActiveItems();
  }

  /**
   * Destroys the list-remove plugin.
   * @function
   */
  _destroy() {
    this.$element.off('.zf.remove.list');
    this.$element.find('[data-remove]').off('click');
    this.$element.find('[data-list-item]').off('.zf.trigger');
  }
}

ListRemove.defaults = {};

export {ListRemove};
