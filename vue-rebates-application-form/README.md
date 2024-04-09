Browards Rebate Application Form
===

Notes
---

Using Mix 6.0

There are 3 entry points. To build, comment out all except the one you're building


Add the following to your package.json:

{
"vue-rebates-application-form": "git+https://elambro:Mv7sQAQhCUM7tcR69WTc@bitbucket.org/browards/vue-rebates-application-form.git"
}

Getting started
---
- Run `npm install`
- For `production` Run `npm run build`
- For `local` Run `npm run build:local` to build the JS or `npm run build:local:watch` to watch JS files and build on the fly

Notes
---

- Make sure the 'build' script uses Windows friendly syntax to run. In package.json: SET NODE_ENV=production & webpack -p


Example
---

<script>

import Vue from 'vue/dist/vue.js'
window.Vue = Vue;

require('vue-rebates-application-form')

const app = new Vue({
  el: '#app'
});

</script>

Then you can use

<div id="app">
	<rebates-application-form></rebates-application-form>
</div>
