'use strict';

import $ from 'jquery';
import { GetYoDigits } from 'foundation-sites/js/foundation.util.core';

/**
 * Gets an element ID or generates a random one.
 * @function
 * @param {Object} obj - Object to get value from.
 * @param {String} path - Dot separated object key path.
 */
function GetObjectValue(obj, path) {
  return new Function('_', `return _.${path}`)(obj);
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
