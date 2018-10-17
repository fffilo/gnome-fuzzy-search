/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

/**
 * Get AppSearchProvider from registered
 * providers. There is try/catch block
 * here because imports.ui.main is part
 * of gnome-shell and can not be used
 * in prefs.js.
 *
 * @return {Mixed}
 */
const provider = () => {
    try {
        const Main = imports.ui.main;
        const AppDisplay = imports.ui.appDisplay;

        let result = null;
        Main.overview.viewSelector._searchResults._providers.forEach((item) => {
            if (!result && item instanceof AppDisplay.AppSearchProvider)
                result = item;
        });

        return result;
    }
    catch(e) {
        return null;
    }
}

/**
 * Execute application search
 *
 * @param  {String} query
 * @return {Array}
 */
const search = (query) => {
    return _cache.search(query);
}

const Cache = new Lang.Class({

    Name: 'AppUtilsCache',

    _init: function() {
        this._data = {};
        this._listen = [ '/usr/share/applications', GLib.get_home_dir() + '/.local/share/applications' ];
        // @todo - set listener to directory and
        // execute this.refresh on each directory
        // change

        this.refresh();
    },

    /**
     * Convert query to regular expression
     * object by adding 'anything' between
     * each query character
     *
     * @param  {String} query
     * @return {RegExp}
     */
    _regexQuery: function(query) {
        let escape = /[|\\{}()[\]^$+*?.]/g;
        let chars = query
            .replace(/\s*/g, '')
            .split('')
                .map((char) => {
                    return char.replace(escape, '\\$&');
                });
        let pattern = ''
            + '.*?'
            + chars.join('.*?')
            + '.*?';

        return new RegExp(pattern, 'i');
    },

    /**
     * Find all desktop files in path and append
     * each id/name to result object
     *
     * @param  {String} path
     * @return {Object}
     */
    _desktopFileObject: function(path) {
        // @todo - async?
        let dir = Gio.file_new_for_path(path);
        let children = dir.enumerate_children('*', 0, null, null);
        let result = {};

        let info;
        while ((info = children.next_file(null, null)) !== null) {
            let id = info.get_name();
            if (!id.match(/\.desktop$/))
                continue;

            let app = Gio.DesktopAppInfo.new(id);
            if (!app || !app.should_show())
                continue;

            result[app.get_id()] = app.get_name();
        }
        children.close(null, null);

        return result;
    },

    /**
     * Data iterator
     *
     * @param  {Function} callback
     * @return {Void}
     */
    forEach: function(callback) {
        for (let id in this._data) {
            callback.call(this, id, this._data[id]);
        }
    },

    /**
     * Refresh cache (this._data object)
     *
     * @return {Void}
     */
    refresh: function() {
        let desktopFile = [];
        this._listen.forEach((path) => {
            desktopFile.push(this._desktopFileObject(path));
        });

        //this._data = Object.assign.apply(Object, desktopFile);

        // @todo - Object.assign does not work
        let result = {};
        desktopFile.reverse().forEach((desktopObject) => {
            for (let key in desktopObject) {
                result[key] = desktopObject[key];
            }
        });
        this._data = result;
    },

    /**
     * Get list of application ids by string query
     *
     * @param  {String} query
     * @return {Array}
     */
    search: function(query) {
        let pattern = this._regexQuery(query);
        let result = [];

        this.forEach((id, name) => {
            if (name.match(pattern))
                result.push(id);
        });

        return result;
    },

});
const _cache = new Cache();
