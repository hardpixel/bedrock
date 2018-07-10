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

    this._init();
  }

  /**
   * Initializes the custom-plugin wrapper.
   * @function
   * @private
   */
  _init() {
    this.$input = this.$element.find('[data-rrule]');
    this.$repeat = this.$element.find('[data-rrule="freq"]');
    this.$controls = this.$element.find('[data-rrule-controls]');
    this.$text = this.$element.find('[data-rrule-text]');

    this.$controls.hide();

    this._toggleControls();
    this._updateRules();
    this._events();
  }

  /**
   * Adds event handlers to the custom-plugin.
   * @function
   * @private
   */
  _events() {
    this.$input.off('change.zf.rrule.update').on({
      'change.zf.rrule.update': this._updateRules.bind(this)
    });

    this.$repeat.off('change.zf.rrule.repeat').on({
      'change.zf.rrule.repeat': this._toggleControls.bind(this)
    });
  }

  /**
   * Converts date string to date object.
   * @param {String} string - Date string.
   * @private
   * @function
   */
  _parseDate(string) {
    if (string && string !== '') {
      return new Date(string);
    } else {
      return null;
    }
  }

  /**
   * Parses options from inputs to RRule options.
   * @param {Object} options - Raw options object.
   * @private
   * @function
   */
  _parseRules(options) {
    var freq = options['freq'].toUpperCase();
    options['freq'] = RRule[freq];

    options['dtstart'] = this._parseDate(options['dtstart']);
    options['until'] = this._parseDate(options['until']);
    options['count'] = parseInt(options['count']);

    return options;
  }

  /**
   * Creates an RRule object from input values.
   * @param {Object} options - Options object.
   * @private
   * @function
   */
  _createRule(options) {
    var rule = new RRule(options);
    this.$text.text(rule.toText());
  }

  /**
   * Updates the generated rule from inputs
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _updateRules(event) {
    var options = {};

    this.$input.each(function(index, el) {
      var attr = $(el).attr('data-rrule');
      var value = $(el).val();

      options[attr] = value;
    });

    options = this._parseRules(options);
    this._createRule(options);
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
