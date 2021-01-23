<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardHeader separator>
						<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-flex-1">
								<ScCardTitle>
									通知一覧
								</ScCardTitle>
							</div>
						</div>
					</ScCardHeader>
					<ScCardBody>
						<VueGoodTable
							:columns="columns"
							:rows="notification_dtlists"
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
								<span v-if="props.column.field === 'notification_at'">
									<div>
										<span>{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}</span>
									</div>
								</span>
								<span v-else-if="props.column.field === 'title'">
									<div>
										<nuxt-link :to="`/notification/detail/${props.row.notification_id}`" class="block hover_line">
											<span>{{ props.formattedRow[props.column.field] }}</span>
										</nuxt-link>
									</div>
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
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
export default {
	components: {
		VueGoodTable
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
					label: '日付',
					field: 'notification_at',
					sortable: true,
					thClass: 'bghover01 pointer',
					tdClass: 'uk-text-nowrap',
				},
				{
					label: 'タイトル',
					field: 'title',
					sortable: false,
					tdClass: 'uk-text-initial link_box',
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/notification`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { notification_dtlists: data.notification }
	},
	methods: {
		showNotification (text, pos, status, persistent) {
			var config = {};
			config.timeout = persistent ? !persistent : 3000;
			if(status) {
				config.status = status;
			}
			if(pos) {
				config.pos = pos;
			}
			UIkit.notification(text, config);
		},
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
	tr td.eveb-bg01 {
	  padding:0;
	  a {
		display:block;
		padding: 17px 11px;
		color: rgba(0, 0, 0, 0.87);
	  }
	}
	tr:nth-of-type(odd) .eveb-bg01{
		background-color: #f8f8f8;
	}
</style>
