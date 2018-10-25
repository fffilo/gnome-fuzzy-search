GNOME Fuzzy Search
==================

Append [fuzzy search](https://en.wikipedia.org/wiki/Approximate_string_matching) results to [Gnome Search](https://developer.gnome.org/SearchProvider/).

## How It Works

The plugin injects it's own callback to `getResultSet` method in each registrated provider which appends new search results.
This means that it does not change default result set, just adds new results to existing ones.

The search query is interpreted as there is an _any_ character between each query character.
For example query `goocrm` searches `*g*o*o*c*r*m*` (where `*` is _any_ character) in application names (ignoring case sensitivity),
so `Google Chrome` is matched (**Goo**gle **C**h**r**o**m**e).

##### Fuzzy Search Disabled
![fuzzy search disabled](screenshot_before.png "Fuzzy Search Disabled")

##### Fuzzy Search Enabled
![fuzzy search enabled](screenshot_after.png "Fuzzy Search Enabled")

## Settings
![fuzzy search enabled](screenshot_settings.png "Settings")

_This project is still work in progress, so for now you can only add fuzzy search results to AppSearchProvider._

## Installation

- install using [GNOME Shell extension website](https://extensions.gnome.org/extension/1488/gnome-fuzzy-search/)
- build and install from source
    - download source from [GitHub](https://github.com/fffilo/gnome-fuzzy-search) (clone repository or download zip)
    - from `gnome-fuzzy-search` directory execute `make install`
- bash one-liner
    - `wget https://raw.githubusercontent.com/fffilo/gnome-fuzzy-search/master/install.sh -O - | bash`
