import { version } from '~~/package.json';

export const state = () => ({
	vxAppVersion: version,
	vxSidebarMainExpanded: true,
	vxSidebarMainAccordionMode: false,
	vxSidebarMainScrollToActive: false,
	vxCardFixed: false,
	vxHeaderExpanded: false,
	vxPageFixed: false,
	vxAppTheme: 'theme-default',
	vxOffcanvasPresent: false,
	vxOffcanvasExpanded: false,
	vxCodeMirrorFullscreen: false,
	vxProgressOverlay: false,
	vxPageScrollbars: true,
	vxFooterActive: false,
	//////////////////
	authenticated: false,
	user: null,
	isThroughChannel: false,
});

export const mutations = {
	sidebarMainToggle (state, expanded) {
		state.vxSidebarMainExpanded = expanded
	},
	sidebarMainAccordionModeToggle (state) {
		state.vxSidebarMainAccordionMode = !state.vxSidebarMainAccordionMode
	},
	sidebarMainScrollToActiveToggle (state) {
		state.vxSidebarMainScrollToActive = !state.vxSidebarMainScrollToActive
	},
	setCardFixed (state, fixed) {
		state.vxCardFixed = fixed;
	},
	setHeaderExpanded (state, expanded) {
		state.vxHeaderExpanded = expanded;
	},
	setPageFixed (state, fixed) {
		state.vxPageFixed = fixed
	},
	setAppTheme (state, theme) {
		state.vxAppTheme = theme
	},
	setOffcanvasPresent (state, present) {
		state.vxOffcanvasPresent = present
	},
	offcanvasToggle (state, active) {
		state.vxOffcanvasExpanded = active
	},
	cmFullscreenToggle (state, fullscreen) {
		state.vxCodeMirrorFullscreen = fullscreen
	},
	toggleProgressOverlay (state, active) {
		state.vxProgressOverlay = active
	},
	togglePageScrollbars (state, active) {
		if (active) {
			this.pageScrollbarEnable();
		} else {
			this.pageScrollbarDisable();
		}
	},
	setFooterActive (state, active) {
		state.vxFooterActive = active
	},
	/////////////////////
	setAuthenticated (state, authenticate) {
		state.authenticated = authenticate;
	},
	setUser (state, user) {
		state.user = user;
	},
	setIsThroughChannel (state) {
		state.isThroughChannel = true;
	},
};

export const actions = {
	async nuxtServerInit ({ commit }, { req, redirect, app, route }) {
		if (req.cookies) {
		// commit('SET_CSRF_TOKEN', req.csrfToken());
		}

		if (req.session.passport && req.session.passport.user) {
			commit("setAuthenticated", true);
			commit("setUser", req.session.passport.user);
		}
		return;
	}
};

export const getters = {
	pageFixedState: state => state.vxPageFixed,
	cardFixedState: state => state.vxCardFixed,
	headerExpandedState: state => state.vxHeaderExpanded,
	sidebarMainState: state => state.vxSidebarMainExpanded,
	offcanvasState: state => state.vxOffcanvasExpanded
};
