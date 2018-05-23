'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * AddMore module.
 * @module addMore
 */

class AddMore extends Plugin {
  /**
   * Creates a new instance of an add-more.
   * @class
   * @name AddMore
   * @fires AddMore#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'AddMore'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, AddMore.defaults, this.$element.data(), options);
    this.activeItems = [];

    this._init();
  }

  /**
   * Initializes the add-more wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.template = $(`#${this.id}-item-template`).html();
    this.$empty = this.$element.find('[data-empty-state]');
    this.$grid = this.$element.find('[data-list-remove]');
    this.$item = $(this.template);
    this.fieldName = this.$item.find('[data-value]').attr('name');
    this.$hidden = this.$element.find(`[name="${this.fieldName}"]`);
    this.required = this.$item.find('[data-value]').is('[required]');
    this.$anchor = $(`[data-add="${this.id}"]`);

    this._events();
    this._updateActiveItems();
  }

  /**
   * Adds event handlers to the add-more.
   * @function
   * @private
   */
  _events() {
    this.$grid.off('changed.zf.remove.list').on({
      'changed.zf.remove.list': this._updateActiveItems.bind(this)
    });

    this.$anchor.off('click.zf.add.more').on({
      'click.zf.add.more': this.add.bind(this)
    });
  }

  /**
   * Updates active items on changes.
   * @function
   * @private
   */
  _updateActiveItems() {
    this.activeItems = this.$grid.children().toArray();
    this.$element.trigger('changed.zf.add.more', [this.activeItems]);

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
   * Builds single item.
   * @param {Object} data - Image data object to build item from.
   * @function
   * @private
   */
  _buildItem(data) {
    var item = this.$item.clone();
    return item;
  }

  /**
   * Adds new blank item to the preview list.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  add(event) {
    var item = this._buildItem();

    this.$grid.append(item);
    item.foundation();

    this._updateActiveItems();
  }

  /**
   * Destroys the add-more plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.trigger');
    this.$grid.off('changed.zf.remove.list');
  }
}

AddMore.defaults = {};

export {AddMore};
