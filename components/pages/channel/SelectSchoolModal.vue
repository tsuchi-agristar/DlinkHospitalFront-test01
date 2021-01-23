<template>
	<modal
		name="modal-select-school"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-horizontal">
			<div class="uk-padding-small uk-padding-remove-bottom flexmiddle">
				<div class="vm--title uk-card-title">
					個別チャンネルを開設する組織を選択してください
				</div>
				<button
					type="button"
					class="close-button"
					@click="hide()"
				>
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<ScCardBody>
				<VueGoodTable
					class="overout45"
					:columns="modalColumns"
					:rows="organization_dtlists"
					:pagination-options="{
						mode: 'pages',
						enabled: false,
						rowsPerPageLabel: '表示件数',
						nextLabel: '次へ',
						prevLabel: '前へ',
						pageLabel: '',
						ofLabel: 'ページ目を表示中 / ',
						dropdownAllowAll: false,
						perPage: 5
					}"
					style-class="uk-table uk-table-divider scutum-vgt uk-table-middle"
					:search-options="{
						enabled: true
					}"
					:sort-options="{
						enabled: true,
					}"
				>
					<template slot="table-row" slot-scope="props">
						<div v-if="props.column.field === 'choose'">
							<div class="uk-first-column">
								<input
									class="font12 sc-button sc-button-primary min_w80 md-color-white sc-button-small waves-effect waves-button"
									type="submit"
									value="選択"
									@click="click(props.row.organization_id)"
								>
							</div>
						</div>
						<span v-else-if="props.column.field === 'organization_type'">
							{{ props.formattedRow[props.column.field] | view(props.column.field) }}
						</span>
						<template v-else>
							{{ props.formattedRow[props.column.field] }}
						</template>
					</template>
				</VueGoodTable>
			</ScCardBody>
		</div>
	</modal>
</template>
<script>
import { CONST } from '~/const.js';
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
export default {
	components: {
		VueGoodTable,
	},
	data: () => ({
		organization_dtlists: null
	}),
	computed: {
		modalColumns () {
			return [
				{
					label: '',
					field: 'choose',
					sortable: false,
					tdClass: 'uk-text-nowrap',
				},
				{
					label: '組織名',
					field: 'organization_name',
					sortable: true,
				},
				{
					label: '組織名フリガナ',
					field: 'organization_name_kana',
					sortable: true,
				},
				{
					label: '組織タイプ',
					field: 'organization_type',
					sortable: true,
				},
			]
		},
	},

	methods: {
		click (organization_id) {
			this.hide();
			this.$emit('next', organization_id)
		},
		hide () {
			this.$modal.hide('modal-select-school')
		},
		beforeOpen (event) {
			this.organization_dtlists = event.params;
		},
		beforeClose (event) {
		},
	},
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
