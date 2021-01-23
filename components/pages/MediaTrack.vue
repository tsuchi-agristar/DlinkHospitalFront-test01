<template>
	<div ref="track">
	</div>
</template>

<script>
export default {
	props: {
		track: Object
	},
	data () {
		return {
		}
	},
	mounted () {
		this.$refs.track.appendChild(this.track.attach())
	}
}
</script>
<style>
video::-webkit-media-controls {
  display:none !important;
}
</style>
