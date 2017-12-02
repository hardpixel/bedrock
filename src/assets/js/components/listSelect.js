'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * ListSelect module.
 * @module listSelect
 */

class ListSelect extends Plugin {
  /**
   * Creates a new instance of an list-select.
   * @class
   * @name ListSelect
   * @fires ListSelect#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'ListSelect'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, ListSelect.defaults, this.$element.data(), options);
    this.lastSelected = null;
    this.activeItems = [];
    this.selectMultiple = false;

    this._events();
  }

  /**
   * Adds event handlers to the list-select.
   * @function
   * @private
   */
  _events() {
    this.$element.find('[data-list-item]').off('click').on({
      'click': this._handleClick.bind(this)
    });

    this.$element.find('[data-list-item]').off('.zf.trigger').on({
      'select.zf.trigger': this.select.bind(this),
      'unselect.zf.trigger': this.unselect.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this)
    });
  }

  /**
   * Updates active items on changes.
   * @function
   * @private
   */
  _updateActiveItems() {
    if (!this.selectMultiple) {
      this.activeItems = this.$element.find('.is-active');
      this.$element.trigger('changed.zf.select.list', [this.activeItems]);
    }
  }

  /**
   * Handles click events on items.
   * @function
   * @private
   */
  _handleClick(event) {
    var item = $(event.currentTarget);
    var items = this.$element.find('[data-list-item]');

    if (!this.options.listSelectMultiple || !this.lastSelected || !event.shiftKey) {
      this.lastSelected = item;
      this.toggle(event);
      return;
    }

    if (event.shiftKey) {
      this.selectMultiple = true;

      var start = items.index(item);
      var end = items.index(this.lastSelected);
      var from = Math.min(start, end);
      var to = Math.max(start, end) + 1;
      var active = this.lastSelected.is('.is-active');
      var siblings = items.slice(from, to);

      if (active) {
        siblings.trigger('select.zf.trigger');
      } else {
        siblings.trigger('unselect.zf.trigger');
      }

      this.selectMultiple = false;
    }

    this.lastSelected = item;
  }

  /**
   * Select list item
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  select(event) {
    var target = $(event.currentTarget);

    if (!this.options.listSelectMultiple) {
      target.siblings().removeClass('is-active');
    }

    target.addClass('is-active');
    this._updateActiveItems();
  }

  /**
   * Unselect list item
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  unselect(event) {
    var target = $(event.currentTarget);

    target.removeClass('is-active');
    this._updateActiveItems();
  }

  /**
   * Toggle list item
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  toggle(event) {
    var target = $(event.currentTarget);

    if (target.is('.is-active')) {
      target.trigger('unselect.zf.trigger');
    } else {
      target.trigger('select.zf.trigger');
    }
  }

  /**
   * Destroys the list-select plugin.
   * @function
   */
  _destroy() {
    this.$element.off('.zf.select.list');
    this.$element.find('[data-list-item]').off('click').off('.zf.trigger');
  }
}

ListSelect.defaults = {};

export {ListSelect};
