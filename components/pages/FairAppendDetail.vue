<template>
	<div>
		<h4 v-if="fair_dt.append.length != 0" class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
			<span>付属情報</span>
		</h4>
		<div class="uk-margin">
			<ul
				v-for="(data) in fair_dt.append"
				:key="data.append_information_id"
				data-uk-accordion="multiple: true"
				class="uk-accordion-alt"
			>
				<li>
					<h3 class="uk-accordion-title">
						{{ data.append_information_type | view('append_information_type') }}
					</h3>
					<div class="uk-accordion-content uk-accordion-content sc-border sc-round sc-padding">
						<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider uk-text-pre-table">
							<tbody>
								<tr v-if="data.recruiting_period_start || data.recruiting_period_end">
									<th class="uk-width-medium">
										募集期間
									</th>
									<td>{{ data.recruiting_period_start }} ~ {{ data.recruiting_period_end }}</td>
								</tr>
								<tr v-if="data.recruiting_job_type">
									<th class="uk-width-medium">
										募集業種
									</th>
									<td>{{ data.recruiting_job_type | view('recruiting_job_type') }}</td>
								</tr>
								<tr v-if="data.content">
									<th class="uk-width-medium">
										内容
									</th>
									<td>{{ data.content }}</td>
								</tr>
								<tr v-if="data.various_matters">
									<th class="uk-width-medium">
										諸事項
									</th>
									<td>{{ data.various_matters }}</td>
								</tr>
								<tr v-if="data.other">
									<th class="uk-width-medium">
										その他
									</th>
									<td>{{ data.other }}</td>
								</tr>
							</tbody>
						</table>
						<!-- <h5 class="uk-margin-large-top">
							付属詳細情報
						</h5> -->
						<table v-if="isScholarship(data)" class="uk-table-detail uk-table uk-table-responsive uk-table-divider uk-text-pre-table">
							<tbody>
								<tr v-if="data.hospital_scholarship.target_person">
									<th class="uk-width-medium">
										対象者
									</th>
									<td>{{ data.hospital_scholarship.target_person }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.document_submitted">
									<th class="uk-width-medium">
										提出書類
									</th>
									<td>{{ data.hospital_scholarship.document_submitted }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.selection_system">
									<th class="uk-width-medium">
										選考方法
									</th>
									<td>{{ data.hospital_scholarship.selection_system }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.loan_amount">
									<th class="uk-width-medium">
										貸与額
									</th>
									<td>{{ data.hospital_scholarship.loan_amount }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.loan_period_start || data.hospital_scholarship.loan_period_end">
									<th class="uk-width-medium">
										貸与期間
									</th>
									<td>{{ data.hospital_scholarship.loan_period_start }} ~ {{ data.hospital_scholarship.loan_period_end }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.payback_period_start || data.hospital_scholarship.payback_period_end">
									<th class="uk-width-medium">
										返済履行期限
									</th>
									<td>{{ data.hospital_scholarship.payback_period_start }} ~ {{ data.hospital_scholarship.payback_period_end }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.payback">
									<th class="uk-width-medium">
										返済
									</th>
									<td>{{ data.hospital_scholarship.payback }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.payback_exemption">
									<th class="uk-width-medium">
										返済免除
									</th>
									<td>{{ data.hospital_scholarship.payback_exemption | view('payback_exemption') }}</td>
								</tr>
								<tr v-if="data.hospital_scholarship.payback_exemption_condition">
									<th class="uk-width-medium">
										返済免除条件
									</th>
									<td>{{ data.hospital_scholarship.payback_exemption_condition }}</td>
								</tr>
							</tbody>
						</table>
						<table v-else-if="isIntership(data)" class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
							<tbody>
								<tr v-if="data.hospital_intership.target_person">
									<th class="uk-width-medium">
										対象者
									</th>
									<td>{{ data.hospital_intership.target_person }}</td>
								</tr>
								<tr v-if="data.hospital_intership.training_period_start || data.hospital_intership.training_period_end">
									<th class="uk-width-medium">
										実習期間
									</th>
									<td>{{ data.hospital_intership.training_period_start }} ～ {{ data.hospital_intership.training_period_end }}</td>
								</tr>
							</tbody>
						</table>
						<table v-else-if="isPractice(data)" class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
							<tbody>
								<tr v-if="data.hospital_practice.target_person">
									<th class="uk-width-medium">
										対象者
									</th>
									<td>{{ data.hospital_practice.target_person }}</td>
								</tr>
								<tr v-if="data.hospital_practice.practice_period_start || data.hospital_practice.practice_period_end">
									<th class="uk-width-medium">
										研修期間
									</th>
									<td>{{ data.hospital_practice.practice_period_start }} ～ {{ data.hospital_practice.practice_period_end }}</td>
								</tr>
							</tbody>
						</table>
						<table v-else-if="isInfo(data)" class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
							<tbody>
								<tr v-if="data.hospital_fair.target_person">
									<th class="uk-width-medium">
										対象者
									</th>
									<td>{{ data.hospital_fair.target_person }}</td>
								</tr>
								<tr v-if="data.hospital_fair.hospital_fair_type">
									<th class="uk-width-medium">
										病院説明会種別
									</th>
									<td>
										<ul class="uk-list">
											<li v-for="hospitalFairType in hospitalFairTypes" :key="hospitalFairType.value">
												<label>
													<input
														:checked="checkedTest(hospitalFairType.value, data.hospital_fair.hospital_fair_type)"
														class="uk-checkbox"
														type="checkbox"
														disabled="disabled"
														:value="hospitalFairType.value"
													>
													{{ hospitalFairType.text }}
												</label>
											</li>
										</ul>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { CONST } from '~/const.js';
import _ from 'lodash';
export default {
	components: {
	},
	props: {
		// 受け取る属性名を指定
		fair_dt: Object // オブジェクトのみ受け取る
	},
	data: () => ({
	}),

	computed: {
		hospitalFairTypes () {
			return CONST.getCode("hospital_fair_type");
		},
	},
	methods: {
		checkedTest (value, array) {
			return _.some(array, (dt) => dt === value);
		},
		isScholarship (data) {
			return data.append_information_type === CONST.append_information_type.SCHOLARSHIP.value;
		},
		isIntership (data) {
			return data.append_information_type === CONST.append_information_type.INTERSHIP.value;
		},
		isPractice (data) {
			return data.append_information_type === CONST.append_information_type.PRACTICE.value;
		},
		isInfo (data) {
			return data.append_information_type === CONST.append_information_type.INFO.value;
		},
	},
}
</script>
<style lang="scss">
</style>
