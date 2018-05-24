'use strict';

import $ from 'jquery';
import clndr from 'clndr';
import { GetOrSetId } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Dropdown } from 'foundation-sites/js/foundation.dropdown';


/**
 * DatePicker module.
 * @module datePicker
 */

class DatePicker extends Plugin {
  /**
   * Creates a new instance of an date-picker.
   * @class
   * @name DatePicker
   * @fires DatePicker#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'DatePicker'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, DatePicker.defaults, this.$element.data(), options);
    this.today = new Date();
    this.startDate = this._startDate();
    this.endDate = this.options.endDate;

    this._init();
  }

  /**
   * Initializes the date-picker wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'dtp');
    this.$dropdown = $(`<div id="${this.id}-datepicker-dropdown" class="dropdown-pane datepicker-dropdown"></div>`);

    this.$dropdown.insertAfter(this.$element);
    this.$element.attr('data-open', `${this.id}-datepicker-dropdown`);

    this.selected = this.$element.val() || this.today;
    this.dropdown = new Foundation.Dropdown(this.$dropdown, { closeOnClick: true });

    this.calendar = this.$dropdown.clndr({
      selectedDate: this.selected,
      trackSelectedDate: true,
      ignoreInactiveDaysInSelection: true,
      constraints: {
        startDate: this.startDate,
        endDate: this.endDate
      },
      clickEvents: {
        click: this.close.bind(this)
      },
      render: function (data) {
        var prev = '<div class="clndr-control-button"><span class="clndr-previous-button">&lsaquo;</span></div>';
        var next = '<div class="clndr-control-button"><span class="clndr-next-button">&rsaquo;</span></div>';
        var text = '<div class="month">'+ data.month +' '+ data.year +'</div>';
        var html = '<div class="clndr-controls">'+ prev + text + next +'</div>';

        html += '<table class="clndr-table" border="0" cellspacing="0" cellpadding="0">';
        html += '<thead><tr class="header-days">';

        for (var i = 0; i < data.daysOfTheWeek.length; i++) {
          html += '<td class="header-day">'+ data.daysOfTheWeek[i] +'</td>';
        }

        html += '</tr></thead>';
        html += '<tbody><tr class="header-days">';

        for (var i = 0; i < data.numberOfRows; i++) {
          html += '<tr>';

          for (var j = 0; j < 7; j++) {
            var d = j + i * 7;

            html += '<td class="'+ data.days[d].classes +'">';
            html += '<div class="day-contents">'+ data.days[d].day +'</div>';
            html += '</td>';
          }

          html += '</tr>';
        }

        html += '</tr></tbody>';
        html += '</table>';

        return html
      }
    });

    this._events();
  }

  /**
   * Calculates start date for the date-picker.
   * @function
   * @private
   */
  _startDate() {
    var date = this.options.startDate;

    if (!date) {
      var date = new Date();
      date.setDate(date.getDate() - 1);
    }

    return date;
  }

  /**
   * Adds event handlers to the date-picker.
   * @function
   * @private
   */
  _events() {
    this.$dropdown.off('.zf.dropdown').on({
      'show.zf.dropdown': this.open.bind(this),
      'close.zf.dropdown': this.close.bind(this)
    });

    this.$dropdown.on('click', '.clndr-control-button span', function(event) {
      event.stopPropagation();
    });
  }

  /**
   * Shows the date-picker dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  open(event) {
    var width = this.$element.outerWidth();
    this.$dropdown.css('width', width);
  }

  /**
   * Hides the date-picker dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  close(event) {
    var day = $(event.element);

    if (!day.hasClass('inactive')) {
      this.$element.val(event.date._i);
      this.$dropdown.foundation('close');
    }
  }

  /**
   * Destroys the date-picker plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$dropdown.remove();
  }
}

DatePicker.defaults = {};

export {DatePicker};
