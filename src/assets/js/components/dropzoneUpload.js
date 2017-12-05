'use strict';

import $ from 'jquery';
import Dropzone from 'dropzone/dist/dropzone';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

Dropzone.autoDiscover = false;

/**
 * DropzoneUpload module.
 * @module dropzone-upload
 */

class DropzoneUpload extends Plugin {
  /**
   * Creates a new instance of an dropzone-form.
   * @class
   * @name DropzoneUpload
   * @fires DropzoneUpload#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'DropzoneUpload'; // ie9 back compat
    this.$element = element;
    this.id = this.$element.attr('id');
    this.template = this._previewTemplate();
    this.options = $.extend({}, DropzoneUpload.defaults, { previewTemplate: this.template }, this.$element.data(), options);

    console.log(this.options);

    this._init();
  }

  /**
   * Initializes the dropzone-form wrapper.
   * @function
   * @private
   */
  _init() {
    this.dropzone = new Dropzone(`#${this.id}`, this.options);
  }

  /**
   * Get the dropzone preview template.
   * @function
   * @private
   */
  _previewTemplate() {
    var fallback = $('#dropzone-preview-template');
    var current = $(`#${this.id}-preview-template`);

    if (current.length) {
      return current.html();
    } else {
      return fallback.html();
    }
  }

  /**
   * Adds event handlers to the dropzone-form.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Destroys the dropzone-form plugin.
   * @function
   * @private
   */
  _destroy() {

  }
}

DropzoneUpload.defaults = {};

export {DropzoneUpload};
