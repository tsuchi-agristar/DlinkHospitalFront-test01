<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								病院一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="hospital_dtlists"
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
							enabled: false,
						}"
						:sort-options="{
							enabled: true,
						}"
					>
						<template slot="table-row" slot-scope="props">
							<div v-if="props.column.field === 'homepage'">
								<div v-if="props.column.field === 'homepage'">
									<div v-if="!props.row.homepage">
										-
									</div>
									<a v-else class="sc-button sc-button-outline waves-effect waves-button sc-button-mini" :href="props.row.homepage" target="_blank">
										URL<span class="uk-margin-small-left uk-icon"><i class="mdi mdi-link-variant sc-icon-18"></i></span>
									</a>
								</div>
								<div v-else>
								</div>
							</div>
							<span v-else-if="props.column.field === 'hospital_type' || props.column.field === 'fair_open_status' || props.column.field === 'channel_participation_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'fair_count' || props.column.field === 'channel_participation_count'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
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
import { CONST } from "~/const.js";
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
					label: '病院名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '病院名',
					}
				},
				{
					label: '住所',
					field: 'address',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '住所',
					}
				},
				{
					label: 'HP',
					field: 'homepage',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: 'HP',
					}
				},
				{
					label: '病院種別',
					field: 'hospital_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('hospital_type')
					}
				},
				{
					label: '説明会募集状況',
					field: 'fair_open_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('fair_open_status')
					}
				},
				{
					label: '説明会募集回数',
					field: 'fair_count',
					sortable: true,
					type: 'number',
					filterOptions: {
						enabled: false,
						placeholder: '1',
					}
				},
				{
					label: 'チャンネル参加回数',
					field: 'channel_participation_count',
					sortable: true,
					type: 'number',
					filterOptions: {
						enabled: false,
						placeholder: '1',
					}
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/hospital_activity`);
		return {
			hospital_dtlists: data
		}
	},
	methods: {
	}
}
</script>

<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
