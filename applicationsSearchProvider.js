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
let _provider = Utils.provider();

/**
 * Search instance:
 * null on fuzzy search disabled,
 * AppUtilsSearch on enabled
 *
 * @type {Mixed}
 */
let _search = null;

// getInitialResultSet method in AppSearchProvider
let _getInitialResultSet, _fuzzyGetInitialResultSet;
if (_provider) {

    /**
     * Original getInitialResultSet method
     *
     * @type {Function}
     */
    _getInitialResultSet = _provider.__proto__.getInitialResultSet;

    /**
     * New getInitialResultSet method:
     * append fuzzy search to results
     *
     * @param  {Array}           terms
     * @param  {Function}        callback
     * @param  {Gio.Cancellable} cancellable
     * @return {Void}
     */
    // @todo - this does not work with gnome-shell 3.28
    // see why scope (this) is wrong
    //
    // _fuzzyGetInitialResultSet = (terms, callback, cancellable) => {

    _fuzzyGetInitialResultSet = function(terms, callback, cancellable) {
        let preCallback = (result) => {
            _search.find(terms.join(' ')).forEach((item) => {
                if (result.indexOf(item) === -1)
                    result.push(item);
            });

            callback(result);
        }

        // calling original getInitialResultSet method with
        // our own callback where we'll append new search
        // results before executing original callback
        _getInitialResultSet.call(this, terms, preCallback, cancellable);
    }
}

/**
 * Provider description
 * (label displayed in settings)
 *
 * @return {String}
 */
const description = () => {
    return 'Applications';
}

/**
 * Can fuzzy search be added to
 * this provider
 *
 * @return {Boolean}
 */
const enabled = () => {
    return true;
}

/**
 * Get search state
 * (is fuzzy search enabled)
 *
 * @return {Boolean}
 */
const getState = () => {
    if (_provider)
        return _provider.__proto__.getInitialResultSet === _fuzzyGetInitialResultSet;

    return false;
}

/**
 * Set search state
 *
 * @param  {Boolean} state
 * @return {Void}
 */
const setState = (state) => {
    if (!_provider)
        return;

    if (!!state) {
        _search = new Utils.Search();
        _provider.__proto__.getInitialResultSet = _fuzzyGetInitialResultSet;
    }
    else {
        _provider.__proto__.getInitialResultSet = _getInitialResultSet;
        if (_search)
            _search.destroy();
        _search = null;
    }
}
