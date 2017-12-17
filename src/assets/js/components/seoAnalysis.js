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

    this.$titleField = $(`#${this.options.title}`);
    this.$metaField = $(`#${this.options.meta}`);
    this.$slugField = $(`#${this.options.slug}`);

    this.$keywordField = this.$element.find('[data-seo-keyword]');
    this.$textField = $(`#${this.options.text}`);

    this.defaultValues = {
      title: this.$titleField.val() || this.$titleField.attr('data-default'),
      metaDesc: this.$metaField.val() || this.$metaField.attr('data-default'),
      urlPath: this.$slugField.val() || this.$slugField.attr('data-default')
    }

    this.outputId = `${this.id}-output`;
    this.$output.attr('id', this.outputId);

    this.seoPreview = new SeoPreview({
      baseURL: `${this.options.baseUrl}/`,
      targetElement: this.$preview.get(0),
      addTrailingSlash: false,
      data: this.defaultValues
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

    this.$titleFieldProxy = $('#snippet-editor-title');
    this.$metaFieldProxy = $('#snippet-editor-meta-description');
    this.$slugFieldProxy = $('#snippet-editor-slug');

    this.$titleFieldProxy.val(this.defaultValues['title']);
    this.$metaFieldProxy.val(this.defaultValues['metaDesc']);
    this.$slugFieldProxy.val(this.defaultValues['urlPath']);

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

    this.$textField.off('change').on({
      'change': this.seoApp.refresh.bind(this.seoApp)
    });

    this.$titleField.on('input', function(event) {
      this.$titleFieldProxy.val(this.$titleField.val());
      this.seoApp.refresh();
    }.bind(this));

    this.$slugField.on('input', function(event) {
      this.$slugFieldProxy.val(this.$slugField.val());
      this.seoApp.refresh();
    }.bind(this));

    this.$metaField.on('input', function(event) {
      this.$metaFieldProxy.val(this.$metaField.val());
      this.seoApp.refresh();
    }.bind(this));

    this.$titleFieldProxy.on('input', function(event) {
      this.$titleField.val(this.$titleFieldProxy.val());
      this.seoApp.refresh();
    }.bind(this));

    this.$slugFieldProxy.on('input', function(event) {
      this.$slugField.val(this.$slugFieldProxy.val());
      this.seoApp.refresh();
    }.bind(this));

    this.$metaFieldProxy.on('input', function(event) {
      this.$metaField.val(this.$metaFieldProxy.val());
      this.seoApp.refresh();
    }.bind(this));
  }

  /**
   * Sets custom icons in snippet preview.
   * @function
   * @private
   */
  _setPreviewIcons() {
    var items = {
      'iconDesktop': '.snippet-editor__view-icon-desktop',
      'iconMobile': '.snippet-editor__view-icon-mobile',
      'iconEdit': '.snippet-editor__edit-button'
    };

    $.each(items, function (index, value) {
      this.$preview.find(value).html(`<i class="${this.options[index]}"></i>`);
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
      text: this.$textField.val()
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
    this.$textField.off('change');
  }
}

SeoAnalysis.defaults = {
  baseUrl: 'example.com',
  iconDesktop: 'mdi mdi-desktop-mac',
  iconMobile: 'mdi mdi-cellphone',
  iconEdit: 'mdi mdi-pencil'
};

export {SeoAnalysis};
