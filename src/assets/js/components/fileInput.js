'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var downscale = require('downscale');
var fileSize = require('filesize');

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
    this.$grid = this.$element.find('[data-list-remove]');
    this.$input = this.$element.find('input[type="file"]');
    this.$controls = this.$element.find('[data-dz-controls]');
    this.$removeInput = this.$element.find('[data-dz-remove-input]');
    this.multiple = this.$input.is('[multiple]');
    this.thumbWidth = parseInt(this.options.thumbnailWidth);
    this.thumbHeight = parseInt(this.options.thumbnailHeight);

    this._hideEmpty();
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

    this.$grid.off('changed.zf.remove.list').on({
      'changed.zf.remove.list': this._toggleEmpty.bind(this)
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
    this.$controls.removeClass('hide');
    this.$empty.hide();
    this.$empty.addClass('hide');
  }

  /**
   * Shows the empty state element.
   * @function
   * @private
   */
  _showEmpty() {
    this.$controls.addClass('hide');
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

    if (!children) {
      this._showEmpty();
    }
  }

  /**
   * Creates preview for loaded file.
   * @param {Integer} index - File index.
   * @param {Object} file - File object from input results.
   * @function
   * @private
   */
  _updatePreview(index, file) {
    var preview = this.$item.clone();
    var filesize = fileSize(file.size, { exponent: 2, output: 'object' });
    var sizestr = '<strong>' + filesize.value + '</strong> ' + filesize.symbol;

    preview.find('[data-dz-name]').text(file.name);
    preview.find('[data-dz-size]').html(sizestr);
    preview.addClass('input-added');

    if (this.thumbWidth > 0 && this.thumbHeight > 0) {
      this._resizeImage(file, preview);
    } else {
      this._previewImage(file, preview);
    }
  }

  /**
   * Resizes image thumbnail.
   * @param {Object} file - File object from input results.
   * @param {Object} preview - Preview template object.
   * @private
   * @function
   */
  _resizeImage(file, preview) {
    downscale(file, this.thumbWidth, this.thumbHeight, { imageType: 'png' })

    .then(function (data) {
      preview.find('[data-dz-thumbnail]').attr('src', data);
      this._appendPreview(preview);
    }.bind(this));
  }

  /**
   * Previews image.
   * @param {Object} file - File object from input results.
   * @param {Object} preview - Preview template object.
   * @private
   * @function
   */
  _previewImage(file, preview) {
    var reader = new FileReader();

    reader.onload = function (event) {
      preview.find('[data-dz-thumbnail]').attr('src', event.target.result);
      this._appendPreview(preview);
    }.bind(this);

    reader.readAsDataURL(file);
  }

  /**
   * Append image preview to preview container.
   * @param {Object} preview - Preview template object.
   * @private
   * @function
   */
  _appendPreview(preview) {
    if (this.multiple) {
      this.$preview.append(preview);
    } else {
      this.$preview.html(preview);
    }
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

    if (input.files) {
      this.$preview.find('.input-added').remove();
      this.$removeInput.prop('checked', false);

      $.each(input.files, this._updatePreview.bind(this));
    }

    this._deactivate();
    this._hideEmpty();
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

    var added = this.$preview.find('.input-added');

    if (added.length) {
      added.remove();
    } else {
      this.$preview.html('');
    }

    this.$input.val('');
    this.$removeInput.prop('checked', true);

    this._deactivate();
    this._toggleEmpty();
  }

  /**
   * Destroys the file-input plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$input.off('change');
    this.$grid.off('changed.zf.remove.list');
    this.$element.off('click', '[data-dz-remove]');
    this.$element.off('click', '[data-dz-change]');
    this.$element.off(['dragover', 'dragleave', 'dragend']);
  }
}

FileInput.defaults = {
  thumbnailWidth: 0,
  thumbnailHeight: 0
};

export {FileInput};
