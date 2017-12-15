'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

var SeoPreview = require('yoastseo').SnippetPreview;
var SeoApp = require('yoastseo').App;

/**
 * SeoAnalysis module.
 * @module seoAnalysis
 */

class SeoAnalysis extends Plugin {
  /**
   * Creates a new instance of an seo-analysis.
   * @class
   * @name SeoAnalysis
   * @fires SeoAnalysis#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'SeoAnalysis'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, SeoAnalysis.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the seo-analysis wrapper.
   * @function
   * @private
   */
  _init() {
    this.id = this.$element.attr('id');
    this.$preview = this.$element.find('[data-seo-preview]');
    this.$output = this.$element.find('[data-seo-output]');
    this.$keywordField = this.$element.find('[data-seo-keyword]');
    this.$contentField = $(`#${this.options.content}`);
    this.outputId = `${this.id}-output`;

    this.$output.attr('id', this.outputId);

    this.seoPreview = new SeoPreview({
      targetElement: this.$preview.get(0)
    });

    this.seoApp = new SeoApp({
      snippetPreview: this.seoPreview,
      targets: {
        output: this.outputId
      },
      callbacks: {
        getData: this._dataCallback.bind(this)
      }
    });

    this.seoApp.refresh();

    this._setPreviewWrappers();
    this._setPreviewIcons();

    this._events();
  }

  /**
   * Adds event handlers to the seo-analysis.
   * @function
   * @private
   */
  _events() {
    this.$keywordField.off('change').on({
      'change': this.seoApp.refresh.bind(this.seoApp)
    });

    this.$contentField.off('change').on({
      'change': this.seoApp.refresh.bind(this.seoApp)
    });
  }

  /**
   * Sets custom icons in snippet preview.
   * @function
   * @private
   */
  _setPreviewIcons() {
    var icons = $.extend({}, this.$preview.data());
    var items = {
      'iconDesktop': '.snippet-editor__view-icon-desktop',
      'iconMobile': '.snippet-editor__view-icon-mobile',
      'iconEdit': '.snippet-editor__edit-button'
    };

    $.each(items, function (index, value) {
      this.$preview.find(value).html(`<i class="${icons[index]}"></i>`);
    }.bind(this));
  }

  /**
   * Sets snippet preview wrappers.
   * @function
   * @private
   */
  _setPreviewWrappers() {
    var view = this.$element.find('.snippet-editor__view')
    view.wrapAll('<div class="seo-preview-variants"></div>');

    var btns = this.$element.find('.snippet-editor__edit-button, .snippet-editor__view-toggle');
    btns.wrapAll('<div class="seo-preview-actions"></div>');
  }

  /**
   * Callback for seo app data.
   * @function
   * @private
   */
  _dataCallback() {
    return {
      keyword: this.$keywordField.val(),
      text: this.$contentField.val()
    };
  }

  /**
   * Destroys the seo-analysis plugin.
   * @function
   * @private
   */
  _destroy() {
    this.$preview.html('');
    this.$output.html('');

    this.$keywordField.off('change');
    this.$contentField.off('change');
  }
}

SeoAnalysis.defaults = {};

export {SeoAnalysis};
