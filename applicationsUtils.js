/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

/**
 * Get AppSearchProvider from registered
 * providers. There is try/catch block
 * here because imports.ui.main is part
 * of gnome-shell and can not be used
 * in prefs.js.
 *
 * @return {Mixed}
 */
var provider = () => {
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

var Search = new Lang.Class({

    Name: 'AppUtilsSearch',

    /**
     * Constructor
     *
     * @return {Void}
     */
    _init: function() {
        let dir = [
            '/usr/share/applications',
            GLib.get_home_dir() + '/.local/share/applications',
        ];

        // listen object - file/monitor list
        this._listen = dir.map((path) => {
            let file = Gio.File.new_for_path(path);
            let monitor = file.monitor(Gio.FileMonitorFlags.NONE, null);

            // refresh on each directory change
            monitor.connect('changed', Lang.bind(this, this._handleMonitorChanged));

            return {
                file: file,
                monitor: monitor,
            }
        });
        this._interval = null;
        this._data = {};

        this.refresh();
    },

    /**
     * Destructor
     *
     * @return {Void}
     */
    destroy: function() {
        this._listen.forEach((item) => {
            item.monitor.cancel();
        });
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
        let children = dir.enumerate_children('*', 0, null);
        let result = {};

        let info;
        while ((info = children.next_file(null)) !== null) {
            let id = info.get_name();
            if (!id.match(/\.desktop$/))
                continue;

            let app = Gio.DesktopAppInfo.new(id);
            if (!app || !app.should_show())
                continue;

            result[app.get_id()] = app.get_name();
        }
        children.close(null);

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
     * Refresh data
     *
     * @return {Void}
     */
    refresh: function() {
        let desktopFile = [];
        this._listen.forEach((item) => {
            desktopFile.push(this._desktopFileObject(item.file.get_path()));
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
    find: function(query) {
        let pattern = this._regexQuery(query);
        let result = [];

        this.forEach((id, name) => {
            if (name.match(pattern))
                result.push(id);
        });

        return result;
    },

    /**
     * File monitor changed event handler
     *
     * @param  {Object} monitor
     * @param  {Object} file
     * @param  {Mixed}  otherFile
     * @param  {Number} eventType
     * @return {Void}
     */
    _handleMonitorChanged: function(monitor, file, otherFile, eventType) {
        Mainloop.source_remove(this._interval);

        // handle multiple changes as one with delay
        this._interval = Mainloop.timeout_add(1000, () => {
            this.refresh();

            this._interval = null;
            return !!this._interval;
        }, null);
    },

});
