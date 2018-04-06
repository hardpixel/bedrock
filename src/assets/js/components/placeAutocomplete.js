'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * PlaceAutocomplete module.
 * @module placeAutocomplete
 */

class PlaceAutocomplete extends Plugin {
  /**
   * Creates a new instance of an place-autocomplete.
   * @class
   * @name PlaceAutocomplete
   * @fires PlaceAutocomplete#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'PlaceAutocomplete'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, PlaceAutocomplete.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the place-autocomplete wrapper.
   * @function
   * @private
   */
  _init() {
    this.$element.addClass('pac-input');

    this.autocomplete = new google.maps.places.Autocomplete(this.$element[0], Object.assign({
      types: ['geocode']
    }, this.options));

    console.log(this.autocomplete);

    this._handleEvents();
  }

  /**
   * Adds event handlers to the place-autocomplete.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Handles events from the autocomplete.
   * @function
   * @private
   */
  _handleEvents() {
    this.autocomplete.addListener('place_changed', function() {
      this.$element.trigger('place_changed', [this.autocomplete]);
    }.bind(this));
  }

  /**
   * Destroys the place-autocomplete plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.removeClass('pac-input');
  }
}

PlaceAutocomplete.defaults = {};

export {PlaceAutocomplete};
