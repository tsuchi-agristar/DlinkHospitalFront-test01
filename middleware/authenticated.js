export default function ({ app, store, redirect }) {
	if (~app.context.route.name.indexOf("login")) {
		return;
	}
	if (!store.state.authenticated) {
		return redirect('/login')
	}
}
