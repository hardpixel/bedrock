'use strict';

import $ from 'jquery';
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
    if (google !== 'undefined') {
      if (this.options.height) {
        this.$element.height(this.options.height);
      } else {
        this.$element.addClass(`responsive-embed ${this.options.ratio}`);
      }

      this.map = new google.maps.Map(this.$element[0], this.options.map);
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
   * Destroys the place-map plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$element.height('');
    this.$element.removeClass(`responsive-embed ${this.options.ratio}`);
  }
}

PlaceMap.defaults = {
  ratio: 'panorama',
  map: {
    center: {
      lat: -33.8688,
      lng: 151.2195
    },
    zoom: 13
  }
};

export {PlaceMap};
