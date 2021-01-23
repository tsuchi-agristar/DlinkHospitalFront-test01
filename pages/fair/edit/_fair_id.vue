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
							編集画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>募集情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m " uk-first-column>
										<label class="uk-form-label uk-margin-remove-top">
											<span class="contact_label required">必須</span>説明会種別
										</label>
										<div class="uk-form-controls">
											<ul class="uk-list uk-margin-remove" :class="{ 'vuelidate-wrapper-error': $v.fair_dt.fair_type.$error }">
												<li v-for="(data, index) in fairTypes"
													:key="index"
												>
													<label>
														<input
															v-model="$v.fair_dt.fair_type.$model"
															:checked="checkedTest(data.value, fair_dt.fair_type)"
															:error-state="$v.fair_dt.fair_type.$error"
															:validator="$v.fair_dt.fair_type"
															class="uk-checkbox"
															:value="data.value"
															type="checkbox"
														>{{ data.text }}
													</label>
												</li>
											</ul>
											<ul class="sc-vue-errors">
												<li v-if="!$v.fair_dt.fair_type.required">
													必須項目です
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m" uk-first-column>
										<label class="uk-form-label">
											<span class="contact_label required">必須</span>募集期間
										</label>
										<div class="uk-form-controls" :class="{ 'vuelidate-wrapper-error': $v.fair_dt.plan_start_at.$error || $v.fair_dt.plan_end_at.$error }">
											<div class="uk-grid">
												<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
													<ScInput
														id="plan_start_at"
														v-model="$v.fair_dt.plan_start_at.$model"
														v-flatpickr="planAtDatePicker"
														:error-state="$v.fair_dt.plan_start_at.$error"
														:validator="$v.fair_dt.plan_start_at"
														mode="outline"
													>
														<label>開始日</label>
													</ScInput>
												</div>
												<div class="flexmiddle uk-margin-small-top ">
													~
												</div>
												<div class="uk-width-2-5@s uk-margin-small-top ">
													<ScInput
														id="plan_end_at"
														v-model="$v.fair_dt.plan_end_at.$model"
														v-flatpickr="planAtDatePicker"
														:error-state="$v.fair_dt.plan_end_at.$error"
														:validator="$v.fair_dt.plan_end_at"
														mode="outline"
													>
														<label>終了日</label>
													</ScInput>
												</div>
											</div>
										</div>
										<ul class="sc-vue-errors">
											<li v-if="!$v.fair_dt.plan_start_at.required || !$v.fair_dt.plan_end_at.required">
												必須項目です
											</li>
											<li v-if="!$v.fair_dt.plan_start_at.validatePlanAt">
												開始日/終了日の整合性が正しくありません
											</li>
										</ul>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>説明情報</span>
							</h4>
							<div class="md-bg-grey-100">
								<transition-group tag="div" name="fade">
									<div v-for="(item, index) in append" :key="item.id" class="sc-padding sc-form-section" :class="( index % 2 ) ? 'md-bg-white sc-border-top' : 'uk-add-form'">
										<div class="uk-grid" data-uk-grid>
											<div class="uk-width-expand">
												<h4 class="uk-margin uk-heading-line">
													<div>
														<span v-if="isScholarship($v.append.$each[index].append_information_type.$model)">
															奨学金情報
														</span>
														<span v-else-if="isIntership($v.append.$each[index].append_information_type.$model)">
															インターンシップ情報
														</span>
														<span v-else-if="isPractice($v.append.$each[index].append_information_type.$model)">
															実習情報
														</span>
														<span v-else-if="isInfo($v.append.$each[index].append_information_type.$model)">
															病院説明会情報
														</span>
													</div>
												</h4>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m" uk-first-column>
														<label class="uk-form-label" for="append_information_type">
															<span class="contact_label">任意</span>情報種別
														</label>
														<div class="uk-form-controls">
															<client-only>
																<Select2
																	v-model="$v.append.$each[index].append_information_type.$model"
																	:error-state="$v.append.$each[index].append_information_type.$error"
																	:validator="$v.append.$each[index].append_information_type"
																	class="uk-select2"
																	:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
																>
																	<option
																		v-for="data in appendInformationType"
																		:key="data.value"
																		:value="data.value"
																	>
																		{{ data.text }}
																	</option>
																</Select2>
															</client-only>
														</div>
													</div>
												</div>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m" uk-first-column>
														<label class="uk-form-label" for="recruiting_period">
															<span class="contact_label">任意</span>募集期間
														</label>
														<div class="uk-form-controls">
															<div class="uk-grid">
																<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
																	<ScInput
																		id="recruiting_period_start"
																		v-model="$v.append.$each[index].recruiting_period_start.$model"
																		v-flatpickr="dpTimePicker"
																		:error-state="$v.append.$each[index].recruiting_period_start.$error"
																		:validator="$v.append.$each[index].recruiting_period_start"
																		mode="outline"
																	>
																		<label>募集開始日</label>
																	</ScInput>
																</div>
																<div class="flexmiddle uk-margin-small-top ">
																	~
																</div>
																<div class="uk-width-2-5@s uk-margin-small-top ">
																	<ScInput
																		id="recruiting_period_end"
																		v-model="$v.append.$each[index].recruiting_period_end.$model"
																		v-flatpickr="dpTimePicker"
																		:error-state="$v.append.$each[index].recruiting_period_end.$error"
																		:validator="$v.append.$each[index].recruiting_period_end"
																		mode="outline"
																	>
																		<label>募集終了日</label>
																	</ScInput>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m uk-first-column">
														<label class="uk-form-label" for="recruiting_job_type">
															<span class="contact_label">任意</span>募集業種
														</label>
														<div class="uk-form-controls">
															<client-only>
																<Select2
																	v-model="$v.append.$each[index].recruiting_job_type.$model"
																	:error-state="$v.append.$each[index].recruiting_job_type.$error"
																	:validator="$v.append.$each[index].recruiting_job_type"
																	class="uk-select2"
																	:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
																>
																	<option
																		v-for="data in recruitingJobType"
																		:key="data.value"
																		:value="data.value"
																	>
																		{{ data.text }}
																	</option>
																</Select2>
															</client-only>
														</div>
													</div>
												</div>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m uk-first-column">
														<label class="uk-form-label" for="content">
															<span class="contact_label">任意</span>内容
														</label>
														<div class="uk-form-controls">
															<ScTextarea
																id="content"
																v-model="$v.append.$each[index].content.$model"
																:error-state="$v.append.$each[index].content.$error"
																:validator="$v.append.$each[index].content"
																rows="4"
																mode="outline"
															>
															</ScTextarea>
															<ul class="sc-vue-errors">
																<li v-if="!$v.append.$each[index].content.maxLength">
																	入力可能桁数を超過しています
																</li>
															</ul>
														</div>
													</div>
												</div>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m uk-first-column">
														<label class="uk-form-label" for="various_matters">
															<span class="contact_label">任意</span>諸事項
														</label>
														<div class="uk-form-controls">
															<ScTextarea
																id="various_matters"
																v-model="$v.append.$each[index].various_matters.$model"
																:error-state="$v.append.$each[index].various_matters.$error"
																:validator="$v.append.$each[index].various_matters"
																rows="4"
																mode="outline"
															>
															</ScTextarea>
															<ul class="sc-vue-errors">
																<li v-if="!$v.append.$each[index].various_matters.maxLength">
																	入力可能桁数を超過しています
																</li>
															</ul>
														</div>
													</div>
												</div>
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-1-1@m uk-first-column">
														<label class="uk-form-label" for="other">
															<span class="contact_label">任意</span>その他
														</label>
														<div class="uk-form-controls">
															<ScTextarea
																id="other"
																v-model="$v.append.$each[index].other.$model"
																:error-state="$v.append.$each[index].other.$error"
																:validator="$v.append.$each[index].other"
																rows="4"
																mode="outline"
															>
															</ScTextarea>
															<ul class="sc-vue-errors">
																<li v-if="!$v.append.$each[index].various_matters.maxLength">
																	入力可能桁数を超過しています
																</li>
															</ul>
														</div>
													</div>
												</div>
												<!-- 奨学金情報 -->
												<div v-if="isScholarship($v.append.$each[index].append_information_type.$model)">
													<h4 class="uk-margin-large-top">
														説明詳細情報
													</h4>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="document_submitted">
																<span class="contact_label">任意</span>提出書類
															</label>
															<div class="uk-form-controls">
																<ScTextarea
																	id="document_submitted"
																	v-model="$v.append.$each[index].hospital_scholarship.document_submitted.$model"
																	:error-state="$v.append.$each[index].hospital_scholarship.document_submitted.$error"
																	:validator="$v.append.$each[index].hospital_scholarship.document_submitted"
																	mode="outline"
																>
																</ScTextarea>
																<ul class="sc-vue-errors">
																	<li v-if="!$v.append.$each[index].hospital_scholarship.document_submitted.maxLength">
																		入力可能桁数を超過しています
																	</li>
																</ul>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="selection_system">
																<span class="contact_label">任意</span>選考方法
															</label>
															<div class="uk-form-controls">
																<ScTextarea
																	id="selection_system"
																	v-model="$v.append.$each[index].hospital_scholarship.selection_system.$model"
																	:error-state="$v.append.$each[index].hospital_scholarship.selection_system.$error"
																	:validator="$v.append.$each[index].hospital_scholarship.selection_system"
																	mode="outline"
																></ScTextarea>
																<ul class="sc-vue-errors">
																	<li v-if="!$v.append.$each[index].hospital_scholarship.selection_system.maxLength">
																		入力可能桁数を超過しています
																	</li>
																</ul>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="loan_amount">
																<span class="contact_label">任意</span>貸与額
															</label>
															<div class="uk-form-controls">
																<ScTextarea
																	id="loan_amount"
																	v-model="$v.append.$each[index].hospital_scholarship.loan_amount.$model"
																	:error-state="$v.append.$each[index].hospital_scholarship.loan_amount.$error"
																	:validator="$v.append.$each[index].hospital_scholarship.loan_amount"
																	mode="outline"
																></ScTextarea>
																<ul class="sc-vue-errors">
																	<li v-if="!$v.append.$each[index].hospital_scholarship.loan_amount.maxLength">
																		入力可能桁数を超過しています
																	</li>
																</ul>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m" uk-first-column>
															<label class="uk-form-label">
																<span class="contact_label">任意</span>貸与期間
															</label>
															<div class="uk-form-controls">
																<div class="uk-grid" data-uk-grid>
																	<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
																		<ScInput
																			id="loan_period_start"
																			v-model="$v.append.$each[index].hospital_scholarship.loan_period_start.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_scholarship.loan_period_start.$error"
																			:validator="$v.append.$each[index].hospital_scholarship.loan_period_start"
																			mode="outline"
																		>
																			<label>貸与期間開始日</label>
																		</ScInput>
																	</div>
																	<div class="flexmiddle uk-margin-small-top ">
																		~
																	</div>
																	<div class="uk-width-2-5@s uk-margin-small-top ">
																		<ScInput
																			id="loan_period_end"
																			v-model="$v.append.$each[index].hospital_scholarship.loan_period_end.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_scholarship.loan_period_end.$error"
																			:validator="$v.append.$each[index].hospital_scholarship.loan_period_end"
																			mode="outline"
																		>
																			<label>貸与期間終了日</label>
																		</ScInput>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m" uk-first-column>
															<label class="uk-form-label">
																<span class="contact_label">任意</span>返済履行期限
															</label>
															<div class="uk-form-controls">
																<div class="uk-grid" data-uk-grid>
																	<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
																		<ScInput
																			id="payback_period_start"
																			v-model="$v.append.$each[index].hospital_scholarship.payback_period_start.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_scholarship.payback_period_start.$error"
																			:validator="$v.append.$each[index].hospital_scholarship.payback_period_start"
																			mode="outline"
																		>
																			<label>返済履行開始日</label>
																		</ScInput>
																	</div>
																	<div class="flexmiddle uk-margin-small-top ">
																		~
																	</div>
																	<div class="uk-width-2-5@s uk-margin-small-top ">
																		<ScInput
																			id="payback_period_end"
																			v-model="$v.append.$each[index].hospital_scholarship.payback_period_end.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_scholarship.payback_period_end.$error"
																			:validator="$v.append.$each[index].hospital_scholarship.payback_period_end"
																			mode="outline"
																		>
																			<label>返済履行終了日</label>
																		</ScInput>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="payback">
																<span class="contact_label">任意</span>返済
															</label>
															<div class="uk-form-controls">
																<ScTextarea
																	id="payback"
																	v-model="$v.append.$each[index].hospital_scholarship.payback.$model"
																	:error-state="$v.append.$each[index].hospital_scholarship.payback.$error"
																	:validator="$v.append.$each[index].hospital_scholarship.payback"
																	mode="outline"
																></ScTextarea>
																<ul class="sc-vue-errors">
																	<li v-if="!$v.append.$each[index].hospital_scholarship.payback.maxLength">
																		入力可能桁数を超過しています
																	</li>
																</ul>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="payback_exemption">
																<span class="contact_label">任意</span>返済免除
															</label>
															<div class="uk-form-controls">
																<client-only>
																	<Select2
																		id="payback_exemption"
																		v-model="$v.append.$each[index].hospital_scholarship.payback_exemption.$model"
																		:error-state="$v.append.$each[index].hospital_scholarship.payback_exemption.$error"
																		:validator="$v.append.$each[index].hospital_scholarship.payback_exemption"
																		class="uk-select2"
																		:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
																	>
																		<option
																			v-for="data in paybackExemption"
																			:key="data.value"
																			:value="data.value"
																		>
																			{{ data.text }}
																		</option>
																	</Select2>
																</client-only>
															</div>
														</div>
													</div>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-first-column">
															<label class="uk-form-label" for="payback_exemption_condition">
																<span class="contact_label">任意</span>返済免除条件
															</label>
															<div class="uk-form-controls">
																<ScTextarea
																	id="payback_exemption_condition"
																	v-model="$v.append.$each[index].hospital_scholarship.payback_exemption_condition.$model"
																	:error-state="$v.append.$each[index].hospital_scholarship.payback_exemption_condition.$error"
																	:validator="$v.append.$each[index].hospital_scholarship.payback_exemption_condition"
																	mode="outline"
																></ScTextarea>
																<ul class="sc-vue-errors">
																	<li v-if="!$v.append.$each[index].hospital_scholarship.payback_exemption_condition.maxLength">
																		入力可能桁数を超過しています
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
												<!-- インターンシップ情報 -->
												<div v-else-if="isIntership($v.append.$each[index].append_information_type.$model)">
													<h4 class="uk-margin-large-top">
														説明詳細情報
													</h4>

													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m" uk-first-column>
															<label class="uk-form-label">
																<span class="contact_label">任意</span>研修期間
															</label>
															<div class="uk-form-controls">
																<div class="uk-grid">
																	<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
																		<ScInput
																			id="practice_period_start"
																			v-model="$v.append.$each[index].hospital_intership.training_period_start.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_intership.training_period_start.$error"
																			:validator="$v.append.$each[index].hospital_intership.training_period_start"
																			mode="outline"
																		>
																			<label>研修開始日</label>
																		</ScInput>
																	</div>
																	<div class="flexmiddle uk-margin-small-top ">
																		~
																	</div>
																	<div class="uk-width-2-5@s uk-margin-small-top ">
																		<ScInput
																			id="practice_period_end"
																			v-model="$v.append.$each[index].hospital_intership.training_period_end.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_intership.training_period_end.$error"
																			:validator="$v.append.$each[index].hospital_intership.training_period_end"
																			mode="outline"
																		>
																			<label>研修終了日</label>
																		</ScInput>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<!-- 実習情報 -->
												<div v-else-if="isPractice($v.append.$each[index].append_information_type.$model)">
													<h4 class="uk-margin-large-top">
														説明詳細情報
													</h4>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m uk-grid-margin" uk-first-column>
															<label class="uk-form-label">
																<span class="contact_label">任意</span>実習期間
															</label>
															<div class="uk-form-controls">
																<div class="uk-grid">
																	<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
																		<ScInput
																			id="practice_period_start"
																			v-model="$v.append.$each[index].hospital_practice.practice_period_start.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_practice.practice_period_start.$error"
																			:validator="$v.append.$each[index].hospital_practice.practice_period_start"
																			mode="outline"
																		>
																			<label>募集開始日</label>
																		</ScInput>
																	</div>
																	<div class="flexmiddle uk-margin-small-top ">
																		~
																	</div>
																	<div class="uk-width-2-5@s uk-margin-small-top ">
																		<ScInput
																			id="practice_period_end"
																			v-model="$v.append.$each[index].hospital_practice.practice_period_end.$model"
																			v-flatpickr="dpTimePicker"
																			:error-state="$v.append.$each[index].hospital_practice.practice_period_end.$error"
																			:validator="$v.append.$each[index].hospital_practice.practice_period_end"
																			mode="outline"
																		>
																			<label>募集終了日</label>
																		</ScInput>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<!-- 病院説明会情報 -->
												<div v-else-if="isInfo($v.append.$each[index].append_information_type.$model)">
													<h4 class="uk-margin-large-top">
														付属詳細情報
													</h4>
													<div class="uk-grid" data-uk-grid>
														<div class="uk-width-1-1@m" uk-first-column>
															<label class="uk-form-label">
																<span class="contact_label">任意</span>説明会種別
															</label>
															<div class="uk-form-controls">
																<ul class="uk-list">
																	<li v-for="data in hospitalFairType"
																		:key="data.value"
																	>
																		<label>
																			<input
																				v-model="$v.append.$each[index].hospital_fair.hospital_fair_type.$model"
																				:error-state="$v.append.$each[index].hospital_fair.hospital_fair_type.$error"
																				:validator="$v.append.$each[index].hospital_fair.hospital_fair_type"
																				class="uk-checkbox"
																				:value="data.value"
																				type="checkbox"
																			>{{ data.text }}
																			<!-- :checked="checkedTest(data.value, item.hospital_fair.hospital_fair_type)" -->
																		</label>
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="uk-width-auto position-relative">
												<div class="uk-grid-small uk-grid">
													<div>
														<a	href="javascript:void(0)"
															class="sc-button sc-button-icon sc-button-outline sc-button-outline-square md-bg-white sc-button-outline-primary"
															:class="{ noBtn: append.length !== (index+1) }"
															@click="addApendForm($event)"
														>
															<i class="mdi mdi-plus"></i>
														</a>
													</div>
													<div>
														<a	href="#modal-header-footer"
															class="sc-button sc-button-icon sc-button-outline sc-button-outline-square md-bg-white sc-button-outline-danger"
															data-uk-toggle
															@click="setId(item.id)"
														>
															<i class="mdi mdi-trash-can-outline"></i>
														</a>
													</div>
												</div>
												<div class="uk-grid-small uk-grid position-absolute position-absolute-bottom">
													<div>
														<a	href="javascript:void(0)"
															class="sc-button sc-button-icon sc-button-outline sc-button-outline-square md-bg-white sc-button-outline-primary"
															:class="{ noBtn: append.length !== (index+1) }"
															@click="addApendForm($event)"
														>
															<i class="mdi mdi-plus"></i>
														</a>
													</div>
													<div>
														<a	href="#modal-header-footer"
															class="sc-button sc-button-icon sc-button-outline sc-button-outline-square md-bg-white sc-button-outline-danger"
															data-uk-toggle
															@click="setId(item.id)"
														>
															<i class="mdi mdi-trash-can-outline"></i>
														</a>
													</div>
												</div>
												<div id="modal-header-footer" class="uk-modal" data-uk-modal>
													<div class="uk-modal-dialog">
														<button class="uk-modal-close-default" type="button" data-uk-close></button>
														<div class="uk-modal-body">
															<p>削除しますか</p>
														</div>
														<div class="uk-modal-footer uk-text-right">
															<button class="sc-button sc-button-flat uk-modal-close" type="button">
																キャンセル
															</button>
															<button
																href="javascript:void(0)"
																class="sc-button sc-button-danger waves-effect waves-button waves-light uk-modal-close"
																type="button"
																@click="removeApendForm($event, id)"
															>
																削除
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</transition-group>
							</div>
							<div class="md-bg-grey-100 uk-text-center">
								<div v-if="append.length === 0" class="sc-padding ">
									<a href="javascript:void(0)" class="sc-button sc-button-flex md-bg-white sc-button-outline" @click="addApendForm($event)">
										<i class="mdi mdi-plus md-color-cyan-600 sc-icon-24"></i>
										<span>説明情報を追加する</span>
									</a>
								</div>
							</div>
							<!-- <h4 class="uk-margin-large-top">
								<span>備考</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="remarks">
											備考
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="remarks"
												v-model="$v.fair_dt.remarks.$model"
												:error-state="$v.fair_dt.remarks.$error"
												:validator="$v.fair_dt.remarks"
												mode="outline"
											>
											</ScInput>
										</div>
									</div>
								</div>
							</div> -->
							<div class="uk-margin-large-top uk-flex-left">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading},[ isNothingInput === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="btnLoading"
									@click.prevent="saveFair()"
								>
									<span v-if="!btnLoading">登録</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScTextarea from '~/components/ui/Textarea'
import { ScProgressCircular } from "~/components/ui/progress";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { Japanese } from "flatpickr/dist/l10n/ja.js"
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import moment from '~/plugins/moment'
import { CONST } from '~/const.js';

import { scHelpers } from "~/assets/js/utils";
const { uniqueID } = scHelpers;
import ScInput from '~/components/ui/Input'
if(process.client) {
	require('~/plugins/flatpickr');
}
const validatePlanAt = (value, vm) => (vm.plan_start_at <= vm.plan_end_at);
export default {
	components: {
		ScInput,
		ScProgressCircular,
		ScTextarea,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		id: "",
		btnLoading: false,
		append: [],
		Japanese,
	}),
	computed: {
		paybackExemption () {
			return CONST.getCode("payback_exemption");
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		appendInformationType () {
			return CONST.getCode("append_information_type");
		},
		recruitingJobType () {
			return CONST.getCode("recruiting_job_type");
		},
		hospitalFairType () {
			return CONST.getCode("hospital_fair_type");
		},
		planAtDatePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: false,
				time_24hr: false,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d",
				minDate: 'today'
			}
		},
		dpTimePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: false,
				time_24hr: false,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d",
			}
		},
		dpRange () {
			return {
				mode: "range",
				plugins: [confirmDatePlugin]
			}
		},
		dpMultipleDates () {
			return {
				mode: "multiple",
				wrap: true,
				plugins: [confirmDatePlugin]
			}
		},
		flatpickr () {
			return {
				enableTime: true,
				noCalendar: true,
				dateFormat: "H:i",
			}
		},
		isNothingInput () {
			if(this.fair_dt.fair_type.length === 0
				|| this.fair_dt.plan_start_at === ''
				|| this.fair_dt.plan_end_at === '') {
				return true;
			}
			return false;
		}
	},
	async asyncData ( {app, store, params, error} ) {
		let fair_dt = {
			fair_id: null,
			hospital_id: store.state.user.organization_id,
			fair_type: [],
			plan_start_at: '',
			plan_end_at: '',
			remarks: null,
			append: [],
		}
		// 編集
		if (params.fair_id) {
			let { data, error } = await app.$axios.get(
				`/api/fair/${params.fair_id}`
			);
			if (error) {
				return { fair_dt: fair_dt };
			} else {
				return {
					fair_dt: Object.assign(fair_dt, data),
					append: fair_dt.append
				};
			}
		}
		return { fair_dt: fair_dt };


	},
	methods: {
		setId (id) {
			this.id = id;
		},
		addApendForm (e) {
			e.preventDefault();
			this.append.push({
				id: uniqueID(),
				hospital_id: this.fair_dt.hospital_id,
				// 説明情報
				append_information_type: null,
				recruiting_period_start: null,
				recruiting_period_end: null,
				recruiting_job_type: null,
				content: null,
				various_matters: null,
				other: null,
				// 奨学金情報
				hospital_scholarship: {
					document_submitted: '',
					selection_system: '',
					loan_amount: '',
					loan_period_start: '',
					loan_period_end: '',
					payback_period_start: '',
					payback_period_end: '',
					payback: '',
					payback_exemption: '',
					payback_exemption_condition: '',
				},
				// インターンシップ情報
				hospital_intership: {
					training_period_start: '',
					training_period_end: '',
				},
				// 実習情報
				hospital_practice: {
					practice_period_start: '',
					practice_period_end: '',
				},
				// 病院説明会情報
				hospital_fair: {
					hospital_fair_type: [],
				}
			})
		},
		removeApendForm (e, id) {
			e.preventDefault();
			var index = this.append.map(function (item) {
				return item.id
			}).indexOf(id);
			this.append.splice(index, 1);
			UIkit.notification("削除しました");
		},
		isScholarship (type) {
			return type === CONST.append_information_type.SCHOLARSHIP.value;
		},
		isIntership (type) {
			return type === CONST.append_information_type.INTERSHIP.value;
		},
		isPractice (type) {
			return type === CONST.append_information_type.PRACTICE.value;
		},
		isInfo (type) {
			return type === CONST.append_information_type.INFO.value;
		},
		async saveFair () {
			this.fair_dt.append = this.append;
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			// 更新
			if (this.$route.params.fair_id) {
				res = await this.$axios.put(`/api/fair`, this.fair_dt);
			}
			// 登録
			else {
				res = await this.$axios.post(`/api/fair`, this.fair_dt);
			}
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.$router.go(-1);
			}
		},
		async getFair (fair_id) {
			let { data, error } = await this.$axios.get(
				`/api/fair/${fair_id}`
			);
			if (error) {
			} else {
				Object.assign(this.fair_dt, data);
			}
		},
		checkedTest (value, data) {
			return data.every((dt) => dt === value);
		},
	},
	validations: {
		fair_dt: {
			fair_type: {
				required
			},
			plan_start_at: {
				required
			},
			plan_end_at: {
				required,
				validatePlanAt
			},
			remarks: {
			},
		},
		append: {
			$each: {
				append_information_type: {
				},
				recruiting_period_start: {
				},
				recruiting_period_end: {
				},
				recruiting_job_type: {
				},
				content: {
					maxLength: maxLength(3000)
				},
				various_matters: {
					maxLength: maxLength(3000)
				},
				other: {
					maxLength: maxLength(3000)
				},
				// 奨学金情報
				hospital_scholarship: {
					document_submitted: {
						maxLength: maxLength(3000)
					},
					selection_system: {
						maxLength: maxLength(3000)
					},
					loan_amount: {
						maxLength: maxLength(3000)
					},
					loan_period_start: {
					},
					loan_period_end: {
					},
					payback_period_start: {
					},
					payback_period_end: {
					},
					payback: {
						maxLength: maxLength(3000)
					},
					payback_exemption: {
					},
					payback_exemption_condition: {
						maxLength: maxLength(3000)
					},
				},
				// インターンシップ情報
				hospital_intership: {
					training_period_start: {
					},
					training_period_end: {
					},
				},
				// 実習情報
				hospital_practice: {
					practice_period_start: {
					},
					practice_period_end: {
					},
				},
				// 病院説明会情報
				hospital_fair: {
					hospital_fair_type: {
					}
				},
			}
		},
	}
}
</script>
<style scoped lang="scss">
.fade{
    &-enter-active{
        opacity: 0;
        transform: translateX(50px);
        transition: {
            property       : transform, opacity;
            duration       : 0.6s;
            timing-function: cubic-bezier(0.77, 0, 0.175, 1);
            delay          : 0s;
        }
    }
    &-enter-to{
        opacity: 1;
        transform: translateX(0);
    }
    &-leave-active{
        opacity: 1;
        transform: translateX(0);
        transition: {
            property       : transform, opacity;
            duration       : 0.6s;
            timing-function: cubic-bezier(0.77, 0, 0.175, 1);
            delay          : 0s;
        }
    }
    &-leave-to{
        opacity: 0;
        transform: translateX(50px);
    }
    &-move{
        transition: {
            property       : transform;
            duration       : 0.6s;
            timing-function: cubic-bezier(0.77, 0, 0.175, 1);
            delay          : 0s;
        }
    }
}
</style>
