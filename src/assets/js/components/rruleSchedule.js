'use strict';

import $ from 'jquery';
import { GetOrSetId } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var RRuleSet = require('rrule').RRuleSet;

/**
 * RruleSchedule module.
 * @module rruleSchedule
 */

class RruleSchedule extends Plugin {
  /**
   * Creates a new instance of an rrule-schedule.
   * @class
   * @name RruleSchedule
   * @fires RruleSchedule#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'RruleSchedule'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, RruleSchedule.defaults, this.$element.data(), options);
    this.rruleSet = new RRuleSet();

    this._init();
  }

  /**
   * Initializes the rrule-schedule wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'rrs');
    this.template = $(`#${this.id}-item-template`).html();
    this.$empty = this.$element.find('[data-empty-state]');
    this.$grid = this.$element.find('[data-list-remove]');
    this.$item = $(this.template);
    this.$reveal = $(`#${this.options.rruleSchedule}`);
    this.$anchor = $(`[data-open="${this.id}"]`).length ? $(`[data-open="${this.id}"]`) : $(`[data-toggle="${this.id}"]`);

    this._events();
    this._updateRuleSet();
  }

  /**
   * Adds event handlers to the rrule-schedule.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.trigger').on({
      'open.zf.trigger': this.open.bind(this)
    });

    this.$grid.off('changed.zf.remove.list').on({
      'changed.zf.remove.list': this._updateRuleSet.bind(this)
    });
  }

  /**
   * Updates rules on changes.
   * @function
   * @private
   */
  _updateRuleSet() {
    var rruleItems = this.$grid.children().toArray();
    this.$element.trigger('changed.zf.rrule.schedule', [this.rruleSet]);

    console.log(rruleItems);

    if (rruleItems.length > 0) {
      this.$empty.addClass('hide');
    } else {
      this.rruleSet = new RRuleSet();
      this.$empty.removeClass('hide');
    }
  }

  /**
   * Builds single rule item.
   * @param {Object} rrule - RRule object to build item from.
   * @function
   * @private
   */
  _buildItem(rrule) {
    var item = this.$item.clone();
    item.find('[data-rrule-text]').text(rrule.toText());

    return item;
  }

  /**
   * Appends all rule items to grid.
   * @function
   * @private
   */
  _appendItems() {
    var rules = this.rruleSet._rrule;
    var items = [];

    $.each(rules, function(index, rrule) {
      var item = this._buildItem(rrule);
      items.push(item);
    }.bind(this));

    this.$grid.html(items);
    this._updateRuleSet();
  }

  /**
   * Opens rrule reveal to set rrule.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    this.$reveal.foundation('open');

    this.$reveal.off('insert.zf.rrule.reveal').on({
      'insert.zf.rrule.reveal': this.add.bind(this)
    });
  }

  /**
   * Adds rrule to rruleSet.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} rrule - Rrule object to append to rruleSet.
   * @private
   */
  add(event, rrule) {
    this.rruleSet.rrule(rrule);
    this._appendItems();
  }

  /**
   * Destroys the rrule-schedule plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.trigger');
    this.$reveal.off('insert.zf.rrule.reveal');
    this.$grid.off('changed.zf.remove.list');
  }
}

RruleSchedule.defaults = {};

export {RruleSchedule};
