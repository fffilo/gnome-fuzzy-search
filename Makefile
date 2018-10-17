INSTALL_PATH = ~/.local/share/gnome-shell/extensions
INSTALL_NAME = gnome-fuzzy-search@gnome-shell-exstensions.fffilo.github.com
BUILD_DIR = _build
FILES = applicationsSearchProvider.js applicationsUtils.js calculatorSearchProvider.js calendarSearchProvider.js contactsSearchProvider.js controlCenterSearchProvider.js convenience.js documentsSearchProvider.js extension.js metadata.json nautilusSearchProvider.js photosSearchProvider.js prefs.css prefs.js providers.js README.md schemas/ screenshot_after.png screenshot_before.png screenshot_settings.png seahorseSearchProvider.js settings.js softwareSearchProvider.js stylesheet.css terminalSearchProvider.js translation.js

install: build
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)
	mkdir -p $(INSTALL_PATH)/$(INSTALL_NAME)
	cp -r --preserve=timestamps $(BUILD_DIR)/* $(INSTALL_PATH)/$(INSTALL_NAME)
	rm -rf $(BUILD_DIR)
	echo Installed in $(INSTALL_PATH)/$(INSTALL_NAME)

archive: build
	cd ${BUILD_DIR} && zip -r ../archive.zip *
	rm -rf $(BUILD_DIR)
	echo Archive created

build: compile-schema
	rm -rf $(BUILD_DIR)
	mkdir $(BUILD_DIR)
	cp -r --preserve=timestamps $(FILES) $(BUILD_DIR)
	echo Build was successfull

compile-schema:
	glib-compile-schemas schemas

clean:
	rm -rf $(BUILD_DIR)

uninstall:
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)
