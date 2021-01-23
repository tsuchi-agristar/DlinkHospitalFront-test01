<template>
	<modal
		name="modal-select-start-date"
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
					開始日時を選択してください
				</div>
				<button type="button" class="close-button" @click="hide()">
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="uk-padding-small">
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="fair_format">開始日時</label>
						<div class="uk-form-controls uk-margin-small-top">
							<div class="uk-grid" data-uk-grid>
								<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
									<ScInput
										id="start_at"
										v-model="$v.start_at.$model"
										v-flatpickr="dpTimePicker"
										:error-state="$v.start_at.$error"
										:validator="$v.start_at"
										mode="outline"
									>
										<label>開始日時</label>
									</ScInput>
									<ul class="sc-vue-errors">
										<li v-if="!$v.start_at.required">
											必須項目です
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-padding-small uk-text-center">
				<button
					v-waves.button.light
					class="sc-button sc-button-secondary"
					:class="{'sc-button-progress': btnLoading}"
					:disabled="btnLoading"
					@click.prevent="addIndividualEvent()"
				>
					<span v-if="!btnLoading">登録</span>
					<ScProgressCircular v-else light></ScProgressCircular>
				</button>
			</div>
		</div>
	</modal>
</template>
<script>
import ScInput from "~/components/ui/Input";
import { ScProgressCircular } from "~/components/ui/progress";
import { Japanese } from "flatpickr/dist/l10n/ja.js";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate";
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
if(process.client) {
	require('~/plugins/flatpickr');
}
export default {
	components: {
		ScInput,
		ScProgressCircular
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		start_at: null,
		Japanese,
		organization_id: null,
	}),
	computed: {
		dpTimePicker () {
			const self = this;
			return {
				locale: self.Japanese,
				enableTime: true,
				time_24hr: true,
				plugins: [
					new confirmDatePlugin({
						confirmIcon: "<i class='mdi mdi-check'></i>",
						confirmText: ""
					})
				],
				dateFormat: "Y-m-d H:i:00",
				minDate: "today"
			};
		}
	},

	methods: {
		async addIndividualEvent () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}
			let res;
			this.btnLoading = true;
			res = await this.$axios.post(`/api/individualEvent`, {
				organization_id: this.organization_id,
				start_at: this.start_at
			});
			if (res.error) {
				this.btnLoading = false;
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				await this.$emit('update');
				UIkit.notification("登録しました");
				this.btnLoading = false;
				this.hide();
			}
		},
		hide () {
			this.$modal.hide("modal-select-start-date");
		},
		beforeOpen (event) {
			this.organization_id = event.params;
		},
		beforeClose (event) {}
	},
	validations: {
		start_at: {
			required
		}
	}
};
</script>
