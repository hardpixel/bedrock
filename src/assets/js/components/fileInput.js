'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * FileInput module.
 * @module fileInput
 */

class FileInput extends Plugin {
  /**
   * Creates a new instance of an file-input.
   * @class
   * @name FileInput
   * @fires FileInput#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'FileInput'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, FileInput.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the file-input wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.template = $(`#${this.id}-preview-template`).html();
    this.$item = $(this.template);
    this.$preview = $(this.options.previewsContainer);
    this.$empty = this.$element.find('.dz-message');
    this.$input = this.$element.find('input[type="file"]');

    this._events();
  }

  /**
   * Adds event handlers to the file-input.
   * @function
   * @private
   */
  _events() {
    var input = this.$input.get(0);

    this.$input.on('change', function(event) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          var preview = this.$item.clone();
          preview.find('[dz-thumbnail]').attr('src', e.target.result);

          this.$empty.hide();
          this.$preview.html(preview);
        }.bind(this);

        reader.readAsDataURL(input.files[0]);
      }
    }.bind(this));

    this.$element.on('click', '[dz-remove]', function(event) {
      event.preventDefault();

      this.$empty.show();
      this.$preview.html('');
    }.bind(this));
  }

  /**
   * Destroys the file-input plugin.
   * @function
   * @private
   */
  _destroy() {

  }
}

FileInput.defaults = {};

export {FileInput};
