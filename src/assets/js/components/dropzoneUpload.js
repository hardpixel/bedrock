'use strict';

import $ from 'jquery';
import Dropzone from 'dropzone/dist/dropzone';
import { GetOrSetId } from './helpers';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

Dropzone.autoDiscover = false;

/**
 * DropzoneUpload module.
 * @module dropzoneUpload
 */

class DropzoneUpload extends Plugin {
  /**
   * Creates a new instance of an dropzone-upload.
   * @class
   * @name DropzoneUpload
   * @fires DropzoneUpload#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'DropzoneUpload'; // ie9 back compat
    this.$element = element;
    this.options = $.extend(this._preview(), DropzoneUpload.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the dropzone-upload wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = GetOrSetId(this.$element, 'dzu');

    this._handleEvents();
    this.dropzone = new Dropzone(`#${this.id}`, this.options);
  }

  /**
   * Get the dropzone preview template.
   * @function
   * @private
   */
  _preview() {
    var fallback = $('#dropzone-preview-template');
    var current = $(`#${this.id}-preview-template`);
    var template = null;

    if (current.length) {
      template = current.html();
    } else if (fallback.length) {
      template = fallback.html();
    }

    return { previewTemplate: template }
  }

  /**
   * Adds event handlers to the dropzone-upload.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Handles events from the dropzone.
   * @function
   * @private
   */
  _handleEvents() {
    this.options.queuecomplete = function () {
      this.$element.trigger('queuecomplete.zf.dropzone.upload');
    }.bind(this);
  }

  /**
   * Removes all uploaded items.
   * @function
   */
  clear() {
    this.dropzone.removeAllFiles();
  }

  /**
   * Destroys the dropzone-upload plugin.
   * @function
   * @private
   */
  _destroy() {

  }
}

DropzoneUpload.defaults = {};

export {DropzoneUpload};
