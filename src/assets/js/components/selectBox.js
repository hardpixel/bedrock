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
    this.$dropdown = this.select2.$dropdown;

    this._events();
    this._keepPlaceholder();
    this._setIcons();
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {
    this.$element.off(['select2:select', 'select2:unselect', 'select2:open']).on({
      'select2:open': this._handleEvent.bind(this),
      'select2:select': this._handleEvent.bind(this),
      'select2:unselect': this._handleEvent.bind(this),
    });

    this.$element.off('.zf.trigger').on({
      'open.zf.trigger': this.open.bind(this),
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
   * Sets custom icons on multi select boxes.
   * @function
   * @private
   */
  _setIcons() {
    if (this.options.list) {
      var item = this.$container.find('.select2-selection__choice__remove');
      item.text('').addClass(this.options.removeIcon);
    }
  }

  /**
   * Updates position on dropdown.
   * @function
   * @private
   */
  _updatePosition() {
    var search   = this.$container.find('.select2-search__field');
    var dropdown = this.$dropdown.find('.select2-dropdown');

    if ( search.length && this.options.list) {
      if (dropdown.hasClass('select2-dropdown--above')) {
        var position = this.$container.innerHeight() - search.outerHeight();
        dropdown.css('margin-top', position);
      } else {
        dropdown.css('margin-top', false);
      }
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
    this._setIcons();
  }

  /**
   * Opens the select dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  open(event) {
    this._updatePosition();
    this.$element.trigger('open.zf.select.box');
  }

  /**
   * Selects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  select(event) {
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Unselects a list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  unselect(event) {
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Destroys the select-box plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.select2('destroy');
    this.$element.off(['select2:select', 'select2:unselect', 'select2:open']);
    this.$element.off('.zf.trigger');
  }
}

SelectBox.defaults = {
  removeIcon: 'mdi mdi-close'
};

export {SelectBox};
