
import _ from 'lodash';
export const CONST = {
	// 組織種別
	organization_type: {
		MANAGE: { value: "1", text: "管理" },
		HOSPITAL:  { value: "2", text: "病院" },
		SCHOOL: { value: "3", text: "学校" },
	},
	// 申込状態
	application_status: {
		APPLYING: { value: "1", text: "申込中" },
		SUBSCRIBED: { value: "2", text: "申込済" },
		CANCEL:  { value: "3", text: "キャンセル" },
		REJECT:  { value: "4", text: "取下げ" },
	},
	// 学校種別
	school_type: {
		'UNIVERSITY': { value: "1", text: "大学" },
		'APECIALTY': { value: "2", text: "専門学校" },
		'HIGH': { value: "3", text: "高校" },
	},
	// 病院種別
	hospital_type: {
		'UNIVERSITY': { value: "1", text: "大学病院" },
		'PUBLIC': { value: "2", text: "公的病院" },
		'ACUTE': { value: "3", text: "急性期病院" },
		'MEDICAL': { value: "4", text: "療養型病院" },
		'CARE': { value: "5", text: "ケアミックス病院" },
		'REHA': { value: "6", text: "リハビリテーション病院" },
	},
	// イベント状態
	event_status: {
		UNDECIDED: { value: "0", text: "未決定" },
		TENTATIVE: { value: "1", text: "仮決定" },
		OFFICIAL: { value: "2", text: "正式決定" },
		CANCEL: { value: "3", text: "キャンセル" },
		DONE: { value: "4", text: "完了" },
		DONE_NO_PAY: { value: "5", text: "完了(未請求)" },
	},
	// 説明会状態
	fair_status: {
		RECRUITING: { value: "1", text: "募集中" },
		END: { value: "2", text: "募集終了" },
		CANCEL: { value: "3", text: "キャンセル" },
	},
	// 説明会種別
	fair_type: {
		SCHOLARSHIP: { value: "1", text: "奨学金情報" },
		INTERSHIP: { value: "2", text: "インターンシップ情報" },
		PRACTICE: { value: "3", text: "実習情報" },
		INFO: { value: "4", text: "病院説明会情報" },
	},
	// 見積状態
	estimate_status: {
		UNDECIDED: { value: "0", text: "未決定" },
		'TENTATIVE': { value: "1", text: "仮決定" },
		'OFFICIAL': { value: "2", text: "最終決定済" },
	},
	// 付属情報種別
	append_information_type: {
		SCHOLARSHIP: { value: "1", text: "奨学金情報" },
		INTERSHIP: { value: "2", text: "インターンシップ情報" },
		PRACTICE: { value: "3", text: "実習情報" },
		INFO: { value: "4", text: "病院説明会情報" },
	},
	// イベント種別
	event_type: {
		'INDIVIDUAL': { value: "1", text: "個別" },
		'CLASS': { value: "2", text: "授業" },
		'SMALL': { value: "3", text: "少人数" }
	},
	// 説明会形式
	fair_format: {
		'INDIVIDUAL': { value: "1", text: "個別" },
		'CLASS': { value: "2", text: "授業" },
		'SMALL': { value: "3", text: "少人数" }
	},
	// 説明会申込状況
	fair_application_status: {
		'APPLICATION': { value: true, text: "申込中" },
		'NOAPPLICATION': { value: false, text: "申込なし" }
	},
	// メンバーロール
	member_role: {
		'OWNER': { value: "1", text: "主催者" },
		'OTHER': { value: "0", text: "参加者" }
	},
	// 希望するしない
	scholarship_request: {
		'TRUE': { value: "1", text: "希望" },
		'FALSE': { value: "0", text: "未希望" }
	},
	internship_request: {
		'TRUE': { value: "1", text: "希望" },
		'FALSE': { value: "0", text: "未希望" }
	},
	practice_request: {
		'TRUE': { value: "1", text: "希望" },
		'FALSE': { value: "0", text: "未希望" }
	},
	// チャンネル種別
	channel_type: {
		'FAIL': { value: "1", text: "説明会" },
		'INDIVIDUAL': { value: "0", text: "個別" }
	},
	// チャンネル状態
	channel_mode: {
		'OPEN': { value: "1", text: "OPEN" },
		'CLOSE': { value: "2", text: "CLOSE" }
	},
	// チャンネル参加状態
	channel_participation_status: {
		'ESTABLISHMENT': { value: true, text: "開設中" },
		'NOESTABLISHMENT': { value: false, text: "未開設" },
	},
	// 請求状態
	payment_status: {
		'DECIDED': { value: "1", text: "確定" },
		'UNDECIDED': { value: "0", text: "未確定" }
	},
	fair_open_status: {
		'OPEN': { value: true, text: "募集中" },
		'CLOSE': { value: false, text: "未募集" }
	},
	recruiting_job_type: {
		'NURSE': { value: "1", text: "看護師" },
		'ASSOCIATE': { value: "2", text: "准看護師" }
	},
	hospital_fair_type: {
		'HOSPITAL': { value: "1", text: "病院紹介" },
		'DIRECTORS': { value: "2", text: "看護部長の話" },
		'SENIOR': { value: "3", text: "先輩看護師の話" },
		'OTHER': { value: "4", text: "その他" },
	},
	read_status: {
		'UNREAD': { value: '0', text: "未読" },
		'ALREADY': { value: '1', text: "既読" },
	},
	payback_exemption: {
		'TRUE': { value: '1', text: "あり" },
		'FALSE': { value: '0', text: "なし" },
	},
	prefecture_list: [
		"北海道",
		"青森県",
		"岩手県",
		"宮城県",
		"秋田県",
		"山形県",
		"福島県",
		"茨城県",
		"栃木県",
		"群馬県",
		"埼玉県",
		"千葉県",
		"東京都",
		"神奈川県",
		"新潟県",
		"富山県",
		"石川県",
		"福井県",
		"山梨県",
		"長野県",
		"岐阜県",
		"静岡県",
		"愛知県",
		"三重県",
		"滋賀県",
		"京都府",
		"大阪府",
		"兵庫県",
		"奈良県",
		"和歌山県",
		"鳥取県",
		"島根県",
		"岡山県",
		"広島県",
		"山口県",
		"徳島県",
		"香川県",
		"愛媛県",
		"高知県",
		"福岡県",
		"佐賀県",
		"長崎県",
		"熊本県",
		"大分県",
		"宮崎県",
		"鹿児島県",
		"沖縄県"
	],
	prefecture: { // 関東関西は1　それ以外は0 個別チャンネルの価格判定で利用
		"北海道": "0",
		"青森県": "0",
		"岩手県": "0",
		"宮城県": "0",
		"秋田県": "0",
		"山形県": "0",
		"福島県": "0",
		"茨城県": "0",
		"栃木県": "0",
		"群馬県": "0",
		"埼玉県": "1",
		"千葉県": "1",
		"東京都": "1",
		"神奈川県": "1",
		"新潟県": "0",
		"富山県": "0",
		"石川県": "0",
		"福井県": "0",
		"山梨県": "0",
		"長野県": "0",
		"岐阜県": "0",
		"静岡県": "0",
		"愛知県": "0",
		"三重県": "0",
		"滋賀県": "0",
		"京都府": "1",
		"大阪府": "1",
		"兵庫県": "1",
		"奈良県": "0",
		"和歌山県": "0",
		"鳥取県": "0",
		"島根県": "0",
		"岡山県": "0",
		"広島県": "0",
		"山口県": "0",
		"徳島県": "0",
		"香川県": "0",
		"愛媛県": "0",
		"高知県": "0",
		"福岡県": "0",
		"佐賀県": "0",
		"長崎県": "0",
		"熊本県": "0",
		"大分県": "0",
		"宮崎県": "0",
		"鹿児島県": "0",
		"沖縄県": "0"
	},


	getCode (name) {
		return _.map(this[name], (dt) => dt);
	}
}

