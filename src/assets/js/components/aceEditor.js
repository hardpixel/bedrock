'use strict';

import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.plugin';

/**
 * AceEditor module.
 * @module aceEditor
 */

class AceEditor extends Plugin {
  /**
   * Creates a new instance of an ace-editor.
   * @class
   * @name AceEditor
   * @fires AceEditor#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = 'AceEditor'; // ie9 back compat
    this.$element = element;
    this.options = $.extend({}, AceEditor.defaults, this.$element.data(), options);

    this._init();
  }

  /**
   * Initializes the ace-editor wrapper.
   * @function
   * @private
   */
  _init() {
    if (ace !== 'undefined') {
      this.id = this.$element.attr('id');
      this.eid = `${this.id}-ace-editor`;
      this.$element.wrap('<div class="ace-editor"></div>');
      this.$element.hide();

      this.$editor = $(`<div id="${this.eid}"></div>`);
      this.$element.parent().append(this.$editor);

      this.editor = ace.edit(this.eid);
      this.editor.setValue(this.$element[0].value, 1);
      this.editor.setTheme(`ace/theme/${this.options.theme}`);
      this.editor.session.setMode(`ace/mode/${this.options.mode}`);

      this._events();
    } else {
      console.log('AceEditor is not available! Please download and install AceEditor.');
    }
  }

  /**
   * Adds event handlers to the ace-editor.
   * @function
   * @private
   */
  _events() {
    this.editor.on('change', this._change.bind(this));
  }

  /**
   * Updates textarea value on editor changes.
   * @param {Object} event - Event object passed from listener.
   * @function
   * @private
   */
  _change(event) {
    this.$element[0].value = this.editor.getValue();
  }

  /**
   * Destroys the ace-editor plugin.
   * @function
   * @private
   */
  _destroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;

      this.$editor.remove();
      this.$element.show();
      this.$element.unwrap();
    } else {
      console.log('No editor instance found! Maybe you are missing AceEditor.');
    }
  }
}

AceEditor.defaults = {
  theme: 'monokai',
  mode: 'html',
};

export {AceEditor};
