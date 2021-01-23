<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/payment/">
							請求一覧
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
					<ScCardBody>
						<div class="uk-form-horizontal">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>請求情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													請求月
												</th>
												<td>{{ payment_dt.payment_month }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													請求金額
												</th>
												<td>
													{{ payment_dt.payment_price | formatCurrency('JPY') }}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>請求明細</span>
							</h4>
							<div class="sc-round ">
								<VueGoodTable
									:columns="columns"
									:rows="payment_dt.payment_details"
									:pagination-options="{
										mode: 'pages',
										enabled: true,
										rowsPerPageLabel: '表示件数',
										nextLabel: '次へ',
										prevLabel: '前へ',
										pageLabel: '',
										ofLabel: 'ページ目を表示中 / ',
										perPageDropdown: [10,25,50,100],
										dropdownAllowAll: false,
									}"
									style-class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped"
									:search-options="{
										enabled: false
									}"
									:sort-options="{
										enabled: true,
									}"
								>
									<template slot="table-row" slot-scope="props">
										<span v-if="props.column.field === 'estimate.online_event.event_member'">
											{{ props.formattedRow[props.column.field].filter(dt => dt.organization.organization_type === '3').length }}
										</span>
										<span v-else-if="props.column.field === 'estimate.online_event.event_type'">
											{{ props.formattedRow[props.column.field] | view('event_type') }}
										</span>
										<span v-else-if="props.column.field === 'estimate.online_event.start_at' || props.column.field === 'estimate.online_event.end_at'">
											{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo('YYYY/MM/DD HH:mm') }}
										</span>
										<span v-else-if="props.column.field === 'estimate.estimate_price'">
											{{ props.formattedRow[props.column.field] | formatCurrency('JPY') }}
										</span>
										<template v-else>
											{{ props.formattedRow[props.column.field] }}
										</template>
									</template>
								</VueGoodTable>
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
import ScTextarea from '~/components/ui/Textarea'
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
	components: {
		VueGoodTable
	},
	data: () => ({
		'payment_price': '',
		'practice_request': '選択してください'
	}),
	computed: {
		columns () {
			return [
				{
					label: '説明会種別',
					field: 'estimate.online_event.event_type',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '開催開始日時',
					field: 'estimate.online_event.start_at',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '開催終了日時',
					field: 'estimate.online_event.end_at',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '請求金額',
					field: 'estimate.estimate_price',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
				{
					label: '参加学校数',
					field: 'estimate.online_event.event_member',
					sortable: true,
					type:'number',
					thClass: 'bghover01 pointer',
				},
			]
		}
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/payment/${params.payment_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { payment_dt: data }
	},
	methods: {
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
