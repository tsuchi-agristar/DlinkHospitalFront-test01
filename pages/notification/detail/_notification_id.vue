<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/notification/">
							通知一覧
						</nuxt-link>
					</li>
					<li>
						<span>
							詳細画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardHeader separator>
						<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-flex-1">
								<ScCardTitle>
									{{ notification_dt.title }}
								</ScCardTitle>
							</div>
						</div>
					</ScCardHeader>
					<ScCardBody>
						<div class="uk-accordion-content uk-accordion-content sc-round">
							<table class="uk-text-pre-table uk-margin-bottom ws_normal uk-table uk-table-responsive uk-table-divider">
								<tbody>
									<tr>
										<th class="md-color-black uk-table-top uk-width-medium md-bg-grey-100">
											日付
										</th>
										<td class="uk-text-pre-wrap vertical-middle">
											<p>{{ notification_dt.notification_at | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}</p>
										</td>
									</tr>
									<tr>
										<th class="md-color-black uk-table-top uk-width-medium md-bg-grey-100">
											通知タイトル
										</th>
										<td class="uk-text-pre-wrap vertical-middle">
											<p>{{ notification_dt.title }}</p>
										</td>
									</tr>
									<tr>
										<th class="md-color-black uk-table-top uk-width-medium md-bg-grey-100">
											通知内容
										</th>
										<td class="uk-text-pre-wrap">
											<p>{{ notification_dt.content }}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
export default {
	components: {
	},
	data: () => ({
		notification: {
			default: '項目を削除しました',
		},
		dialogValue: ''
	}),
	computed: {
		columns () {
			return [
				{
					label: '',
					field: 'notice',
					sortable: false,
					tdClass: 'uk-text-nowrap eveb-bg01',
				},
			]
		}
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/notification/${params.notification_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { notification_dt: data }
	},
	methods: {
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
	.ws_normal{
		white-space: normal;
	}
</style>
