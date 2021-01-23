<template>
	<div class="uk-flex uk-flex-center uk-flex-middle sc-login-page-wrapper">
		<div class="uk-width-2-3@s uk-width-1-2@m uk-width-1-3@l uk-width-1-4@xl uk-margin-auto-vertical">
			<ScCard>
				<ScCardBody>
					<h1 class="sc-login-page-logo logo_fill">
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 367.44 113.04" width="210px" height="auto"><path d="M150.79 6.15h13.42v100.74h-13.42zM200.09 13.23a11.52 11.52 0 0 0-11.46 11.38 11.2 11.2 0 0 0 3.37 8.24 11.12 11.12 0 0 0 8.16 3.38 10.85 10.85 0 0 0 8.08-3.38 11.12 11.12 0 0 0 3.38-8.16 10.89 10.89 0 0 0-3.38-8.09 11.15 11.15 0 0 0-8.15-3.37zM193.42 48.79h13.42v58.09h-13.42zM264.32 48.49c-5.89 0-10.09 1-14.79 5.67v-5.37h-13.48v58.1h13.48V92.28c0-7.86-.7-18.62 2-24.24 3.46-7.13 13.75-8.84 18.27-1.81 2.52 3.92 2.79 9 2.79 13.52v27.14h13.51V73.35c0-6.38-1.1-12.93-5.41-17.89-3.82-4.41-10.62-6.97-16.37-6.97zM340.36 73.19l25.23-24.39h-18.01l-18.91 18.78V6.15h-13.42v100.74h13.42V84.52l2.15-2.15 19.2 24.52h17.42l-27.08-33.7zM66.33 0a56 56 0 0 0-41 17.67l-1.94 2v19.15h14.13V25.48a41.93 41.93 0 0 1 28.81-11.32 42.36 42.36 0 0 1 0 84.72 41.93 41.93 0 0 1-28.81-11.32V74.22H23.36v19.1l1.94 2.05A56.51 56.51 0 1 0 66.33 0z" /><path d="M0 49.44h60.89V63.6H0z" /></svg>
						</div>
						<span class="md-bg-blue-50 md-color-blue-800 uk-text-bold uk-margin-small-left uk-label uk-text-medium">病院用</span>
					</h1>
					<div id="sc-login-form" class="sc-toggle-login-register sc-toggle-login-password">
						<div class="sc-login-page-inner">
							<div class="uk-grid" data-uk-grid>
								<div class="uk-width-1-1@m uk-first-column">
									<div>
										<label class="uk-form-label" for="user_id">ユーザーID</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_id"
												v-model="$v.account_name.$model"
												:error-state="$v.account_name.$error"
												:validator="$v.account_name"
												placeholder="0000"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.account_name.required">
													必須項目です
												</li>
												<li v-if="!$v.account_name.minLength">
													{{ $v.account_name.$params.minLength.min }}文字以上入力してください
												</li>
												<!-- <li>
													ユーザーIDが見つかりませんでした
												</li> -->
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-width-1-1@m">
									<div>
										<label class="uk-form-label" for="user_pass">ユーザーパスワード</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_pass"
												v-model="$v.password.$model"
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
												<!-- <li>
													パスワードが正しくありません
												</li> -->
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top sc-theme-c">
								<button
									to=""
									class="sc-button sc-button-large sc-button-block sc-button-secondary"
									:class="{'sc-button-progress-overlay': btn3LoadingEnd}"
									:disabled="btn3LoadingEnd"
									@click.prevent="login()"
								>
									<span>ログイン</span>
									<transition name="scale-up">
										<span v-show="btn3Loading" class="sc-button-progress-layer">
											<ScProgressCircular></ScProgressCircular>
										</span>
									</transition>
								</button>
							</div>
						</div>
					</div>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import { validationMixin } from "vuelidate";
import { ScProgressCircular } from '~/components/ui/progress'
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";

export default {
	layout: 'login_page',
	components: {
		ScInput,
		ScProgressCircular
	},
	mixins: [validationMixin],
	data: () => ({
		account_name: '',
		password: '',
		btn3Loading: false,
		btn3LoadingEnd: false,
		isChecked: false,
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
	},
	methods: {
		onClick: function () {
			this.isChecked = !this.isChecked;
		},
		async login () {
			this.btn3Loading = true;
			this.btn3LoadingEnd = true;

			let res = await this.$axios.post(`/api/auth/login`, {
				username: this.account_name,
				password: this.password
			});
			if (res.error) {
				if (res.error.status === 422) {
					UIkit.notification("アカウント名もしくはパスワードが間違っています", { status: "danger" });
					return;
				}

				UIkit.notification("ログインできませんでした", { status: "danger" });
			} else {
				this.$store.commit("setAuthenticated", true);
				window.location.href = "/"
			}

			this.btn3Loading = false;
			this.btn3LoadingEnd = false;


		}
	},
	validations: {
		account_name: {
			required,
			minLength: minLength(6)
		},
		password: {
			required,
			minLength: minLength(6)
		}
	}
}
</script>
<style lang="scss">
.sc-login-page {
	body {
		overflow: auto;
		padding: 24px;
		background: #f1f1f1;
	}
}
</style>
