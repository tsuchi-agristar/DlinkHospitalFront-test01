<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								学校一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="school_dtlists"
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
									<div v-if="!props.row.homepage" class="uk-text-center">
										-
									</div>
									<a v-else class="md-bg-white flexcenter sc-button sc-button-outline waves-effect waves-button sc-button-mini" :href="props.row.homepage" target="_blank">
										<p class="urltxt">URL</p><span class="urltxt uk-margin-small-left uk-icon"><i class="mdi mdi-link-variant sc-icon-18"></i></span>
									</a>
								</div>
								<div v-else>
								</div>
							</div>
							<span v-else-if="props.column.field === 'school_type' || props.column.field === 'scholarship_request' || props.column.field === 'internship_request' || props.column.field === 'practice_request' || props.column.field === 'fair_application_status' || props.column.field === 'channel_participation_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'fair_application_count' || props.column.field === 'channel_participation_count'">
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
import { CONST } from '~/const.js'
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
					label: '学校名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '学校名',
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
					label: '学校種別',
					field: 'school_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('school_type')
					}
				},
				{
					label: '奨学金',
					field: 'scholarship_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('scholarship_request')
					}
				},
				{
					label: 'インターン',
					field: 'internship_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('internship_request')
					}
				},
				{
					label: '実習',
					field: 'practice_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('practice_request')
					}
				},
				{
					label: '説明会申込状況',
					field: 'fair_application_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('fair_application_status')
					}
				},
				{
					label: '説明会申込回数',
					field: 'fair_application_count',
					sortable: true,
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: 'チャンネル参加回数',
					field: 'channel_participation_count',
					sortable: true,
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
					}
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/school_activity`);
		return {
			school_dtlists: data
		}
	},
	methods: {
	}
}
</script>

<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
