'use strict';

import $ from 'jquery';
import { GetYoDigits } from 'foundation-sites/js/foundation.util.core';

const extName = require('ext-name');
const mimeMatch = require('mime-match');

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

/**
 * Checks if a filename matches a mimetype regex.
 * @function
 * @param {jQuery} element - jQuery object to test for id.
 * @param {String} namespace - Namespace for the generated id.
 */
function MatchMimeType(filename, match_regex) {
  var type = null;
  var match = false;
  var info = extName(filename);

  if (info.length && match_regex) {
    try {
      type = info[0]['mime'];
      match = mimeMatch(type, match_regex);
    } catch (e) {
      match = false;
    }
  }

  return match;
};

export { GetObjectValue, GetOrSetId, MatchMimeType };
