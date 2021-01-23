<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/channel/">
							チャンネル一覧
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
								<span>イベント情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													説明会形式
												</th>
												<td>{{ channel_dt.event.event_type | view("event_type") }}</td>
											</tr>
											<!-- <tr>
												<th class="uk-width-medium">
													チャンネル状態
												</th>
												<td>{{ channel_dt.event.channel_status | view("channel_mode") }}</td>
											</tr> -->
											<tr>
												<th class="uk-width-medium">
													開始日時
												</th>
												<td>{{ channel_dt.event.start_at | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													終了日時
												</th>
												<td>{{ channel_dt.event.end_at | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 v-if="channel_dt.fair" class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>説明会情報</span>
							</h4>
							<div v-if="channel_dt.fair">
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>{{ channel_dt.fair.organization.organization_name }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													説明会種別
												</th>
												<td>
													<ul class="uk-list">
														<li v-for="fairType in fairTypes" :key="fairType.value">
															<label>
																<input
																	:checked="checkedTest(fairType.value, channel_dt.fair.fair_type)"
																	class="uk-checkbox"
																	type="checkbox"
																	disabled="disabled"
																	:value="fairType.value"
																>
																{{ fairType.text }}
															</label>
														</li>
													</ul>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 v-if="channel_dt.event.estimate" class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>見積情報</span>
							</h4>
							<div v-if="channel_dt.event.estimate">
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													見積金額
												</th>
												<td>{{ channel_dt.event.estimate.estimate_price | formatCurrency('JPY') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													正規金額
												</th>
												<td>{{ channel_dt.event.estimate.regular_price | formatCurrency('JPY') }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>メンバー情報</span>
							</h4>
							<div class="sc-round ">
								<VueGoodTable
									:columns="memberColumns"
									:rows="channel_dt.event_member"
									:pagination-options="{
										enabled: false,
									}"
									style-class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped"
									:sort-options="{
										enabled: true,
									}"
								>
									<template slot="table-row" slot-scope="props">
										<span v-if="props.column.field === 'member_role'">
											{{ props.formattedRow[props.column.field] | view(props.column.field) }}
										</span>
										<span v-else-if="props.column.field === 'estimate_participant_number'">
											{{ getEstimateParticipantNumber(props.row.organization_id) | formatNumber }}
										</span>
										<span v-else-if="props.column.field === 'organization.organization_type'">
											{{ props.formattedRow[props.column.field] | view("organization_type") }}
										</span>
										<template v-else>
											{{ props.formattedRow[props.column.field] }}
										</template>
									</template>
								</VueGoodTable>
							</div>
							<!-- <div class="uk-margin-large-top uk-flex-left">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[ inputDiff === true ? 'sc-button-disabled' : 'sc-button-secondary' ]"
									:disabled="btnLoading || inputDiff"
									@click.prevent="saveProfile()"
								>
									<span v-if="!btnLoading">変更</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div> -->

							<div class="uk-first-column uk-text-center">
								<button
									class="sc-button"
									:class="[ isEnter ? 'sc-button-secondary' : 'sc-button-disabled' ]"
									@click="openEnterModal(channel_dt.event)"
								>
									入室
								</button>
							</div>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
		<client-only>
			<EnterModal>
			</EnterModal>
		</client-only>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css';
import { VueGoodTable } from 'vue-good-table';
import { CONST } from '~/const.js';
import _ from 'lodash';
import EnterModal from "~/components/pages/channel/EnterModal.vue";
import moment from "moment";

export default {
	components: {
		VueGoodTable,
		EnterModal
	},
	data: () => ({
	}),
	computed: {
		isEnter () {
			return moment(this.channel_dt.event.end_at).isSameOrAfter(moment());
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		memberColumns () {
			return [
				{
					label: '組織名',
					field: 'organization.organization_name',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
				{
					label: '種別',
					field: 'organization.organization_type',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
				{
					label: 'ロール',
					field: 'member_role',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
				{
					label: '参加予定人数',
					field: 'estimate_participant_number',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
			]
		},
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/channel/${params.channel_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { channel_dt: data }
	},
	mounted () {
		this.$store.commit('setIsThroughChannel');
	},
	methods: {
		getEstimateParticipantNumber (organization_id) {
			const application = _.filter(this.channel_dt.application, (dt) => {
				return dt.school_id === organization_id;
			});
			if (_.isEmpty(application)) {
				return "";
			}

			return _.first(application).estimate_participant_number;

		},
		getFormat (organization_id) {
			const application = _.filter(this.channel_dt.application, (dt) => {
				return dt.school_id === organization_id;
			});
			if (_.isEmpty(application)) {
				return "";
			}

			return _.first(application).format;
		},
		checkedTest (value, array) {
			return _.some(array, (dt) => dt.fair_type === value);
		},
		openEnterModal (value) {
			this.$modal.show('modal-enter-channel', value);
		},
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
