<template>
	<modal
		name="modal-enter-channel"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-horizontal">
			<div class="uk-padding-small uk-padding-remove-bottom flexmiddle">
				<div class="vm--title uk-card-title">
					入室しますか？
				</div>
				<button
					type="button"
					class="close-button"
					@click="hide()"
				>
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="uk-padding-small uk-text-center">
				<div
					class="uk-text-right"
				>
					<button
						type="button"
						class="sc-button sc-button-flat uk-modal-close"
						@click="hide()"
					>
						キャンセル
					</button>
					<nuxt-link :to="`/meeting?roomName=${event_dt.event_id}`" class="font12 sc-button min_w80 md-color-white sc-button-small sc-button-secondary waves-effect waves-button uk-modal-close">
						入室
					</nuxt-link>
				</div>
			</div>
		</div>
	</modal>
</template>
<script>
import { CONST } from '~/const.js';
export default {
	components: {
	},
	data: () => ({
		event_dt: "",
	}),

	async asyncData ( {app, params, error} ) {
	},
	methods: {
		hide () {
			this.$modal.hide('modal-enter-channel')
		},
		beforeOpen (event) {
			this.event_dt = event.params;
		},
		beforeClose (event) {
		},
	},
}
</script>
<style scoped lang="scss">
	.flexmiddle{
		display: flex;
		align-items: center;
	}
</style>
