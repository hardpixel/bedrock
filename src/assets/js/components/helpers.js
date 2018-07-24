'use strict';

import $ from 'jquery';
import { GetYoDigits } from 'foundation-sites/js/foundation.util.core';

/**
 * Gets an element ID or generates a random one.
 * @function
 * @param {Object} obj - Object to get value from.
 * @param {String} path - Dot separated object key path.
 */
function GetObjectValue(obj, path, alt_path = null) {
  var value = new Function('_', `return _.${path}`)(obj);

  if (typeof value == 'undefined' || value == null) {
    value = new Function('_', `return _.${alt_path}`)(obj);
  }

  return value;
}

/**
 * Gets an element ID or generates a random one.
 * @function
 * @param {jQuery} element - jQuery object to test for id.
 * @param {String} namespace - Namespace for the generated id.
 */
function GetOrSetId(element, namespace = 'random') {
  var id = element.attr('id');

  if (!id) {
    id = GetYoDigits(6, namespace);
    element.attr('id', id);
  }

  return id;
};

export { GetObjectValue, GetOrSetId };
