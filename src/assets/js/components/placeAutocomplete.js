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
    if (typeof google !== 'undefined') {
      this.$element.addClass('pac-input');

      this.geocoder = new google.maps.Geocoder();
      this.autocomplete = new google.maps.places.Autocomplete(this.$element[0], Object.assign({
        types: ['geocode']
      }, this.options));

      this._handleEvents();
      this._events();
    } else {
      console.log('Google Maps is not available! Please add Google Maps API.');
    }
  }

  /**
   * Adds event handlers to the place-autocomplete.
   * @function
   * @private
   */
  _events() {
    this.$element.off('keypress').on('keypress', function (event) {
      if (event.keyCode == 13) {
        return false;
      }
    });
  }

  /**
   * Handles events from the autocomplete.
   * @function
   * @private
   */
  _handleEvents() {
    this.autocomplete.addListener('place_changed', function() {
      var pac = this.autocomplete
      var place = pac.getPlace();

      this.$element.trigger('place_changed', [place, pac]);
    }.bind(this));
  }

  /**
   * Updates the address input with reverse geocoding.
   * @param {Object} location - Location position data.
   * @function
   */
  update(position) {
    this.geocoder.geocode({ latLng: position }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[0]) {
        this.$element.val(results[0].formatted_address);
      }
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
