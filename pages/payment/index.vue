<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								請求一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="payment_dtlists"
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
							<span v-if="props.column.field === 'payment_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'action'">
								<div data-uk-margin>
									<div class="uk-inline">
										<button class="md-bg-white sc-button sc-button-icon sc-button-outline sc-button-mini" type="button">
											<span data-uk-icon="cog" class="w14"></span>
										</button>
										<div data-uk-dropdown pos="top-left">
											<ul class="uk-nav uk-dropdown-nav">
												<li>
													<nuxt-link :to="`/payment/detail/${props.row.payment_id}`"><span>詳細</span></nuxt-link>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</span>
							<span v-else-if="props.column.field === 'payment_month'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo(("YYYY/MM/DD")) }}
							</span>
							<span v-else-if="props.column.field === 'payment_price'">
								{{ props.formattedRow[props.column.field] | formatCurrency('JPY') }}
							</span>
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { CONST } from '~/const.js';
export default {
	components: {
		VueGoodTable
	},
	data: () => ({
	}),
	computed: {
		columns () {
			return [
				{
					label: '操作',
					field: 'action',
					sortable: false,
					tdClass: 'uk-text-nowrap',
				},
				{
					label: '請求月',
					field: 'payment_month',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020年1月',
					}
				},
				{
					label: '請求金額',
					field: 'payment_price',
					thClass: 'bghover01 pointer',
					type:'number',
					filterOptions: {
						enabled: false,
						placeholder: '1,000,000',
					}
				},
				// {
				// 	label: '請求状態',
				// 	field: 'payment_status',
				// 	sortable: false,
				// 	filterOptions: {
				// 		enabled: true,
				// 		placeholder: '選択',
				// 		filterDropdownItems: CONST.getCode('payment_status')
				// 	}
				// }
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/payment`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { payment_dtlists: data }
	},
	methods: {
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
