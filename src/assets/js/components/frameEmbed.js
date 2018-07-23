'use strict';

import $ from 'jquery';
import { GetOrSetId } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * FrameEmbed module.
 * @module frameEmbed
 */

class FrameEmbed extends Plugin {
  /**
   * Creates a new instance of an frame-embed.
   * @class
   * @name FrameEmbed
   * @fires FrameEmbed#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'FrameEmbed'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, FrameEmbed.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the frame-embed wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'fre');
    this.$frame = this.$element.find('iframe');
    this.$parent = this.$element.parent();

    this._setMinHeight();
    this._events();
  }

  /**
   * Adds event handlers to the frame-embed.
   * @function
   * @private
   */
  _events() {
    this.$frame.off('load resize').on({
      'load': this._setHeight.bind(this),
      'resize': this._setHeight.bind(this)
    });

    $(window).off('.zf.frame.embed').on({
      'load.zf.frame.embed': this._setMinHeight.bind(this),
      'resize.zf.frame.embed': this._setMinHeight.bind(this)
    });
  }

  /**
   * Sets min height on frame container.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _setMinHeight(event) {
    if (this.options.fillParent) {
      var top = this.$parent.offset().top;
      var vport = $(window).height();
      var min = vport - top;
      var height = this.$parent.innerHeight();

      if (min > height) {
        height = min;
      }

      this.$frame.css('min-height', height);
    }
  }

  /**
   * Sets height on frame container.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _setHeight(event) {
    var height = this.$frame.contents().find('body').innerHeight();
    this.$frame.height(height);
  }

  /**
   * Destroys the frame-embed plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$frame.off('load resize');
    $(window).off('.zf.frame.embed');
  }
}

FrameEmbed.defaults = {};

export {FrameEmbed};
