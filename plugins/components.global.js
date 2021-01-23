import Vue from 'vue'
import { ScCard, ScCardHeader, ScCardTitle, ScCardMeta, ScCardActions, ScCardBody, ScCardContent, ScCardFooter } from '~/components/ui/card'
import ScTransition from '~/components/ui/Transitions'

const components = {
	ScCard,
	ScCardHeader,
	ScCardTitle,
	ScCardMeta,
	ScCardActions,
	ScCardBody,
	ScCardContent,
	ScCardFooter,
	ScTransition
};

Object.entries(components).forEach(([name, component]) => {
	Vue.component(name, component)
});
