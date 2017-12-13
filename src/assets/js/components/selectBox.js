'use strict';

import $ from 'jquery';
import Select2 from 'select2/dist/js/select2';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * SelectBox module.
 * @module selectBox
 */

class SelectBox extends Plugin {
  /**
   * Creates a new instance of an select-box.
   * @class
   * @name SelectBox
   * @fires SelectBox#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'SelectBox'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, SelectBox.defaults, this.$element.data(), options);

    if (this.options.list) {
      this.options['theme'] = 'list';
    }

    this._init();
  }

  /**
   * Initializes the select-box wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.select2(this.options);

    this.select2 = this.$element.data('select2');
    this.$container = this.select2.$container;

    this._events();
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {
    this.$element.off(['select2:select', 'select2:unselect']).on({
      'select2:select': this._handleEvent.bind(this),
      'select2:unselect': this._handleEvent.bind(this),
    });

    this.$element.off('.zf.trigger').on({
      'select.zf.trigger': this.select.bind(this),
      'unselect.zf.trigger': this.unselect.bind(this)
    });
  }

  /**
   * Keeps placeholder on search field.
   * @function
   * @private
   */
  _keepPlaceholder() {
    var search = this.$container.find('.select2-search__field');

    if ( search.length && this.options.list) {
      search.attr('placeholder', this.options.placeholder);
    }
  }

  /**
   * Handles events on element.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _handleEvent(event) {
    this.$element.trigger(event.type.replace('select2:', ''));
    this._keepPlaceholder();
  }

  /**
   * Selects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  select(event) {
    this.$element.trigger('changed.zf.select.list');
  }

  /**
   * Unselects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  unselect(event) {
    this.$element.trigger('changed.zf.select.list');
  }

  /**
   * Destroys the select-box plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.select2('destroy');;
    this.$element.off(['select2:select', 'select2:unselect']);
    this.$element.off('.zf.trigger');
  }
}

SelectBox.defaults = {};

export {SelectBox};
