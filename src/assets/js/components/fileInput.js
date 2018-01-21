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

    this._toggleEmpty();
    this._events();
  }

  /**
   * Adds event handlers to the file-input.
   * @function
   * @private
   */
  _events() {
    this.$input.off('change').on({
      'change': this._update.bind(this)
    });

    this.$element.off('click', '[data-dz-remove]').on({
      'click': this._remove.bind(this)
    }, '[data-dz-remove]');

    this.$element.off('click', '[data-dz-change]').on({
      'click': this._change.bind(this)
    }, '[data-dz-change]');

    this.$element.off('dragover').on({
      'dragover': this._activate.bind(this)
    });

    this.$element.off('dragleave dragend').on({
      'dragleave': this._deactivate.bind(this),
      'dragend': this._deactivate.bind(this)
    });
  }

  /**
   * Hides the empty state element.
   * @function
   * @private
   */
  _hideEmpty() {
    this.$empty.hide();
    this.$empty.addClass('hide');
  }

  /**
   * Shows the empty state element.
   * @function
   * @private
   */
  _showEmpty() {
    this.$empty.show();
    this.$empty.removeClass('hide');
  }

  /**
   * Toggles the empty state element.
   * @function
   * @private
   */
  _toggleEmpty() {
    var children = this.$preview.children().length;
    this._hideEmpty();

    if (!children) {
      this._showEmpty();
    }
  }

  /**
   * Creates preview for loaded file.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _updatePreview(event) {
    var preview = this.$item.clone();
    preview.find('[data-dz-thumbnail]').attr('src', event.target.result);

    this._deactivate();
    this._hideEmpty();
    this.$preview.html(preview);
  }

  /**
   * Highlights the empty wrapper.
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _activate(event) {
    if (event) {
      event.stopPropagation();
    }

    this.$element.addClass('dz-drag-hover');
  }

  /**
   * Un highlights the empty wrapper.
   * @param {Object} event - Event object passed from listener.
   * @private
   * @function
   */
  _deactivate(event) {
    if (event) {
      event.stopPropagation();
    }

    this.$element.removeClass('dz-drag-hover');
  }

  /**
   * Creates preview when input changes.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _update(event) {
    var input = event.target;

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = this._updatePreview.bind(this);
      reader.readAsDataURL(input.files[0]);
    }
  }

  /**
   * Reopens file select dialog.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _change(event) {
    event.preventDefault();
    this.$input.click();
  }

  /**
   * Removes preview and shows empty state.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _remove(event) {
    event.preventDefault();

    this._deactivate();
    this._showEmpty();
    this.$preview.html('');
  }

  /**
   * Destroys the file-input plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$input.off('change');
    this.$element.off('click', '[data-dz-remove]');
    this.$element.off('click', '[data-dz-change]');
    this.$element.off(['dragover', 'dragleave', 'dragend']);
  }
}

FileInput.defaults = {};

export {FileInput};
