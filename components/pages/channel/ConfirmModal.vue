<template>
	<modal
		name="modal-confirm-cost"
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
					個別チャンネルを作成しますか？
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
					<button
						type="button"
						class="font12 sc-button min_w80 md-color-white sc-button-small sc-button-secondary waves-effect waves-button"
						@click="click()"
					>
						はい
					</button>
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
	}),

	async asyncData ( {app, params, error} ) {
	},
	methods: {
		click () {
			this.$emit('next');
			this.hide();
		},
		hide () {
			this.$modal.hide('modal-confirm-cost')
		},
		beforeOpen (event) {
		},
		beforeClose (event) {
		},
	},
}
</script>
