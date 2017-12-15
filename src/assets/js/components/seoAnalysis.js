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
    this.$preview = this.$element.find('[data-seo-preview]');
    this.$output = this.$element.find('[data-seo-output]');
    this.$keywordField = this.$element.find('[data-seo-keyword]');
    this.$contentField = $(`#${this.options.content}`);

    var focusKeywordField = this.$keywordField.get(0);
    var contentField = this.$contentField.get(0);

    var snippetPreview = new SeoPreview({
      targetElement: this.$preview.get(0)
    });

    var app = new SeoApp({
      snippetPreview: snippetPreview,
      targets: {
        output: this.$output.get(0)
      },
      callbacks: {
        getData: function() {
          return {
            keyword: focusKeywordField.value,
            text: contentField.value
          };
        }
      }
    });

    app.refresh();

    focusKeywordField.addEventListener('change', app.refresh.bind(app));
    contentField.addEventListener('change', app.refresh.bind(app));
  }

  /**
   * Adds event handlers to the seo-analysis.
   * @function
   * @private
   */
  _events() {

  }

  /**
   * Destroys the seo-analysis plugin.
   * @function
   * @private
   */
  _destroy() {

  }
}

SeoAnalysis.defaults = {};

export {SeoAnalysis};
