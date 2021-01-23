/* options */
require('dotenv').config();
const mode = 'universal'; // universal/spa
/* options end */

const path = require('path');

module.exports = {
	mode: mode,
	/*
	** Headers of the page
	*/
	head: {
		htmlAttrs: {
			lang: 'en'
		},
		title: 'Dlink Hospital',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description'
			}
		],
		script: [
			{ src: '/vendor/uikit.min.js'}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
			{ rel: 'preload', href: '/vendor/uikit.min.js', as: 'script' },
			{ rel: 'preload', href: '/fonts/roboto_base64.css', as: 'style' },
			{ rel: 'preload', href: '/fonts/sourceCodePro_base64.css', as: 'style' },
			{ rel: 'preload', href: '/fonts/mdi_base64.css', as: 'style' },
			{ rel: 'stylesheet', href: '/fonts/roboto_base64.css' },
			{ rel: 'stylesheet', href: '/fonts/sourceCodePro_base64.css' },
			{ rel: 'stylesheet', href: '/fonts/mdi_base64.css' }
		]
	},
	/*
	** Customize the progress-bar
	*/
	loading: {
		color: '#E1F5FE',
		height: '3px',
		continuous: true
	},
	/*
	** Global CSS
	*/
	css: [
		'uikit/dist/css/uikit.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		{ src: '~/plugins/components.global.js' },
		{ src: '~/plugins/directives.client.js' },
		{ src: '~/plugins/filters.js' },
		{ src: '~/plugins/mixins.client.js' },
		{ src: '~/plugins/waves.client.js' },
		{ src: '~/plugins/retina.client.js' },
		{ src: '~/plugins/vueVisible.client.js' },
		{ src: "~/plugins/axios" },
		{ src: "~/plugins/vmodal.js", mode: 'client' },
	],
	router: {
		middleware: ['redirect', 'authenticated'],
		base: '/'
	},
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/google-analytics',
		['cookie-universal-nuxt', { parseJSON: false }],
		'@nuxtjs/applicationinsights',
		'@nuxtjs/device'
		// '@nuxtjs/webpack-profile'
	],
	appInsights: {
		instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || false //  your project's Instrumentation Key here
	},
	serverMiddleware: [
		{ path: "/api", handler: "~/api/index.js" },
		{ path: "/api/auth", handler: "~/api/auth.js" },
	],
	googleAnalytics: {
		id: (mode === 'universal') ? 'UA-136690566-3' : 'UA-136690566-4',
		// disable for development
		dev: process.env.NODE_ENV !== 'production'
	},
	/*
	** Axios module configuration
	*/
	axios: {
		baseURL: process.env.FRONT_URL || 'http://localhost:3000',
		browserBaseURL: process.env.FRONT_URL || 'http://localhost:3000',
	},

	env: {
		FRONT_URL: process.env.FRONT_URL,
	},
	/*
	** The server Property
	** https://nuxtjs.org/api/configuration-server
	*/
	// server: {
	// 	port: 3104, // default: 3000
	// 	host: '192.168.1.188', // default: localhost,
	// 	timing: false,
	// 	https: {
	// 		key: fs.readFileSync(path.resolve(__dirname, '.https/server.key')),
	// 		cert: fs.readFileSync(path.resolve(__dirname, '.https/server.crt'))
	// 	}
	// },
	generate: {
	},
	/*
	** Build configuration
	*/
	build: {
		// analyze: true,
		progress: true,
		babel: {
			babelrc: true,
			presets ({ isServer }) {
				return [
					[ require.resolve('@nuxt/babel-preset-app'), {
						targets: isServer
							? { node: "current" }
							: { browsers: ["last 2 versions"], ie: 11 },
						debug: false
					} ]
				]
			}
		},
		extend (config, ctx) {
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push(
					// Run ESLint on save
					{
						enforce: 'pre',
						test: /\.(js|vue)$/,
						loader: 'eslint-loader'
					}
				);
			}
			// aliases
			config.resolve.alias['scss'] = path.resolve(__dirname, './assets/scss');
			return config;
		}
	}
};
