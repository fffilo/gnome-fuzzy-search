/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
//const ExtensionUtils = imports.misc.extensionUtils;
//const Me = ExtensionUtils.getCurrentExtension();

/**
 * Provider description
 * (label displayed in settings)
 *
 * @return {String}
 */
const description = () => {
    return 'Terminal';
}

/**
 * Can fuzzy search be added to
 * this provider
 *
 * @return {Boolean}
 */
const enabled = () => {
    return false;
}

/**
 * Get search state
 * (is fuzzy search enabled)
 *
 * @return {Boolean}
 */
const getState = () => {
    return false;
}

/**
 * Set search state
 *
 * @param  {Boolean} state
 * @return {Void}
 */
const setState = (state) => {
    // pass
}
