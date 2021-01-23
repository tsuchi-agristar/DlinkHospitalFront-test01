import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, { componentName: "modal", dynamic: true, dynamicDefaults: { clickToClose: false } })
/*
By default, the plugin will use "modal" name for the component.
If you need to change it, you can do so by providing "componentName" param.

Example:

Vue.use(VModal, { componentName: "foo-modal" })
...
<foo-modal name="bar"></foo-modal>
*/
