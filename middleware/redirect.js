export default function ({ route, redirect, store }) {
	if (route.path === '/') {
		redirect('/school_activity')
	}
	if (route.path === '/meeting') {
		// チャンネル画面を経由して表示されない場合は、画面を戻す
		!store.state.isThroughChannel ? redirect('/channel') : "";
	}
}
