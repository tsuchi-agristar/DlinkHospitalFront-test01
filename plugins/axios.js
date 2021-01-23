export default function ({$axios, redirect, app }) {
	$axios.onRequest(config => {
		// console.log("Making request to " + config.url);
	});

	$axios.onError(error => {
		const code = parseInt(error.response && error.response.status);
		// if (code === 400) {
		//   redirect("/400");
		// }
	});

	$axios.interceptors.response.use((response) => {
		return Promise.resolve({
			data: response.data
		});
	}, (error) => {
		return Promise.resolve({
			error: error.response
		});
	});
}
