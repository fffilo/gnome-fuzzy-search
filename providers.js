/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

// list of all providers
const All = [
    // schema key, provider
    ['applications', 'applicationsSearchProvider'],
    ['gnome-calculator', 'calculatorSearchProvider'],
    ['org-gnome-calendar', 'calendarSearchProvider'],
    ['org-gnome-contacts', 'contactsSearchProvider'],
    ['gnome-control-center', 'controlCenterSearchProvider'],
    ['org-gnome-documents', 'documentsSearchProvider'],
    ['org-gnome-nautilus', 'nautilusSearchProvider'],
    ['org-gnome-photos', 'photosSearchProvider'],
    ['seahorse', 'seahorseSearchProvider'],
    ['org-gnome-software', 'softwareSearchProvider'],
    ['gnome-terminal', 'terminalSearchProvider'],
];

/**
 * Set states for each provider
 * from settings
 *
 * @return {Void}
 */
const refresh = () => {
    let settings = Settings.settings();

    disable();
    All.forEach((item) => {
        let key = item[0];
        let name = item[1];
        let provider = Me.imports[name];

        global.log("Fuzzy", "refresh", key, settings.get_boolean(key));
        provider.setState(settings.get_boolean(key));
    });

    settings.run_dispose();
}

/**
 * Disable all search providers
 *
 * @type {Void}
 */
const disable = () => {
    All.forEach((item) => {
        let key = item[0];
        let name = item[1];
        let provider = Me.imports[name];

        global.log("Fuzzy", "disable", key, false);
        provider.setState(false);
    });
}
