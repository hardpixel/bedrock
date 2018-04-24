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
    this.multiple = this.options.listSelectMultiple;
    this.lastSelected = null;
    this.activeItems = [];
    this.selectMultiple = false;

    this._init();
    this._events();
  }

  /**
   * Initializes the list-select wrapper.
   * @function
   * @private
   */
  _init() {

  }

  /**
   * Adds event handlers to the list-select.
   * @function
   * @private
   */
  _events() {
    this.$element.off('click', '[data-list-item]').on({
      'click': this._handleClick.bind(this)
    }, '[data-list-item]');

    this.$element.off('.zf.trigger', '[data-list-item]').on({
      'selectAll.zf.trigger': this.selectAll.bind(this),
      'unselectAll.zf.trigger': this.unselectAll.bind(this),
      'select.zf.trigger': this.select.bind(this),
      'unselect.zf.trigger': this.unselect.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this)
    }, '[data-list-item]');
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
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _handleClick(event) {
    var item = $(event.currentTarget);
    var items = this.$element.find('[data-list-item]');

    if (!this.multiple || !this.lastSelected || !event.shiftKey) {
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
      this._updateActiveItems();
    }

    this.lastSelected = item;
  }

  /**
   * Switches multi select mode.
   * @param {Boolean} enable - Enable/disable multiple mode.
   * @function
   */
  multiSelect(enable) {
    this.multiple = enable;
    this.unselectAll();
  }

  /**
   * Selects all list items.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  selectAll(event) {
    this.$element.find('[data-list-item]').addClass('is-active');
    this._updateActiveItems();
  }

  /**
   * Unselects all list items.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  unselectAll(event) {
    this.$element.find('[data-list-item]').removeClass('is-active');
    this._updateActiveItems();
  }

  /**
   * Selects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  select(event) {
    var target = $(event.currentTarget);

    if (!this.multiple) {
      target.siblings().removeClass('is-active');
    }

    target.addClass('is-active');
    this.$element.trigger('selected.zf.select.list', [target]);
    this._updateActiveItems();
  }

  /**
   * Unselects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  unselect(event) {
    var target = $(event.currentTarget);

    target.removeClass('is-active');
    this.$element.trigger('unselected.zf.select.list', [target]);
    this._updateActiveItems();
  }

  /**
   * Toggles a list item selection.
   * @param {Object} event - Event object passed from listener.
   * @function
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
   * @private
   */
  _destroy() {
    this.$element.off('.zf.select.list');
    this.$element.off('click', '[data-list-item]')
    this.$element.off('.zf.trigger', '[data-list-item]');
  }
}

ListSelect.defaults = {};

export {ListSelect};
