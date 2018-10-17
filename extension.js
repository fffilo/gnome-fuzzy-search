/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
'use strict';

// import modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Providers = Me.imports.providers;

let settings;

/**
 * Extension initialization
 *
 * @param  {Object} extensionMeta
 * @return {Void}
 */
function init(extensionMeta) {
    // pass
}

/**
 * Extension enable
 *
 * @return {Void}
 */
function enable() {
    settings = Settings.settings();
    settings.connect('changed', () => {
        Providers.refresh();
    });

    Providers.refresh();
}

/**
 * Extension disable
 *
 * @return {Void}
 */
function disable() {
    Providers.disable();

    settings.run_dispose();
    settings = null;
}
