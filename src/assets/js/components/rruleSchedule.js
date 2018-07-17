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
    this.ruleSet = new RRuleSet();

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
    this.$anchor = $(`[data-add="${this.id}"]`);

    this._events();
    this._updateRuleSet();
  }

  /**
   * Adds event handlers to the rrule-schedule.
   * @function
   * @private
   */
  _events() {
    this.$grid.off('changed.zf.remove.list').on({
      'changed.zf.remove.list': this._updateRuleSet.bind(this)
    });

    this.$anchor.off('click').on({
      'click': this.add.bind(this)
    });
  }

  /**
   * Updates active items on changes.
   * @function
   * @private
   */
  _updateRuleSet() {
    this.ruleSet = ;
    this.$element.trigger('changed.zf.schedule', [this.ruleSet]);
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

    this._updateRuleSet();
  }

  /**
   * Destroys the rrule-schedule plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.off('.zf.trigger');
    this.$grid.off('changed.zf.remove.list');
  }
}

RruleSchedule.defaults = {};

export {RruleSchedule};
