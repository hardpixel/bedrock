'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var RRule = require('rrule').RRule;

/**
 * RruleGenerator module.
 * @module rrule-generator
 */

class RruleGenerator extends Plugin {
  /**
   * Creates a new instance of an custom-plugin.
   * @class
   * @name RruleGenerator
   * @fires RruleGenerator#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'RruleGenerator'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, RruleGenerator.defaults, this.$element.data(), options);
    this.dateStart = null;
    this.dateEnd = null;
    this.timeStart = null;
    this.timeEnd = null;
    this.repeat = null;

    this._init();
  }

  /**
   * Initializes the custom-plugin wrapper.
   * @function
   * @private
   */
  _init() {
    this.$input = this.$element.find('[data-rrule]');
    this.$repeat = this.$element.find('[data-rrule="repeat"]');
    this.$controls = this.$element.find('[data-rrule-controls]');
    this.$text = this.$element.find('[data-rrule-text]');

    this.$controls.hide();

    this._toggleControls();
    this._events();
  }

  /**
   * Adds event handlers to the custom-plugin.
   * @function
   * @private
   */
  _events() {
    this.$input.off('change.zf.rrule.update').on({
      'change.zf.rrule.update': this._setRules.bind(this)
    });

    this.$repeat.off('change.zf.rrule.repeat').on({
      'change.zf.rrule.repeat': this._toggleControls.bind(this)
    });
  }

  /**
   * Shows the revelant controls on repeat change.
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _setRules(event) {
    this.$input.filter(':visible').each(function(index, el) {
      var attr = $(el).attr('data-rrule');
      var value = $(el).val();

      this[attr] = value;
    });

    console.log(this);
  }

  /**
   * Shows the revelant controls on repeat change.
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _toggleControls(event) {
    var value = this.$repeat.val();

    this.$controls.hide();
    this.$element.find('[data-rrule-controls="' + value + '"]').show();
  }

  /**
   * Destroys the custom-plugin plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$input.off('change.zf.rrule.update');
    this.$repeat.off('change.zf.rrule.repeat');
  }
}

RruleGenerator.defaults = {};

export {RruleGenerator};
