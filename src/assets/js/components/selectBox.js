'use strict';

import $ from 'jquery';
import { Keyboard } from 'foundation-sites/js/foundation.util.keyboard';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Dropdown } from 'foundation-sites/js/foundation.dropdown';
import { ListSelect } from './listSelect';

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

    this._init();

    Keyboard.register('SelectBox', {
      'ESCAPE': 'close',
      'ENTER': 'select',
      'ARROW_UP': 'prev',
      'ARROW_DOWN': 'next'
    });
  }

  /**
   * Initializes the select-box wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.$input = this.$element.find('input');
    this.$dropdown = this.$element.find('[data-dropdown]');
    this.$list = this.$element.find('[data-list-select]');
    this.data = [];
    this.selected = null;

    this.$element.hide();

    this._getData();
    this._buildItems();
    this._events();
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {
    var _this = this;

    this.$input.off('keydown.zf.dropdown');
    this.$dropdown.off('keydown.zf.dropdown');

    this.$dropdown.off('show.zf.dropdown').on({
      'show.zf.dropdown': this.open.bind(this)
    });

    this.$dropdown.off('hide.zf.dropdown').on({
      'hide.zf.dropdown': this.close.bind(this)
    });

    this.$list.off('selected.zf.select.list').on({
      'selected.zf.select.list': this.select.bind(this)
    });

    this.$list.off('unselected.zf.select.list').on({
      'unselected.zf.select.list': this.select.bind(this)
    });

    this.$list.off('mouseenter.zf.select.list', '[data-list-item]').on({
      'mouseenter.zf.select.list': this._highlight.bind(this)
    }, '[data-list-item]');

    this.$input.off('input').on({
      'input': this.filter.bind(this)
    });

    this.$input.off('keydown.zf.select.box').on('keydown.zf.select.box', function(event) {
      Keyboard.handleKey(event, 'SelectBox', {
        select: function() {
          event.preventDefault();
          _this._selectHighlighted();
        },
        prev: function() {
          _this._highlightSibling('prev');
        },
        next: function() {
          _this._highlightSibling('next');
        },
        close: function() {
          _this.$dropdown.foundation('close');
        }
      });
    });
  }

  /**
   * Gets select items data.
   * @function
   * @private
   */
  _getData() {
    if (this.$element.is('select')) {
      var currValue = this.$element.val();
      var currText = this.$element.find('option[value="' + currValue + '"]').text();

      if (currValue && currText) {
        this.selected = { name: currText, value: currValue }
      }

      this.$element.find('option').each(function (index, el) {
        var item = {
          name: el.innerText || el.textContent,
          value: el.value
        };

        this.data.push(item);
      }.bind(this));
    }
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _buildItems() {
    this.$box = $('<div class="select-box"></div>');
    this.$input = $('<input type="text" placeholder="' + this.options.placeholder + '" data-toggle="' + this.id + '-dropdown">');
    this.$dropdown = $('<div class="dropdown-pane bottom" id="' + this.id + '-dropdown"></div>');
    this.$list = $('<ul class="select-dropdown"></ul>');

    this.$element.after(this.$box);
    this.$box.append(this.$input);
    this.$box.append(this.$dropdown);
    this.$dropdown.append(this.$list);

    this.list = new ListSelect(this.$list);
    this.dropdown = new Dropdown(this.$dropdown, { closeOnClick: true, parentClass: 'select-box' });

    $.each(this.data, function (index, item) {
      var option = $('<li data-list-item data-value="' + item.value + '">' + item.name + '</li>');
      this.$list.append(option);
    }.bind(this));

    if (this.selected) {
      this.$input.val(this.selected.name);
      this.$list.find('[data-value="' + this.selected.value + '"]').addClass('is-active');
    }
  }

  /**
   * Highlights dropdown list item.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _highlight(event) {
    var item = $(event.target);
    this.$list.find('.is-focused').removeClass('is-focused');
    item.addClass('is-focused');
  }

  /**
   * Highlights prev/next dropdown list item.
   * @param {String} dir - Highlight direction, prev or next.
   * @function
   * @private
   */
  _highlightSibling(dir) {
    if (!this.$dropdown.is(':visible')) {
      this.$dropdown.foundation('open');
      return;
    }

    var current = this.$list.find('.is-focused');

    if (!current.length) {
      this.$list.find('[data-list-item]:visible:first').addClass('.is-focused');
    }

    if (dir == 'prev') {
      var sibling = current.prev('[data-list-item]:visible');
    } else {
      var sibling = current.next('[data-list-item]:visible');
    }

    if (sibling.length) {
      current.removeClass('is-focused');
      sibling.addClass('is-focused');
    }
  }

  /**
   * Selects the highlighted dropdown list item.
   * @function
   * @private
   */
  _selectHighlighted() {
    if (!this.$dropdown.is(':visible')) {
      this.$dropdown.foundation('open');
      return;
    }

    this.$list.find('.is-focused:not(.is-active)').trigger('select.zf.trigger');
    this.$dropdown.foundation('close');
  }

  /**
   * Opens the select dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  open(event) {
    this.$input.val('');
    this.$list.find('.is-active').addClass('is-focused');
    this.$list.find('[data-list-item]').show();
    this.$element.trigger('open.zf.select.box');
  }

  /**
   * Closes the select dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  close(event) {
    this.$input.val(this.selected.name);
    this.$list.find('.is-focused').removeClass('is-focused');
    this.$list.find('[data-list-item]').show();
    this.$element.trigger('close.zf.select.box');
  }

  /**
   * Selects a list item.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} item - Item selected from list.
   * @function
   */
  select(event, item) {
    var text = item.text();
    var value = item.attr('data-value');

    this.selected = { name: text, value: value }

    this.$input.val(text);
    this.$element.val(value);
    this.$dropdown.foundation('close');

    this.$element.trigger('change');
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Unselects a list item.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} item - Item unselected from list.
   * @function
   */
  unselect(event, item) {
    this.$element.trigger('change');
    this.$element.trigger('changed.zf.select.box');
  }

  /**
   * Filters the list items on user input.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  filter(event) {
    var text = $(event.target).val().toLowerCase();

    if (text) {
      this.$list.find('[data-list-item]').hide();
      this.$list.find('[data-value*="' + text + '"]').show();
      this.$list.find('.is-focused').removeClass('is-focused');
      this.$list.find('[data-list-item]:visible:first').addClass('is-focused');
    } else {
      this.$list.find('[data-list-item]').show();
    }
  }

  /**
   * Destroys the select-box plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.show();
    this.$element.off('.zf.trigger');
  }
}

SelectBox.defaults = {};

export {SelectBox};
