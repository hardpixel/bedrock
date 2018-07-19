'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var RRule = require('rrule').RRule;
var moment = require('moment');


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

    this.$rule = this.$element.find('[data-rrule]');
    this.$repeat = this.$element.find('[data-rrule="freq"]');
    this.$string = this.$element.find('[data-rrule-string]');
    this.$text = this.$element.find('[data-rrule-text]');
    this.$input = this.$element.find('[data-rrule-input]');
    this.$output = this.$element.find('[data-rrule-output]');

    this._readInput();
    this._toggleControls();

    if (!this.rrule) {
      this._updateRules();
    }

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

    this.$rule.off('change.zf.rrule.update').on({
      'change.zf.rrule.update': this._updateRules.bind(this)
    });

    this.$input.off('change.zf.rrule.update').on({
      'change.zf.rrule.update': this._readInput.bind(this)
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
    var months = moment.monthsShort();
    var html = '';
    var $el = $(el);

    html += '<table><tbody>';
      for (var r = 0; r < 2; r++) {
        html += '<tr>';

        for (var c = 1; c < 7; c++) {
          var month = (r * 6) + c;

          html += '<td><label>';
          html += '<input type="checkbox" data-rrule="bymonth" value="' + month + '" />';
          html += '<span>' + months[month - 1] + '</span>';
          html += '</label></td>';
        }

        html += '</tr>';
      }
    html += '</tbody></table>';

    $el.html(html);
    $el.addClass('month-picker rrule-picker');
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
    var days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var html = '';
    var $el = $(el);

    html += '<table><tbody><tr>';
      days.forEach(function(day) {
        html += '<td><label>';
        html += '<input type="checkbox" data-rrule="byweekday" value="' + day.toUpperCase() + '" />';
        html += '<span>' + day + '</span>';
        html += '</label></td>';
      });
    html += '</tr></tbody></table>';

    $el.html(html);
    $el.addClass('weekday-picker rrule-picker');
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

    html += '<table><tbody>';
      for (var r = 0; r < 4; r++) {
        html += '<tr>';

        for (var c = 1; c < 7; c++) {
          var hour = (r * 6) + c;

          html += '<td><label>';
          html += '<input type="checkbox" data-rrule="byhour" value="' + hour + '" />';
          html += '<span>' + hour + '</span>';
          html += '</label></td>';
        }

        html += '</tr>';
      }
    html += '</tbody></table>';

    $el.html(html);
    $el.addClass('hour-picker rrule-picker');
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

    html += '<table><tbody>';
      for (var r = 0; r < 2; r++) {
        html += '<tr>';

        for (var c = 0; c < 6; c++) {
          var hour = ((r * 6) + c) * 5;

          html += '<td><label>';
          html += '<input type="checkbox" data-rrule="byminute" value="' + hour + '" />';
          html += '<span>' + hour + '</span>';
          html += '</label></td>';
        }

        html += '</tr>';
      }
    html += '</tbody></table>';

    $el.html(html);
    $el.addClass('minute-picker rrule-picker');
  }

  /**
   * Remove empty arrays, strings and null values from object.
   * @param {Object} options - Options object.
   * @private
   * @function
   */
  _normalizeOptions(options) {
    var config = {};
    var wkst = options['wkst'];
    var intval = options['interval'];

    if (!wkst) {
      options['wkst'] = RRule.MO;
    }

    if (intval < 2) {
      delete(options['interval']);
    }

    Object.keys(RRule.DEFAULT_OPTIONS).forEach(function(item) {
      var value = options[item];

      if (typeof value != 'undefined') {
        var valid = value !== null && value !== '' && value.toString().length > 0;
        if (valid) config[item] = value;
      }
    });

    return config;
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

    options['bymonth'] = this._parseMultiple(options['bymonth'], this._parseNumber);
    options['bymonthday'] = this._parseMultiple(options['bymonthday'], this._parseNumber);
    options['byweekday'] = this._parseMultiple(options['byweekday'], this._parseConstant);
    options['byhour'] = this._parseMultiple(options['byhour'], this._parseNumber);
    options['byminute'] = this._parseMultiple(options['byminute'], this._parseNumber);
    options['bysecond'] = this._parseMultiple(options['bysecond'], this._parseNumber);

    return this._normalizeOptions(options);
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

    this.$rule.filter(':not(.disabled)').each(function(index, el) {
      var input = $(el);
      var attr = input.attr('data-rrule');
      var value = input.val();
      var multiple = $.inArray(attr, arrayOpts) !== -1;
      var save = false;

      if (multiple) {
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
    this.rrule = new RRule(options);

    this._updateControls();
    this.$element.trigger('update.zf.rrule', [this.rrule]);
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
   * Updates all rrule controls.
   * @private
   * @function
   */
  _updateControls() {
    this._updateString();
    this._updateText();
    this._updateInput();
    this._updateOutput();
  }

  /**
   * Updates rrule string presentation.
   * @private
   * @function
   */
  _updateString() {
    if (this.$string.length) {
      this.$string.text(this.rrule.toString());
    }
  }

  /**
   * Updates rrule text presentation.
   * @private
   * @function
   */
  _updateText() {
    if (this.$text.length) {
      this.$text.text(this.rrule.toText());
    }
  }

  /**
   * Updates rrule input value.
   * @private
   * @function
   */
  _updateInput() {
    if (this.$input.length) {
      this.$input.val(this.rrule.toString());
    }
  }

  /**
   * Create rrule from input value.
   * @private
   * @function
   */
  _readInput() {
    if (this.$input.length) {
      var arrayOpts = this.arrayOpts;
      var controls = this.$rule;
      var interval = controls.filter('[data-rrule="interval"]');
      var string = this.$input.val();

      if (string && string !== '') {
        this.rrule = RRule.fromString(string);
        var options = RRule.parseString(string);

        controls.filter(':checkbox').prop('checked', false);
        controls.filter(':not(:checkbox)').val('');

        $.each(options, function(key, value) {
          var multiple = $.inArray(key, arrayOpts) !== -1;
          var control = controls.filter(`[data-rrule="${key}"]`);

          if (value && value !== '') {
            if (multiple) {
              if (Array.isArray(value)) {
                value.forEach(function(item) {
                  control.filter(`[value="${item}"]`).prop('checked', true);
                });
              } else {
                control.filter(`[value="${value}"]`).prop('checked', true);
              }
            } else {
              if (key == 'freq') {
                var freqs = {};

                RRule.FREQUENCIES.forEach(function(freq) {
                  var freqKey = RRule[freq]
                  freqs[freqKey] = freq;
                });

                value = freqs[value].toLowerCase();
              }

              if (key == 'dtstart' || key == 'until') {
                value = moment(value).format('YYYY-MM-DD');
              }

              control.val(value);
            }
          }
        });

        if (interval.val() == '') {
          interval.val('1');
        }

        this._updateControls();
        this.$element.trigger('update.zf.rrule', [this.rrule]);
      }
    }
  }

  /**
   * Updates rrule output presentation.
   * @private
   * @function
   */
  _updateOutput() {
    if (this.$output.length) {
      var html = '';
      var data = this.rrule.all(function(date, index) {
        return index < 15;
      });

      html += '<table><tbody>';
        data.forEach(function(item, index) {
          var parts = item.toString().split(' ');

          html += '<tr><td>' + (index + 1) + '</td>';

            parts.forEach(function(part) {
              html += '<td>' + part + '</td>';
            });

          html += '</tr>';
        })
      html += '</tbody></table>';

      this.$output.html(html);
    }
  }

  /**
   * Resets the rrule-generator form fields.
   * @function
   * @private
   */
  _reset() {
    this.$rule.filter('input:not(:checkbox):not(:radio)').val('');
    this.$rule.filter(':checkbox, :radio').prop('checked', false);

    this._updateRules();
  }

  /**
   * Destroys the rrule-generator plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$repeat.off('change.zf.rrule.repeat');
    this.$rule.off('change.zf.rrule.update');
    this.$input.off('change.zf.rrule.update');
  }
}

RruleGenerator.defaults = {};

export {RruleGenerator};
