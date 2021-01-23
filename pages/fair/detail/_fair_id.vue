<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/fair/">
							説明会募集一覧
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
								<span>募集情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													説明会種別
												</th>
												<td>
													<ul class="uk-list">
														<li v-for="fairType in fairTypes" :key="fairType.value">
															<label>
																<input
																	:checked="checkedTest(fairType.value, fair_dt.fair_type)"
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
											<tr>
												<th class="uk-width-medium">
													募集開始日
												</th>
												<td>{{ fair_dt.plan_start_at }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													募集終了日
												</th>
												<td>{{ fair_dt.plan_end_at }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													募集状態
												</th>
												<td>{{ fair_dt.fair_status | view("fair_status") }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>申込情報</span>
							</h4>
							<div class="table_nowrap">
								<div class="vgt-responsive">
									<table class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped uk-text-pre-table">
										<thead>
											<tr>
												<th class="uk-text-bold uk-width-medium">
													学校名
												</th>
												<th class="max_w115 uk-text-bold">
													申込状態
												</th>
												<th class="max_w115 uk-text-bold">
													参加予定人数
												</th>
												<th class="max_w115 uk-text-bold">
													コメント
												</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="data in getFairApplication(fair_dt)" :key="data.application_id">
												<td class="uk-width-medium">{{ data.organization.organization_name }}</td>
												<td>{{ data.application_status | view("application_status") }}</td>
												<td>{{ data.estimate_participant_number }}</td>
												<td>{{ data.comment }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<FairAppendDetail
								:fair_dt="fair_dt"
							></FairAppendDetail>
							<div v-if="isShowEditButton" class="uk-margin-large-top uk-flex-left">
								<nuxt-link :to="`/fair/edit/${$route.params.fair_id}`">
									<input id="form-submit"
										class="sc-button sc-button-secondary waves-effect waves-button waves-light"
										type="submit"
										value="編集"
									>
								</nuxt-link>
							</div>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import FairAppendDetail from "~/components/pages/FairAppendDetail.vue";
import 'vue-good-table/dist/vue-good-table.css'
import { CONST } from '~/const.js';
import _ from 'lodash';

export default {
	components: {
		FairAppendDetail
	},
	data: () => ({
	}),

	computed: {
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		isShowEditButton () {
			return this.fair_dt.fair_status === CONST.fair_status.RECRUITING.value;
		},
	},
	async asyncData ( { app, params } ) {
		let { data } = await app.$axios.get(`/api/fair/${params.fair_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return {
			fair_dt: data,
		 }
	},
	methods: {
		checkedTest (value, array) {
			return _.some(array, (dt) => dt === value);
		},
		getFairApplication (fair_dt) {
			return _.get(fair_dt, 'fair_application');
		},
	}
}
</script>
<style lang="scss">
</style>
