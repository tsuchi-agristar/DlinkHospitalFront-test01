<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>基本情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="organization_name">
											<span class="contact_label required">必須</span>病院名
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name"
												v-model="$v.profile_dt.organization_name.$model"
												:error-state="$v.profile_dt.organization_name.$error"
												:validator="$v.profile_dt.organization_name"
												placeholder="病院名"
												mode="outline"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.organization_name.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.organization_name.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="organization_name_kana">
											<span class="contact_label required">必須</span>病院名フリガナ
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name_kana"
												v-model="$v.profile_dt.organization_name_kana.$model"
												:error-state="$v.profile_dt.organization_name_kana.$error"
												:validator="$v.profile_dt.organization_name_kana"
												placeholder="ビョウインメイ"
												mode="outline"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.organization_name_kana.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.organization_name_kana.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="address"><span class="contact_label required">必須</span>住所</label>
										<!-- <div class="uk-form-controls">
											<client-only>
												<Select2
													id="prefecture"
													v-model="$v.profile_dt.prefecture.$model"
													class="uk-select2"
													:error-state="$v.profile_dt.prefecture.$error"
													:validator="$v.profile_dt.prefecture"
													:settings="{ 'width': '100%', 'placeholder': '都道府県', allowClear: true }"
												>
													<option
														v-for="prefecture in prefecture_list"
														:key="prefecture"
														:value="prefecture"
													>
														{{ prefecture }}
													</option>
												</Select2>
												<ul class="sc-vue-errors">
													<li v-if="!$v.profile_dt.prefecture.required">
														必須項目です
													</li>
												</ul>
											</client-only>
										</div> -->
									</div>
									<div class="uk-width-1-1@m uk-first-column uk-margin-small">
										<div class="uk-first-column">
											<ScInput
												:value="profile_dt.prefecture"
												mode="outline"
												disabled
											>
												<span slot="icon" class="uk-form-icon" data-uk-icon="icon: lock"></span>
											</ScInput>
											<div>
												<p class="md-color-grey-700 uk-margin-small-top uk-margin-small-bottom font12">※ 都道府県の変更はできません</p>
											</div>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="city"
												v-model="$v.profile_dt.city.$model"
												:error-state="$v.profile_dt.city.$error"
												:validator="$v.profile_dt.city"
												placeholder="市区町村"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.city.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.city.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="address"
												v-model="$v.profile_dt.address.$model"
												:error-state="$v.profile_dt.address.$error"
												:validator="$v.profile_dt.address"
												placeholder="町名番地"
												mode="outline"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.address.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.address.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="homepage"><span class="contact_label">任意</span>HP</label>
										<div class="uk-form-controls">
											<ScInput
												id="homepage"
												v-model="$v.profile_dt.homepage.$model"
												:error-state="$v.profile_dt.homepage.$error"
												:validator="$v.profile_dt.homepage"
												placeholder="https://example.com"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.homepage.url">
													形式が正しくありません
												</li>
												<li v-if="!$v.profile_dt.homepage.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="mail_address">
											<span class="contact_label required">必須</span>メールアドレス
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="mail_address"
												v-model="$v.profile_dt.mail_address.$model"
												:error-state="$v.profile_dt.mail_address.$error"
												:validator="$v.profile_dt.mail_address"
												placeholder="info@example.jp"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.mail_address.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.mail_address.email">
													形式が正しくありません
												</li>
												<li v-if="!$v.profile_dt.mail_address.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>詳細情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="school_type">
											<span class="contact_label">任意</span>病院種別
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="hospital_type"
													v-model="$v.profile_dt.hospital_type.$model"
													:error-state="$v.profile_dt.hospital_type.$error"
													:validator="$v.profile_dt.hospital_type"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in hospitalType"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-flex-left">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[ inputDiff === true ? 'sc-button-disabled' : 'sc-button-secondary' ]"
									:disabled="btnLoading || inputDiff"
									@click.prevent="saveProfile()"
								>
									<span v-if="!btnLoading">変更</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { ScProgressCircular } from "~/components/ui/progress";
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";
import _ from 'lodash';
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		profile_dt: {
			organization_name: '',
			organization_name_kana: '',
			prefecture: '',
			city: '',
			address: '',
			mail_address: '',
		}
	}),
	computed: {
		hospitalType () {
			return CONST.getCode("hospital_type");
		},
		prefecture_list () {
			return CONST.prefecture_list;
		},
		inputDiff () {
			return (
				this.pristine_profile_dt.organization_name === this.profile_dt.organization_name &&
				this.pristine_profile_dt.organization_name_kana === this.profile_dt.organization_name_kana &&
				this.pristine_profile_dt.prefecture === this.profile_dt.prefecture &&
				this.pristine_profile_dt.city === this.profile_dt.city &&
				this.pristine_profile_dt.address === this.profile_dt.address &&
				this.pristine_profile_dt.mail_address === this.profile_dt.mail_address &&
				this.pristine_profile_dt.hospital_type === this.profile_dt.hospital_type &&
				this.pristine_profile_dt.homepage === this.profile_dt.homepage ||
				this.profile_dt.organization_name === '' ||
				this.profile_dt.organization_name_kana === '' ||
				this.profile_dt.prefecture === '' ||
				this.profile_dt.city === '' ||
				this.profile_dt.address === '' ||
				this.profile_dt.mail_address === ''
			)
		},
	},
	async asyncData ( {app, params, store} ) {
		let profile_dt = {
			organization_id: null,
			organization_name: null,
			organization_name_kana: null,
			prefecture: null,
			city: null,
			address: null,
			mail_address: null,
			hospital_id: null,
			hospital_type: null,
			homepage: null,
		}
		let { data, error } = await app.$axios.get(`/api/profile`);
		if (error) {
			return { profile_dt: profile_dt };
		} else {
			return {
				profile_dt: Object.assign(profile_dt, data),
				pristine_profile_dt: _.cloneDeep(data)
			 };
		}
	},
	methods: {
		async saveProfile () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/profile`, this.profile_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				await this.getProfile ();
				UIkit.notification("登録しました");
			}
			this.btnLoading = false;
		},
		async getProfile () {
			let { data, error } = await this.$axios.get(`/api/profile`);
			if (error) {
			} else {
				Object.assign(this.profile_dt, data);
			}
		},
	},
	validations: {
		profile_dt: {
			organization_name:{
				required,
				maxLength: maxLength(128)
			},
			organization_name_kana:{
				required,
				maxLength: maxLength(128)
			},
			prefecture:{
				required
			},
			city:{
				required,
				maxLength: maxLength(32)
			},
			address:{
				required,
				maxLength: maxLength(128)
			},
			homepage:{
				maxLength: maxLength(128),
				url
			},
			mail_address:{
				required,
				maxLength: maxLength(128),
				email
			},
			hospital_type:{
			},
		}
	}
}
</script>
