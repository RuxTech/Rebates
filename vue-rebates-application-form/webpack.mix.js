let mix = require('laravel-mix');

// mix.js('src/plugin.js', 'plugin-build.js').vue();

/** OR **/

// mix.js('src/components/RebatesApplicationForm.vue', 'component-build.js').vue()

/** OR **/

mix.js('src/script.js', 'testing.js').vue()

/** AND */

mix.sass('src/scss/style.scss', 'style.css');