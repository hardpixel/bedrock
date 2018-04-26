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
    this.placeholder = this.options.placeholder || this.$element.attr('placeholder');
    this.data = [];
    this.hasGroups = false;
    this.selected = null;
    this.$label = this.$element.parents('label:first');
    this.$trigger = $('label[for="' + this.id + '"]');

    this.$element.hide();

    this._getData();
    this._buildControl();
    this._events();
  }

  /**
   * Adds event handlers to the select-box.
   * @function
   * @private
   */
  _events() {
    this.$input.off('keydown.zf.dropdown');
    this.$selected.off('keydown.zf.dropdown');
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

    this.$input.add(this.$selected).off('keydown.zf.select.box').on({
      'keydown.zf.select.box': this._handleKeyboard.bind(this)
    });

    this.$label.add(this.$trigger).off('click').on({
      'click': this._focusControl.bind(this)
    });
  }

  /**
   * Gets select items data.
   * @function
   * @private
   */
  _getData() {
    if (this.$element.is('select')) {
      var optGroup = this.$element.find('optgroup');
      var currValue = this.$element.val();
      var currText = this.$element.find('option[value="' + currValue + '"]').text();

      if (currValue && currText) {
        this.selected = { name: currText, value: currValue }
      }

      if (optGroup.length) {
        this.hasGroups = true;
        optGroup.each(this._getDataGroupOptions.bind(this));
      } else {
        var opts = this._getDataOptions(this.$element);
        this.data.concat(opts);
      }
    }
  }

  /**
   * Gets select item option data.
   * @function
   * @private
   */
  _getDataOptions(container) {
    var options = [];

    container.find('option').each(function (index, el) {
      var item = { name: el.innerText || el.textContent, value: el.value };
      options.push(item);
    });

    return options;
  }

  /**
   * Gets select item optgroup option data.
   * @function
   * @private
   */
  _getDataGroupOptions(index, el) {
    var opts = this._getDataOptions($(el));
    var item = { label: el.label, options: opts };

    this.data.push(item);
  }

  /**
   * Builds select-box dropdown control with items.
   * @function
   * @private
   */
  _buildControl() {
    this.$box = $('<div class="select-box"></div>');
    this.$placeholder = $('<span class="placeholder">' + this.placeholder + '</span>');
    this.$input = $('<input type="text" placeholder="' + this.placeholder + '" data-close="' + this.id + '-dropdown">');
    this.$selected = $('<span class="selected-value" data-open="' + this.id + '-dropdown"></span>');
    this.$dropdown = $('<div class="dropdown-pane bottom" id="' + this.id + '-dropdown"></div>');
    this.$list = $('<ul class="select-dropdown"></ul>');

    this.$input.hide();
    this.$selected.attr('tabindex', 0);

    this.$element.after(this.$box);
    this.$box.append(this.$input);
    this.$box.append(this.$selected);
    this.$box.append(this.$dropdown);
    this.$dropdown.append(this.$list);

    this.list = new ListSelect(this.$list);
    this.dropdown = new Dropdown(this.$dropdown, { closeOnClick: true, parentClass: 'select-box' });

    $.each(this.data, this._buildItems.bind(this));

    if (this.selected) {
      this.$selected.text(this.selected.name);
      this.$list.find('[data-value="' + this.selected.value + '"]').addClass('is-active');
    } else {
      this.$selected.html(this.$placeholder);
    }
  }

  /**
   * Builds select-box dropdown items.
   * @function
   * @private
   */
  _buildItems(index, data) {
    if (this.hasGroups) {
      var group = $('<li class="select-group"><strong class="select-group-label">' + data.label + '</strong></li>');
      var list = $('<ul class="select-group-items"></ul>');

      $.each(data.options, function(idx, el) {
        var item = this._buildItem(el);
        list.append(item);
      }.bind(this));

      group.append(list);
      this.$list.append(group);
    } else {
      var item = this._buildItem(data);
      this.$list.append(item);
    }
  }

  /**
   * Builds select-box dropdown item.
   * @function
   * @private
   */
  _buildItem(data) {
    return $('<li data-list-item data-value="' + data.value + '">' + data.name + '</li>');
  }

  /**
   * Handles keyboard events.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _handleKeyboard(event) {
    var _this = this;

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
  }

  /**
   * Focuses select box control.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _focusControl(event) {
    this.$selected.trigger('focus');
    event.preventDefault();
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
    var group = null;

    if (!current.length) {
      this.$list.find('[data-list-item]:visible:first').addClass('.is-focused');
    }

    if (dir == 'prev') {
      var sibling = current.prev('[data-list-item]:visible');

      if (!sibling.length) {
        group = current.parents('.select-group:first').prev();
        sibling = group.find('[data-list-item]:visible:last');
      }
    } else {
      var sibling = current.next('[data-list-item]:visible');

      if (!sibling.length) {
        group = current.parents('.select-group:first').next();
        sibling = group.find('[data-list-item]:visible:first');
      }
    }

    if (sibling.length) {
      current.removeClass('is-focused');
      sibling.addClass('is-focused');

      var curPos = this.$list.scrollTop();
      var minPos = sibling.innerHeight();

      if (dir == 'prev') {
        this.$list.scrollTop(curPos - minPos);
      } else {
        this.$list.scrollTop(curPos + minPos);
      }
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
    var active = this.$list.find('.is-active');

    this.$selected.hide();
    this.$input.val('').show().trigger('focus');

    if (active.length) {
      active.addClass('is-focused');
    } else {
      this.$list.find('[data-list-item]:visible:first').addClass('is-focused');
    }

    this.$list.find('[data-list-item]').show();
    this.$element.trigger('open.zf.select.box');
  }

  /**
   * Closes the select dropdown.
   * @param {Object} event - Event object passed from listener.
   * @function
   */
  close(event) {
    this.$selected.show().trigger('focus');
    this.$input.val('').hide();
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

    this.$selected.text(text).show();
    this.$input.hide();
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
