/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

// list of all providers
var ALL = [
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
var refresh = () => {
    let settings = Settings.settings();

    disable();
    ALL.forEach((item) => {
        let key = item[0];
        let name = item[1];
        let provider = Me.imports[name];
        let state = settings.get_boolean(key);

        provider.setState(state);
    });

    settings.run_dispose();
}

/**
 * Disable all search providers
 *
 * @type {Void}
 */
var disable = () => {
    ALL.forEach((item) => {
        let key = item[0];
        let name = item[1];
        let provider = Me.imports[name];
        let state = false;

        provider.setState(state);
    });
}
