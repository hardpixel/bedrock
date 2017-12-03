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

    this._init();
    this._events();
  }

  /**
   * Initializes the list-remove wrapper.
   * @function
   * @private
   */
  _init() {

  }

  /**
   * Adds event handlers to the list-remove.
   * @function
   * @private
   */
  _events() {
    this.$element.off('click', '[data-remove]').on({
      'click': this._handleClick.bind(this)
    }, '[data-remove]');

    this.$element.off('.zf.trigger', '[data-list-item]').on({
      'removeAll.zf.trigger': this.removeAll.bind(this),
      'remove.zf.trigger': this.remove.bind(this)
    }, '[data-list-item]');
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
   * Removes all list items.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  removeAll(event) {
    this.$element.find('[data-list-item]').remove();
    this._updateActiveItems();
  }

  /**
   * Removes a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  remove(event) {
    $(event.currentTarget).remove();
    this._updateActiveItems();
  }

  /**
   * Destroys the list-remove plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.remove.list');
    this.$element.off('click', '[data-remove]');
    this.$element.off('.zf.trigger', '[data-list-item]');
  }
}

ListRemove.defaults = {};

export {ListRemove};
