<template>
	<modal
		name="modal-fair-cancel"
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
					キャンセルしますか？
				</div>
				<button
					type="button"
					class="close-button"
					@click="$modal.hide('modal-fair-cancel')"
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
						@click="$modal.hide('modal-fair-cancel')"
					>
						いいえ
					</button>
					<button
						class="sc-button sc-button-danger waves-effect waves-button waves-light"
						:class="{'sc-button-progress': btnLoading}"
						:disabled="btnLoading"
						@click.prevent="cancelFair()"
					>
						<span v-if="!btnLoading">はい</span>
						<ScProgressCircular v-else light></ScProgressCircular>
					</button>
				</div>
			</div>
		</div>
	</modal>
</template>
<script>
import { CONST } from '~/const.js';
import { ScProgressCircular } from "~/components/ui/progress";
export default {
	components: {
		ScProgressCircular,
	},
	data: () => ({
		fair_dt: "",
		btnLoading: false,
	}),

	async asyncData ( {app, params, error} ) {
	},
	methods: {
		beforeOpen (event) {
			this.fair_dt = event.params;
		},
		beforeClose (event) {
		},
		async cancelFair () {
			this.btnLoading = true;
			let res = await this.$axios.patch(`/api/fair`, {
				fair_id: this.fair_dt.fair_id,
				fair_status: CONST.fair_status.CANCEL.value,
			});
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				await this.$emit('update');
				UIkit.notification("キャンセルしました");
				this.btnLoading = false;
				this.$modal.hide('modal-fair-cancel');
			}
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
