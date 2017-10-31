'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { OffCanvas } from 'foundation-sites/js/foundation.offcanvas';
import { MediaQuery } from 'foundation-sites/js/foundation.util.mediaQuery';

/**
 * OffCanvasMenu module.
 * @module offcanvasMenu
 */

class OffCanvasMenu extends Plugin {
  /**
   * Creates a new instance of an off-canvas-menu wrapper.
   * @class
   * @name OffCanvasMenu
   * @fires OffCanvasMenu#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'OffCanvasMenu'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, OffCanvasMenu.defaults, this.$element.data(), options);
    this.offcanvas = new OffCanvas(this.$element, this.options);

    this._init();
    this._events();
  }

  /**
   * Initializes the off-canvas-menu wrapper by adding the exit overlay (if needed).
   * @function
   * @private
   */
  _init() {
    var id = this.$element.attr('id');

    this.$exiter = $('[data-toggle=' + id + '], [data-open="' + id + '"], [data-close="' + id + '"]');
    this.$wrapper = $('.off-canvas-wrapper');
    this.$collapsed = this.$element.hasClass('is-collapsed');

    this._setMQChecker();
    // this._state(this);
    // this._menus(this);
  }

  /**
   * Adds event handlers to the off-canvas wrapper and the exit overlay.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.trigger .zf.offcanvas').on({
      'open.zf.trigger': this.open.bind(this),
      'close.zf.trigger': this.close.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this)
    });
  }

  /**
   * Applies event listener for elements that will reveal at certain breakpoints.
   * @private
   */
  _setMQChecker() {
    var _this = this;

    $(window).on('changed.zf.mediaquery', function() {
      _this.reveal();
    }).one('load.zf.offcanvas', function() {
      _this.reveal();
    });
  }

  /**
   * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
   * @function
   */
  reveal() {
    if (MediaQuery.atLeast('large')) {
      this.offcanvas.$element.removeClass('is-closed');
      this.offcanvas.close();

      this.offcanvas._removeContentClasses();
      this.offcanvas._removeContentClasses(false);
    } else {
      this.offcanvas.reveal(false);
      this.offcanvas.close();
    }

    this._events();
  }

  /**
   * Handles the collapsing/expanding the off-canvas at breakpoints, not the same as open.
   * @function
   */
  collapse(isCollapsed) {
    this.$collapsed = isCollapsed;

    if (isCollapsed) {
      this.$element.addClass('is-collapsed');
    } else {
      this.$element.removeClass('is-collapsed');
    }
  }

  /**
   * Opens the off-canvas menu.
   * @function
   * @param {Object} event - Event object passed from listener.
   * @param {jQuery} trigger - element that triggered the off-canvas to open.
   * @fires OffCanvas#opened
   */
  open(event, trigger) {
    if (MediaQuery.atLeast('large')) {
      this.collapse(true);
    } else {
      this.offcanvas.open();
    }
  }

  /**
   * Closes the off-canvas menu.
   * @function
   * @param {Function} cb - optional cb to fire after closure.
   * @fires OffCanvas#closed
   */
  close(event, trigger) {
    if (MediaQuery.atLeast('large')) {
      this.collapse(false);
    } else {
      this.offcanvas.close();
    }
  }

  /**
   * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
   * @param {Boolean} isRevealed - true if element should be revealed.
   * @function
   */
  toggle(event, trigger) {
    if (MediaQuery.atLeast('large')) {
      this.collapse(!this.$collapsed);
    } else {
      this.offcanvas.toggle();
    }
  }
}

OffCanvasMenu.defaults = {};

export {OffCanvasMenu};
