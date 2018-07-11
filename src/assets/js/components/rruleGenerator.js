'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var RRule = require('rrule').RRule;

window.rrule = RRule;

/**
 * RruleGenerator module.
 * @module rrule-generator
 */

class RruleGenerator extends Plugin {
  /**
   * Creates a new instance of an rrule-generator.
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
    this.rrule = null;
    this.arrayOpts = [
      'byweekday',
      'bymonth',
      'bysetpos',
      'bymonthday',
      'byyearday',
      'byweekno',
      'byhour',
      'byminute',
      'bysecond'
    ];

    this._init();
  }

  /**
   * Initializes the rrule-generator wrapper.
   * @function
   * @private
   */
  _init() {
    this.$elements = this.$element.find('[data-rrule-element]');
    this._mountElements();

    this.$controls = this.$element.find('[data-rrule-controls]');
    this.$controls.hide();

    this.$input = this.$element.find('[data-rrule]');
    this.$repeat = this.$element.find('[data-rrule="freq"]');
    this.$text = this.$element.find('[data-rrule-text]');

    this._toggleControls();
    this._updateRules();
    this._update();
    this._events();
  }

  /**
   * Adds event handlers to the rrule-generator.
   * @function
   * @private
   */
  _events() {
    this.$repeat.off('change.zf.rrule.repeat').on({
      'change.zf.rrule.repeat': this._toggleControls.bind(this)
    });

    this.$input.off('change.zf.rrule.update').on({
      'change.zf.rrule.update': this._updateRules.bind(this)
    });

    this.$element.off('.zf.trigger').on({
      'update.zf.trigger': this._update.bind(this)
    });
  }

  /**
   * Mounts custom plugin elements.
   * @function
   * @private
   */
  _mountElements() {
    var plugin = this;

    this.$elements.each(function(index, el) {
      var elName = $(el).attr('data-rrule-element');
      var elFunction = plugin[`_${elName}Element`];

      if (elFunction) {
        elFunction(el);
      }
    });
  }

  /**
   * Creates a month picker element.
   * @param {Object} el - Html element object.
   * @private
   * @function
   */
  _bymonthElement(el) {
    var html = '';
    var $el = $(el);

    html += 'Month Picker';

    $el.html(html);
    $el.addClass('month-picker');
  }

  /**
   * Creates a monthday picker element.
   * @param {Object} el - Html element object.
   * @private
   * @function
   */
  _bymonthdayElement(el) {
    var html = '';
    var $el = $(el);

    html += '<table><tbody>';
      for (var r = 0; r < 5; r++) {
        html += '<tr>';

        for (var c = 1; c < 8; c++) {
          var day = (r * 7) + c;

          if (day < 32) {
            html += '<td><label>';
            html += '<input type="checkbox" data-rrule="bymonthday" value="' + day + '" />';
            html += '<span>' + day + '</span>';
            html += '</label></td>';
          } else if (day == 32) {
            html += '<td colspan="4" class="last-day"><label>';
            html += '<input type="checkbox" data-rrule="bymonthday" value="-1" />';
            html += '<span>Last Day</span>';
            html += '</label></td>';
          }
        }

        html += '</tr>';
      }
    html += '</tbody></table>';

    $el.html(html);
    $el.addClass('monthday-picker rrule-picker');
  }

  /**
   * Creates a weekday picker element.
   * @param {Object} el - Html element object.
   * @private
   * @function
   */
  _byweekdayElement(el) {
    var html = '';
    var $el = $(el);

    html += 'Weekday Picker';

    $el.html(html);
    $el.addClass('weekday-picker');
  }

  /**
   * Creates a hour picker element.
   * @param {Object} el - Html element object.
   * @private
   * @function
   */
  _byhourElement(el) {
    var html = '';
    var $el = $(el);

    html += 'Hour Picker';

    $el.html(html);
    $el.addClass('hour-picker');
  }

  /**
   * Creates a minute picker element.
   * @param {Object} el - Html element object.
   * @private
   * @function
   */
  _byminuteElement(el) {
    var html = '';
    var $el = $(el);

    html += 'Minute Picker';

    $el.html(html);
    $el.addClass('minute-picker');
  }

  /**
   * Remove empty arrays, strings and null values from object.
   * @param {Object} options - Options object.
   * @private
   * @function
   */
  _cleanupOptions(options) {
    Object.keys(options).forEach(function(item) {
      var value = options[item];
      var valid = value !== null && value !== '' && value.toString().length > 0;

      if (!valid) {
        delete(options[item]);
      }
    });

    return options;
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
   * Converts a string to RRule constant.
   * @param {String} string - Constant name.
   * @private
   * @function
   */
  _parseConstant(string) {
    if (string && string !== '') {
      var name = string.toUpperCase();
      var value = RRule[name];

      return value;
    } else {
      return null;
    }
  }

  /**
   * Converts a string to number.
   * @param {String} string - Number string.
   * @private
   * @function
   */
  _parseNumber(string) {
    if (string && string !== '') {
      return parseInt(string);
    } else {
      return null;
    }
  }

  /**
   * Parses a multiple value rule.
   * @param {Array} array - Array of string values.
   * @private
   * @function
   */
  _parseMultiple(array, callback) {
    if (array && array !== '') {
      var items = array.map(function(item) {
        return callback(item);
      });

      return items;
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
    options['dtstart'] = this._parseDate(options['dtstart']);
    options['until'] = this._parseDate(options['until']);

    options['count'] = this._parseNumber(options['count']);
    options['interval'] = this._parseNumber(options['interval']);

    options['freq'] = this._parseConstant(options['freq']);
    options['wkst'] = this._parseConstant(options['wkst']);
    options['bymonthday'] = this._parseMultiple(options['bymonthday'], this._parseNumber);
    options['byweekday'] = this._parseMultiple(options['byweekday'], this._parseConstant);

    return this._cleanupOptions(options);
  }

  /**
   * Creates an RRule object from input values.
   * @param {Object} options - Options object.
   * @private
   * @function
   */
  _createRule(options) {
    this.rrule = new RRule(options);
    this.$element.trigger('update.zf.trigger', [this.rrule]);
  }

  /**
   * Updates the generated rule from inputs
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _updateRules(event) {
    var arrayOpts = this.arrayOpts;
    var options = {};

    arrayOpts.forEach(function(item) {
      options[item] = [];
    });

    this.$input.filter(':not(.disabled)').each(function(index, el) {
      var input = $(el);
      var attr = input.attr('data-rrule');
      var value = input.val();
      var multiple = $.inArray(attr, arrayOpts) !== -1;
      var save = false;

      if (input.is(':checkbox')) {
        save = input.is(':checked');
      } else {
        save = true;
      }

      if (save) {
        if (multiple) {
          options[attr].push(value);
        } else {
          options[attr] = value;
        }
      }
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
    var active = this.$element.find(`[data-rrule-controls*="${value}"]`);

    this.$controls.hide();
    this.$controls.find('[data-rrule]').addClass('disabled');

    active.show();
    active.find('[data-rrule]').removeClass('disabled');
  }

  /**
   * Updates ui on rrule update.
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _update(event) {
    this.$text.text(this.rrule.toText());
  }

  /**
   * Destroys the rrule-generator plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$repeat.off('change.zf.rrule.repeat');
    this.$input.off('change.zf.rrule.update');
    this.$element.off('.zf.trigger');
  }
}

RruleGenerator.defaults = {};

export {RruleGenerator};
