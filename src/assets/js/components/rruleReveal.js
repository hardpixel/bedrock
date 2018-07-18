'use strict';

import $ from 'jquery';
import { GetOrSetId } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Reveal } from 'foundation-sites/js/foundation.reveal';

/**
 * RruleReveal module.
 * @module rruleReveal
 */

class RruleReveal extends Plugin {
  /**
   * Creates a new instance of an rrule-reveal.
   * @class
   * @name RruleReveal
   * @fires RruleReveal#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'RruleReveal'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, RruleReveal.defaults, this.$element.data(), options);
    this.reveal = new Foundation.Reveal(element, this.options);
    this.rrule = null;

    this._init();
  }

  /**
   * Initializes the rrule-reveal wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'rrv');
    this.$generator = this.$element.find('[data-rrule-generator]');
    this.generator = this.$generator.data('zfPlugin');
    this.$insert = this.$element.find('[data-insert]');

    this._events();
  }

  /**
   * Adds event handlers to the rrule-reveal.
   * @function
   * @private
   */
  _events() {
    this.$element.off('.zf.reveal').on({
      'open.zf.reveal': this.open.bind(this),
      'closed.zf.reveal': this.close.bind(this)
    });

    this.$insert.off('click').on({
      'click': this.insert.bind(this)
    });

    this.$generator.off('update.zf.rrule').on({
      'update.zf.rrule': this._update.bind(this)
    });
  }

  /**
   * Opens media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  open(event) {
    if (!this.reveal.isActive) {
      this.reveal.open();
    }

    this.generator._reset();
    this.rrule = this.generator.rrule;
    this.$element.trigger('open.zf.rrule.reveal');
  }

  /**
   * Closes media reveal.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  close(event) {
    if (this.reveal.isActive) {
      this.reveal.close();
    }

    this.$element.trigger('closed.zf.rrule.reveal');
  }

  /**
   * Closes reveal and passes selected items objects.
   * @param {Object} event - Event object passed from listener.
   * @private
   */
  insert(event) {
    this.reveal.close();
    this.$element.trigger('insert.zf.rrule.reveal', [this.rrule]);

    this.rrule = null;
  }

  /**
   * Updates the active rrule.
   * @param {Object} event - Event object passed from listener.
   * @param {Object} rrule - RRule object passed from listener.
   * @private
   */
  _update(event, rrule) {
    this.rrule = rrule;
  }

  /**
   * Destroys the rrule-reveal plugin.
   * @function
   * @private
   */
  _destroy() {
    this.reveal.destroy();
    this.$element.off('.zf.reveal');
    this.$insert.off('click');
  }
}

RruleReveal.defaults = {};

export {RruleReveal};
