'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * TableCheckbox module.
 * @module tableCheckbox
 */

class TableCheckbox extends Plugin {
  /**
   * Creates a new instance of an table-checkbox.
   * @class
   * @name TableCheckbox
   * @fires TableCheckbox#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'TableCheckbox'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, TableCheckbox.defaults, this.$element.data(), options);
    this.lastChecked = null;
    this.activeRows = [];
    this.changeMultiple = false;

    if (!this.$element.is('table')) {
      this.$element = this.$element.parents('table:first');
    }

    this._init();
    this._events();
  }

  /**
   * Initializes the table-checkbox wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.find('thead tr').each(function(index, el) {
      $(el).prepend('<th class="check table-checkbox-cell"><input type="checkbox" /></th>');
    });

    this.$element.find('tbody tr').each(function(index, el) {
      $(el).prepend('<td class="check table-checkbox-cell"><input type="checkbox" /></td>');
    });
  }

  /**
   * Adds event handlers to the table-checkbox.
   * @function
   * @private
   */
  _events() {
    this.$element.find('.table-checkbox-cell input').off('change').on({
      'change': this._triggerEvents.bind(this)
    });

    this.$element.find('td.table-checkbox-cell input').off('click').on({
      'click': this._handleClick.bind(this)
    });

    this.$element.find('th.table-checkbox-cell input').off('.zf.trigger').on({
      'check.zf.trigger': this.checkAll.bind(this),
      'uncheck.zf.trigger': this.uncheckAll.bind(this),
      'toggle.zf.trigger': this.toggleAll.bind(this)
    });

    this.$element.find('td.table-checkbox-cell input').off('.zf.trigger').on({
      'check.zf.trigger': this.check.bind(this),
      'uncheck.zf.trigger': this.uncheck.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this)
    });
  }

  /**
   * Triggers custom events on checkbox toggle.
   * @function
   * @private
   */
  _triggerEvents(event) {
    var target = $(event.target);

    if (target.is(':checked')) {
      target.trigger('check.zf.trigger');
    } else {
      target.trigger('uncheck.zf.trigger');
    }
  }

  /**
   * Handles click events on checkbox toggle.
   * @function
   * @private
   */
  _handleClick(event) {
    var row = $(event.target).parents('tr:first');
    var rows = this.$element.find('tbody tr');

    if (!this.lastChecked) {
      this.lastChecked = row;
      return;
    }

    if (event.shiftKey) {
      this.changeMultiple = true;

      var start = rows.index(row);
      var end = rows.index(this.lastChecked);
      var from = Math.min(start, end);
      var to = Math.max(start, end) + 1;
      var checked = this.lastChecked.find('input').is(':checked');
      var checkboxes = rows.slice(from, to).find('input');

      if (checked) {
        checkboxes.trigger('check.zf.trigger');
      } else {
        checkboxes.trigger('uncheck.zf.trigger');
      }

      this.changeMultiple = false;
    }

    this.lastChecked = row;
  }

  /**
   * Updates active rows on changes.
   * @function
   * @private
   */
  _updateActiveRows() {
    if (!this.changeMultiple) {
      this.activeRows = this.$element.find('tbody tr.active');
      this.$element.trigger('changed.zf.table.checkbox', [this.activeRows]);
    }
  }

  /**
   * Check all table checkboxes
   * @param {Object} event - Event object passed from listener.
   */
  checkAll(event) {
    this.changeMultiple = true;

    $(event.target).prop('checked', true);
    this.$element.find('td.table-checkbox-cell input').trigger('check.zf.trigger');

    this.changeMultiple = false;
    this._updateActiveRows();
  }

  /**
   * Uncheck all table checkboxes
   * @param {Object} event - Event object passed from listener.
   */
  uncheckAll(event) {
    this.changeMultiple = true;

    $(event.target).prop('checked', false);
    this.$element.find('td.table-checkbox-cell input').trigger('uncheck.zf.trigger');

    this.changeMultiple = false;
    this._updateActiveRows();
  }

  /**
   * Toggle all table checkboxes
   * @param {Object} event - Event object passed from listener.
   */
  toggleAll(event) {
    var target = $(event.target);

    if (target.is(':checked')) {
      target.trigger('uncheck.zf.trigger');
    } else {
      target.trigger('check.zf.trigger');
    }
  }

  /**
   * Check table checkbox
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  check(event) {
    var target = $(event.target);
    var parent = target.parents('tr:first');

    target.prop('checked', true);
    parent.addClass('active');

    if (!this.$element.find('td.table-checkbox-cell input:not(:checked)').length) {
      this.$element.find('th.table-checkbox-cell input').prop('checked', true);
    }

    this._updateActiveRows();
  }

  /**
   * Uncheck table checkbox
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  uncheck(event) {
    var target = $(event.target);
    var parent = target.parents('tr:first');

    target.prop('checked', false);
    parent.removeClass('active');

    this._updateActiveRows();
    this.$element.find('th.table-checkbox-cell input').prop('checked', false);
  }

  /**
   * Toggle table checkbox
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  toggle(event) {
    var target = $(event.target);

    if (target.is(':checked')) {
      target.trigger('uncheck.zf.trigger');
    } else {
      target.trigger('check.zf.trigger');
    }
  }

  /**
   * Destroys the table-checkbox plugin.
   * @function
   */
  _destroy() {
    this.$element.off('.zf.table.checkbox');

    this.$element.find('th.table-checkbox-cell').remove();
    this.$element.find('td.table-checkbox-cell').remove();
  }
}

TableCheckbox.defaults = {};

export {TableCheckbox};
