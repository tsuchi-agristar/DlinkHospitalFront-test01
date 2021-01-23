<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/channel/">
							チャンネル一覧
						</nuxt-link>
					</li>
					<li>
						<span>
							個別チャンネル編集画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<div class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>個別チャンネル編集</span>
							</h4>
							<div class="uk-grid" data-uk-grid>
								<div class="uk-width-1-1@m " uk-first-column>
									<label class="uk-form-label" for="start_at">
										<span class="contact_label required">必須</span>開始日
									</label>
									<div class="uk-form-controls">
										<div class="uk-grid">
											<div class="uk-width-1-1@m uk-margin-medium-top uk-first-column">
												<ScInput
													id="start_at"
													v-model="$v.channel_dt.start_at.$model"
													v-flatpickr="dpTimePicker"
													:error-state="$v.channel_dt.start_at.$error"
													:validator="$v.channel_dt.start_at"
													mode="outline"
												>
													<label>開始日</label>
												</ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.channel_dt.start_at.required">
														必須項目です
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-grid" data-uk-grid>
								<div class="uk-width-1-1@m uk-first-column">
									<label class="uk-form-label" for="hospital_id">
										<span class="contact_label required">必須</span>学校
									</label>
									<div class="uk-form-controls">
										<client-only>
											<Select2
												id="hospital_id"
												v-model="$v.channel_dt.organization_id.$model"
												:error-state="$v.channel_dt.organization_id.$error"
												:validator="$v.channel_dt.organization_id"
												class="uk-select2"
												:settings="{ 'width': '100%', 'placeholder': '選択してください', allowClear: false, 'closeOnSelect': true }"
											>
												<option
													v-for="data in school_dtlist"
													:key="data.organization_id"
													:value="data.organization_id"
												>
													{{ data.organization_name }}
												</option>
											</Select2>
											<ul class="sc-vue-errors">
												<li v-if="!$v.channel_dt.organization_id.required">
													必須項目です
												</li>
											</ul>
										</client-only>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-flex-left uk-text-center">
								<button
									v-waves.button.light
									class="sc-button sc-button-secondary"
									:class="[{'sc-button-progress': btnLoading}]"
									:disabled="btnLoading"
									@click.prevent="updateIndividualChannnel()"
								>
									<span v-if="!btnLoading">変更</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import { ScProgressCircular } from "~/components/ui/progress";
import { CONST } from '~/const.js';
import _ from 'lodash';
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { Japanese } from "flatpickr/dist/l10n/ja.js"
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import moment from 'moment'
if(process.client) {
	require('~/plugins/flatpickr');
}
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		Japanese,
		btnLoading: false,
	}),
	computed: {
		dpTimePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: true,
				time_24hr: true,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d H:i:00",
			}
		},
	},
	async asyncData ( {app, params} ) {
		let channel = await app.$axios.get(`/api/channel/${params.channel_id}`);
		let school = await app.$axios.get(`/api/organization`);
		return {
			channel_dt: {
				start_at: moment(_.get(channel.data, "event.start_at")).format("YYYY-MM-DD HH:mm:00"),
				organization_id: _.first(_.filter(_.get(channel.data, "event_member"), (dt) => dt.member_role === CONST.member_role.OTHER.value)).organization.organization_id
			},
			school_dtlist: school.data
		}
	},
	mounted () {
	},
	methods: {
		async updateIndividualChannnel () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}
			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/individualEvent/${this.$route.params.channel_id}`, {
				organization_id: this.channel_dt.organization_id,
				start_at: this.channel_dt.start_at
			});
			if (res.error) {
				this.btnLoading = false;
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				UIkit.notification("登録しました");
				this.btnLoading = false;
				this.$router.go(-1);
			}
			this.btnLoading = false;
		},
	},
	validations: {
		channel_dt: {
			start_at: {
				required,
			},
			organization_id: {
				required,
			},
		}
	}
}
</script>
<style lang="scss">
</style>
