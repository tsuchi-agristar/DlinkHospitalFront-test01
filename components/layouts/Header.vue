<template>
	<header id="sc-header" ref="header">
		<nav
			class="uk-navbar uk-navbar-container"
			uk-navbar="mode: hover; duration: 360;"
		>
			<div class="uk-navbar-left nav-overlay-small uk-margin-right uk-navbar-aside">
				<a id="sc-sidebar-main-toggle" href="javascript:void(0)" @click.stop="toggleMainSidebar">
					<i v-if="sidebarMainExpanded" class="mdi mdi-backburger"></i>
					<i v-if="!sidebarMainExpanded" class="mdi mdi-menu"></i>
				</a>
				<div class="sc-brand uk-visible@m logo_fill_white">
					<nuxt-link to="/">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 367.44 113.04" width="90px" height="auto"><path d="M150.79 6.15h13.42v100.74h-13.42zM200.09 13.23a11.52 11.52 0 0 0-11.46 11.38 11.2 11.2 0 0 0 3.37 8.24 11.12 11.12 0 0 0 8.16 3.38 10.85 10.85 0 0 0 8.08-3.38 11.12 11.12 0 0 0 3.38-8.16 10.89 10.89 0 0 0-3.38-8.09 11.15 11.15 0 0 0-8.15-3.37zM193.42 48.79h13.42v58.09h-13.42zM264.32 48.49c-5.89 0-10.09 1-14.79 5.67v-5.37h-13.48v58.1h13.48V92.28c0-7.86-.7-18.62 2-24.24 3.46-7.13 13.75-8.84 18.27-1.81 2.52 3.92 2.79 9 2.79 13.52v27.14h13.51V73.35c0-6.38-1.1-12.93-5.41-17.89-3.82-4.41-10.62-6.97-16.37-6.97zM340.36 73.19l25.23-24.39h-18.01l-18.91 18.78V6.15h-13.42v100.74h13.42V84.52l2.15-2.15 19.2 24.52h17.42l-27.08-33.7zM66.33 0a56 56 0 0 0-41 17.67l-1.94 2v19.15h14.13V25.48a41.93 41.93 0 0 1 28.81-11.32 42.36 42.36 0 0 1 0 84.72 41.93 41.93 0 0 1-28.81-11.32V74.22H23.36v19.1l1.94 2.05A56.51 56.51 0 1 0 66.33 0z"/><path d="M0 49.44h60.89V63.6H0z"/></svg>
					</nuxt-link>
				</div>
			</div>

			<div class="nav-overlay nav-overlay-small uk-navbar-right">
				<ul class="uk-navbar-nav">
					<!-- フルスクリーン -->
					<li class="uk-visible@l">
						<ScFullscreen id="sc-js-fullscreen-toggle"></ScFullscreen>
					</li>

					<!-- 通知 -->
					<li class="uk-visible@l">
						<a href="javascript:void(0)" @click="showNotification">
							<span class="mdi mdi-bell uk-display-inline-block">
								<span v-show="unread" class="sc-indicator md-bg-color-red-600"></span>
							</span>
						</a>
						<div 
							class="uk-navbar-dropdown md-bg-white uk-padding-remove"
							:class="[notification_dtlists.length == 0 ? '' : 'width-auto']"
						>
							<div>
								<ul id="sc-header-alerts" class="sc-header-alerts-wrap uk-list uk-margin-remove">
									<li class="uk-padding-remove block" v-if="notification_dtlists.length == 0">
										<ul class="notification_list">
											<li class="c-flex ag_middle jt_start md-color-grey-700 icon_list">
												<span class="mr5"><i class="mdi mdi-checkbox-marked-circle-outline sc-icon-18 md-color-grey-700"></i></span>
												最新の通知はありません。
											</li>
										</ul>
									</li>
									<li v-for="(notification, index) in notification_dtlists" :key="notification.notification_id" :style="{'--index': index}" class="md-bg-white uk-padding-remove">
										<div class="w_100 uk-flex uk-flex-middle">
											<nuxt-link :to="`/notification/detail/${notification.notification_id}`" class="w_100 hover_bg hover_bg_blue uk-text-small" @click="showNotification">
												<ul class="notification_list">
													<li class="c-flex ag_middle jt_start md-color-grey-700 icon_list time_box">
														<span class="icon_span"><i class="mdi mdi-clock-outline sc-icon-18 md-color-light-blue-800"></i></span>
														<p class="uk-margin-remove">{{ notification.notification_at | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}</p>
													</li>
													<li class="c-flex ag_middle jt_start icon_list bold title_box">
														<span class="icon_span"><i class="mdi mdi-bell-circle-outline sc-icon-18 md-color-light-blue-800"></i></span>
														<p class="uk-margin-remove font14">{{ notification.title_forward }}</p>
													</li>
													<li class="c-flex notification_title md-color-grey-700 ag_middle jt_start detail_box">
														<p class="uk-margin-remove">{{ notification.title_back }}</p>
													</li>
												</ul>
											</nuxt-link>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</li>
					<!-- プロフィール -->
					<li>
						<a href="javascript:void(0)">
							<span data-uk-icon="thumbnails"></span>
						</a>
						<div class="uk-navbar-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-navbar">
								<li>
									<nuxt-link :to="profileUrl()">
										プロフィール
									</nuxt-link>
								</li>
								<li>
									<nuxt-link :to="passwordUrl()">
										パスワード変更
									</nuxt-link>
								</li>
								<li>
									<a @click="logout()">
										ログアウト
									</a>
								</li>
							</ul>
						</div>
					</li>
				</ul>
				<a v-if="vxOffcanvasPresent" href="javascript:void(0)" class="md-color-white uk-margin-left uk-hidden@l" @click="toggleOffcanvas">
					<i v-show="!vxOffcanvasExpanded" class="mdi mdi-menu"></i><i v-show="vxOffcanvasExpanded" class="mdi mdi-arrow-right"></i>
				</a>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapState } from 'vuex'
