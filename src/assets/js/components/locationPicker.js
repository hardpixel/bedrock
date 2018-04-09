'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * LocationPicker module.
 * @module LocationPicker
 */

class LocationPicker extends Plugin {
  /**
   * Creates a new instance of an location-picker.
   * @class
   * @name LocationPicker
   * @fires LocationPicker#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'LocationPicker'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, LocationPicker.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the location-picker wrapper.
   * @function
   * @private
   */
  _init() {
    this.$pac = this.$element.find('[data-place-autocomplete]');
    this.$map = this.$element.find('[data-place-map]');
    this.$lat = this.$element.find('[data-location-lat]');
    this.$lng = this.$element.find('[data-location-lng]');

    this.pac = this.$pac.data('zfPlugin');
    this.map = this.$map.data('zfPlugin');

    this._createMarker();
    this._events();
  }

  /**
   * Adds event handlers to the location-picker.
   * @function
   * @private
   */
  _events() {
    this.$pac.off('place_changed').on({
      'place_changed': this._placeChange.bind(this)
    });

    this.$lat.off('input').on({
      'input': this._inputChange.bind(this)
    });

    this.$lng.off('input').on({
      'input': this._inputChange.bind(this)
    });
  }

  /**
   * Gets location data from form inputs
   * @function
   * @private
   */
  _getInputLocation() {
    var lat = parseFloat(this.$lat.val());
    var lng = parseFloat(this.$lng.val());

    if (lat && lng) {
      return { lat: lat, lng: lng };
    }
  }

  /**
   * Updates all components and form inputs on autocomplete place change.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _placeChange(event, place) {
    if (place.geometry) {
      this._updateInputs(place.geometry.location);
      this._updateMarker(place.geometry.location);
    }
  }

  /**
   * Updates all components and form inputs on input change.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _inputChange(event) {
    var position = this._getInputLocation();

    if (position) {
      this._updateAddress(position);
      this._updateMarker(position);
    }
  }

  /**
   * Updates location-picker inputs.
   * @param {Object} location - Location object with lat/lng.
   * @function
   * @private
   */
  _updateInputs(location) {
    this.$lat.val(location.lat());
    this.$lng.val(location.lng());
  }

  /**
   * Creates a draggable map marker from form inputs.
   * @param {Object} data - Marker data and options.
   * @function
   * @private
   */
  _createMarker(data) {
    var position = this._getInputLocation();

    if (position) {
      this._updateMarker(position);
    }
  }

  /**
   * Adds a draggable map marker.
   * @param {Object} data - Marker data and options.
   * @function
   * @private
   */
  _addMarker(data) {
    var options = $.extend({ draggable: true }, data);
    this.marker = this.map.addMarker(options);

    google.maps.event.addListener(this.marker, 'dragend', function(event) {
      this._updateAddress(this.marker.position);
      this._updateInputs(this.marker.position);
    }.bind(this));
  }

  /**
   * Updates the map marker position.
   * @param {Object} position - Marker data and options.
   * @function
   * @private
   */
  _updateMarker(position) {
    if (this.marker) {
      this.marker.setPosition(position);
    } else {
      this._addMarker({ position: position });
    }

    this.map.panTo(position);
  }

  /**
   * Updates the autocomplete address field.
   * @param {Object} position - Marker data and options.
   * @function
   * @private
   */
  _updateAddress(position) {
    this.pac.update(position);
  }

  /**
   * Destroys the location-picker plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$pac.off('place_changed');
    this.$lat.off('input');
    this.$lng.off('input');
  }
}

LocationPicker.defaults = {};

export {LocationPicker};
