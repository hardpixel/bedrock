'use strict';

import $ from 'jquery';
import { GetObjectValue } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * PlaceMap module.
 * @module placeMap
 */

class PlaceMap extends Plugin {
  /**
   * Creates a new instance of an place-map.
   * @class
   * @name PlaceMap
   * @fires PlaceMap#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'PlaceMap'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, PlaceMap.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the place-map wrapper.
   * @function
   * @private
   */
  _init() {
    if (typeof google !== 'undefined') {
      this.$map = $('<div class="place-map-container"></div>');
      this.markersUrl = this.options.markersUrl;

      this.$element.append(this.$map);

      if (this.options.height) {
        this.$element.height(this.options.height);
      } else {
        this.$element.addClass(`responsive-embed ${this.options.ratio}`);
      }

      this.map = new google.maps.Map(this.$element[0], this.options.map);

      if (this.markersUrl) {
        this._getMarkers();
      }
    } else {
      console.log('Google Maps is not available! Please add Google Maps API.');
    }
  }

  /**
   * Adds event handlers to the place-map.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Gets markers JSON from url.
   * @function
   * @private
   */
  _getMarkers() {
    $.ajax(this.markersUrl).done(function(response) {
      if (this.options.markersKey) {
        response = GetObjectValue(response, this.options.markersKey);
      }

      this._addMarkers(response);
    }.bind(this));
  }

  /**
   * Adds markers to the map.
   * @param {Array} data - Collection of marker data objects add markers from.
   * @function
   * @private
   */
  _addMarkers(data) {
    $.each(data, function(index, data) {
      var item = {
        position: {
          lat: GetObjectValue(data, this.options.latKey),
          lng: GetObjectValue(data, this.options.lngKey)
        }
      };

      this.addMarker(item);
    }.bind(this));
  }

  /**
   * Adds single marker to the map.
   * @param {Object} data - Marker data object to build item from.
   * @function
   */
  addMarker(data) {
    if (data.position && data.position.lat && data.position.lng) {
      var marker = new google.maps.Marker(data);
      marker.setMap(this.map);

      return marker;
    }
  }

  /**
   * Removes a marker from the map.
   * @param {Object} marker - Marker object to remove.
   * @function
   */
  removeMarker(marker) {
    marker.setMap(null);
  }

  /**
   * Updates a marker position to the map.
   * @param {Object} marker - Marker object change position.
   * @param {Object} position - New position object apply.
   * @function
   */
  updateMarker(marker, position) {
    marker.setPosition(position);
  }

  /**
   * Pans the map to the specified position.
   * @param {Object} position - Marker data object to build item from.
   * @function
   */
  panTo(position) {
    this.map.panTo(position);
  }

  /**
   * Destroys the place-map plugin.
   * @function
   * @private
   */
  _destroy() {
    if (this.$map) {
      this.$map.remove();
    }
  }
}

PlaceMap.defaults = {
  ratio: 'panorama',
  map: {
    center: {
      lat: 37.983,
      lng: 23.727
    },
    zoom: 13
  }
};

export {PlaceMap};