import { scMq } from '~/assets/js/utils'
import ScFullscreen from '~/components/layouts/FullScreen.vue';
import { CONST } from '~/const.js';

import _ from 'lodash';
export default {
	components: {
		ScFullscreen
	},
	data: () => ({
		sidebarMainExpanded: true,
		offcanvasExpanded: false,
		offcanvasPresent: false,
		logo: require('~/assets/img/logo-land.png'),
		notification_dtlists: {},
		unread: false
	}),
	computed: {
		...mapState([
			'vxSidebarMainExpanded',
			'vxOffcanvasPresent',
			'vxOffcanvasExpanded'
		])
	},
	watch: {
		'vxSidebarMainExpanded' (state) {
			this.sidebarMainExpanded = state;
		},
		'vxOffcanvasExpanded' (state) {
			this.offcanvasExpanded = state;
		},
		'vxOffcanvasPresent' (state) {
			this.offcanvasPresent = state;
		}
	},
	async mounted () {
		const self = this;
		self.$nextTick(() => {
			if(scMq.mediumMin()) {
				self.sidebarMainExpanded = this.vxSidebarMainExpanded;
			} else {
				self.sidebarMainExpanded = false;
			}
		});
		// sticky header
		var options = scMq.mediumMax() ? { showOnUp: true, animation: "uk-animation-slide-top" } : {};
		UIkit.sticky(this.$refs.header, options);

		let { data } = await this.$axios.get(`/api/unread_notification`);
		this.notification_dtlists = data.notification || [];
		this.notification_dtlists = _.map(this.notification_dtlists, (dt) => {
			return {
				notification_id: dt.notification_id,
				notification_at: dt.notification_at,
				title: dt.title,
				title_forward: dt.title.substr(0, dt.title.indexOf("】")+1).replace( /【/g, "" ).replace( /】/g, "" ),
				title_back: dt.title.substr(dt.title.indexOf("】")+1),
			}
		})
		this.unread = data.unread;
	},
	methods: {
		showNotification () {
			this.$axios.put(`/api/notification`); // 既読に変更
			this.unread = false;
		},
		profileUrl () {
			return "/profile";
		},
		passwordUrl () {
			return "/chgpassword";
		},
		loginUrl () {
			return "/login";
		},
		async logout () {
			let { data, error } = await this.$axios.get(`/api/auth/logout`);
			if (error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				window.location.href = this.loginUrl();
			}
		},
		toggleMainSidebar () {
			let state = !this.sidebarMainExpanded;
			this.$store.commit('sidebarMainToggle', state);
		},
		toggleOffcanvas () {
			let state = !this.offcanvasExpanded;
			this.$store.commit('offcanvasToggle', state);
		}
	}
}
</script>

<style lang="scss">
	@import "~scss/themes/theme_c";
</style>
