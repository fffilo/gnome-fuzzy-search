/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Utils = Me.imports.applicationsUtils;

/**
 * Application search provider instance in
 * registrated providers
 *
 * @type {AppSearchProvider}
 */
let provider = Utils.provider();

/**
 * Search instance:
 * null on fuzzy search disabled,
 * AppUtilsSearch on enabled
 *
 * @type {Mixed}
 */
let search = null;

// getInitialResultSet method in AppSearchProvider
let getInitialResultSet, fuzzyGetInitialResultSet;
if (provider) {

    /**
     * Original getInitialResultSet method
     *
     * @type {Function}
     */
    getInitialResultSet = provider.__proto__.getInitialResultSet;

    /**
     * New getInitialResultSet method:
     * append fuzzy search to results
     *
     * @param  {Array}           terms
     * @param  {Function}        callback
     * @param  {Gio.Cancellable} cancellable
     * @return {Void}
     */
    fuzzyGetInitialResultSet = (terms, callback, cancellable) => {
        let decorator = (result) => {
            search.find(terms.join(' ')).forEach((item) => {
                if (result.indexOf(item) === -1)
                    result.push(item);
            });

            callback(result);
        }

        // calling original getInitialResultSet method with
        // our own callback where we'll append new search
        // results before executing original callback
        getInitialResultSet.call(provider, terms, decorator, cancellable);
    }
}

/**
 * Provider description
 * (label displayed in settings)
 *
 * @return {String}
 */
var description = () => {
    return 'Applications';
}

/**
 * Can fuzzy search be added to
 * this provider
 *
 * @return {Boolean}
 */
var enabled = () => {
    return true;
}

/**
 * Get search state
 * (is fuzzy search enabled)
 *
 * @return {Boolean}
 */
var getState = () => {
    if (provider)
        return provider.__proto__.getInitialResultSet === fuzzyGetInitialResultSet;

    return false;
}

/**
 * Set search state
 *
 * @param  {Boolean} state
 * @return {Void}
 */
var setState = (state) => {
    if (!provider)
        return;

    if (!!state) {
        search = new Utils.Search();
        provider.__proto__.getInitialResultSet = fuzzyGetInitialResultSet;
    }
    else {
        provider.__proto__.getInitialResultSet = getInitialResultSet;
        if (search)
            search.destroy();
        search = null;
    }
}
