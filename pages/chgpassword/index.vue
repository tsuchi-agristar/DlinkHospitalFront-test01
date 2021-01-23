<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>パスワード変更</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="user_pass"><span class="contact_label required">必須</span>新しいユーザーパスワード</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_pass"
												v-model="$v.password.$model"
												name="password"
												:type="inputType"
												:error-state="$v.password.$error"
												:validator="$v.password"
												placeholder="0000"
												mode="outline"
											>
												<span class="pass_eye_wrap">
													<span :class="iconType" @click="onClick">
														<i :class="iconTypeEye" class="mdi"></i>
													</span>
												</span>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.password.required">
													必須項目です
												</li>
												<li v-if="!$v.password.minLength">
													{{ $v.password.$params.minLength.min }}文字以上入力してください
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="repeat_user_pass"><span class="contact_label required">必須</span>新しいユーザーパスワード(確認用)</label>
										<div class="uk-form-controls">
											<ScInput
												id="repeat_user_pass"
												v-model="$v.repeatPassword.$model"
												name="repeatPassword"
												:type="inputTypeRepeat"
												:error-state="$v.repeatPassword.$error"
												:validator="$v.repeatPassword"
												placeholder="0000"
												mode="outline"
											>
												<span class="pass_eye_wrap">
													<span :class="repeatIconType" @click="onClickRepeat">
														<i :class="repeatIconTypeEye" class="mdi"></i>
													</span>
												</span>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.repeatPassword.required">
													必須項目です
												</li>
												<li v-if="!$v.repeatPassword.sameAsPassword">
													パスワード確認が一致しません
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div></div>
							<div class="uk-margin-large-top uk-flex-left">
								<button
									v-waves.button.light
									class="sc-button sc-button-secondary"
									:class="{'sc-button-progress': btnLoading}"
									:disabled="btnLoading"
									@click.prevent="savePassword()"
								>
									<span v-if="!btnLoading">登録</span>
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
import ScInput from "~/components/ui/Input";
import { ScProgressCircular } from "~/components/ui/progress";

import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, sameAs } from "vuelidate/lib/validators";

export default {
	components: {
		ScInput,
		ScProgressCircular,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		isChecked: false,
		isCheckedRepeat: false,
		password: "",
		repeatPassword: ""
	}),
	computed: {
		inputType: function () {
    	  return this.isChecked ? "text" : "password";
		},
		iconType: function () {
			return this.isChecked ? "eye_slash" : "eye";
		},
		iconTypeEye: function () {
			return this.isChecked ? "mdi-eye" : "mdi-eye-off";
		},
		inputTypeRepeat: function () {
    	  return this.isCheckedRepeat ? "text" : "password";
		},
		repeatIconType: function () {
			return this.isCheckedRepeat ? "eye_slash" : "eye";
		},
		repeatIconTypeEye: function () {
			return this.isCheckedRepeat ? "mdi-eye" : "mdi-eye-off";
		},
	},
	async asyncData ({ app, params, error }) {
		let { data } = await app.$axios.get(
			`/api/profile/password`
		);
		return { password: data, repeatPassword: data };
	},
	methods: {
		onClick: function () {
			this.isChecked = !this.isChecked;
		},
		onClickRepeat: function () {
			this.isCheckedRepeat = !this.isCheckedRepeat;
		},
		async savePassword () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/profile/password`, {password: this.password});
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				UIkit.notification("登録しました");
			}
			this.btnLoading = false;
		},
	},
	validations: {
		password: {
			required,
			minLength: minLength(6)
		},
		repeatPassword: {
			required,
			sameAsPassword: sameAs('password')
		}
	}
};
</script>
