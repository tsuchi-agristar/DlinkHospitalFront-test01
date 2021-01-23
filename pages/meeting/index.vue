<template>
	<div id="sc-page-wrapper" class="meeting_sec">
		<div id="sc-page-content" class="meeting_wrap">
			<div id="remote-media" class="screen">
				<div
					id="local-media_after"
					:class="{
						'connection': participantCount > 0 ,
						active:fullscreen_active
					}"
				>
				</div>
				<div class="screen remotemedia_box w_100 wrap">
					<div class="screen uk-flex-center w_100">
						<div id="remote-media_add" class="uk-flex uk-flex-center w_100 wrap">
							<!-- video track -->
							<div
								v-for="{track, participantIdentity} in remoteMediaVideoTracks"
								:id="`participantContainer-${participantIdentity}`"
								:key="track.name"
								class="participantContainer w_65"
								:class="{
									'w_50': participantCount > 1
								}"
								@click="videoClick"
							>
								<div>
									<div :id="`participantName-${participantIdentity}`" class="instructions">
										<p>{{ participantIdentity }}</p>
									</div>
								</div>
								<MediaTrack :track="track"></MediaTrack>
							</div>
							<!-- audio track -->
							<div
								v-for="{track, participantIdentity} in remoteMediaAudioTracks"
								:id="`participantAudio-${participantIdentity}`"
								:key="track.name"
								class="none"
							>
								<MediaTrack :track="track"></MediaTrack>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="controls">
				<div class="screen screen_show join_wrap">
					<div class="uk-width-1-1@s uk-width-1-2@m uk-width-1-2@l uk-width-1-3@xl uk-margin-auto">
						<ScCard>
							<ScCardBody>
								<h2 class="sc-login-page-logo">
									テレビ会議をはじめる
								</h2>
								<div id="room-controls" class="uk-form-stacked uk-margin-medium-bottom">
									<div class="sc-text-semibold uk-margin-bottom">
										<ScInput
											id="identityName"
											v-model="$v.identityName.$model"
											:error-state="$v.identityName.$error"
											:validator="$v.identityName"
											type="text"
											mode="outline"
										>
											<label>お名前</label>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.identityName.required">
												必須項目です
											</li>
										</ul>
									</div>

									<div class="sc-text-semibold uk-margin-bottom">
										<ScInput
											id="roomName"
											v-model="$v.roomName.$model"
											:error-state="$v.roomName.$error"
											:validator="$v.roomName"
											type="text"
											mode="outline"
										>
											<label>ルームコード</label>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.roomName.required">
												必須項目です
											</li>
										</ul>
									</div>
									<button
										v-show="!isRoomActive"
										id="button-join"
										class="uk-margin-medium-top sc-button sc-button-large sc-button-block sc-button-secondary"
										@click="joinRoom()"
									>
										ルームに参加
									</button>
								</div>
							</ScCardBody>
						</ScCard>
					</div>
				</div>
				<div id="preview" class="uk-flex sc-login-page-wrapper">
					<div id="control_tab" class="control_tab uk-grid-small uk-grid uk-flex-center">
						<div
							id="local-media_before"
							class="position_rel"
							:class="{ active: previewTracks }"
						>
							<div
								v-for="{track} in localMediaTracks"
								:key="track.name"
								@click="videoClick"
							>
								<MediaTrack :track="track"></MediaTrack>
							</div>
						</div>
						<div class="tab_switch" @click="tabOpen()" @mouseover="closeIconHideShow()" @mouseout="closeIconHidehide()">
							<i class="mdi mdi-dots-horizontal"></i>
						</div>
						<div>
							<button
								v-show="!isRoomActive"
								id="button-preview"
								class="flexcenter sc-button"
								:class="{'md-bg-green-600': previewTracks, 'md-color-white': previewTracks}"
								@click="buttonPreviewClick()"
							>
								<i
									class="uk-margin-small-right uk-icon mdi mdi-video-check"
									:class="{'md-color-white': previewTracks}"
								></i>
								<span>カメラプレビュー</span>
							</button>
						</div>
						<div class="" data-uk-tooltip="ルームを退出">
							<button
								id="button-leave"
								class="sc-button sc-button-icon"
								:class="{'sc-button-disabled' : !isRoomActive, 'md-bg-red-800' : isRoomActive}"
								@click="buttonLeaveClick()"
							>
								<i
									class="mdi mdi-phone-hangup md-color-grey-600"
									:class="{'md-color-grey-600': !isRoomActive, 'md-color-white': isRoomActive}"
								></i>
							</button>
						</div>
						<div class="screen">
							<button
								id="button-audio"
								class="sc-button sc-button-icon"
								:class="{
									'sc-button-disabled' : !isRoomActive,
									'md-bg-red-800' : !audioOnOff
								}"
								:data-uk-tooltip="`${audioOnOffText}`"
								@click="buttonAudioClick()"
							>
								<i
									class="mdi"
									:class="{
										'mdi-volume-high' : audioOnOff,
										'md-color-grey-600': audioOnOff,
										'mdi-volume-off': !audioOnOff,
										'md-color-white': !audioOnOff,
									}"
								>
								</i>
							</button>
						</div>
						<div class="screen">
							<button
								id="button-video"
								class="sc-button sc-button-icon"
								:class="{
									'sc-button-disabled' : !isRoomActive,
									'md-bg-red-800' : !videoOnOff
								}"
								:data-uk-tooltip="`${videoOnOffText}`"
								@click="buttonVideoClick()"
							>
								<i
									class="mdi"
									:class="{
										'mdi-video' : videoOnOff,
										'md-color-grey-600': videoOnOff,
										'mdi-video-off': !videoOnOff,
										'md-color-white': !videoOnOff,
									}"
								>
								</i>
							</button>
						</div>
						<div class="screen">
							<button
								id="button-screen"
								class="sc-button sc-button-icon"
								:class="{
									'sc-button-disabled' : !isRoomActive,
								}"
								data-uk-tooltip="画面共有"
								@click="buttonScreenShareClick()"
							>
								<i
									class="mdi md-color-grey-600"
									:class="{
										'mdi-monitor-off': screenShareStatus !== 'NONE',
										'mdi-monitor-multiple': screenShareStatus === 'NONE'
									}"
								></i>
							</button>
						</div>
						<div style="cursor: pointer;" @click="debugActive=!debugActive">
							ログの表示
						</div>
					</div>
					<div class="w_100" :class="[debugActive === true ? 'screen_show' : 'none']">
						<div id="log">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
require('~/plugins/jquery');
import { ScProgressCircular } from '~/components/ui/progress'
import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";


import ScInput from '~/components/ui/Input';
import MediaTrack from '~/components/pages/MediaTrack';
const Video = require("twilio-video");

export default {
	components: {
		ScInput,
		MediaTrack
	},
	mixins: [validationMixin],
	data: () => ({
		identityName: "",
		roomName: "",
		previewTracks: null,
		activeRoom: null,
		fullscreen_active: false,
		videoOnOff: true,
		audioOnOff: true,
		screenShareStatus: "NONE",
		debugActive: false,
		testTracks: [],
		screenShareTrack: null

	}),
	computed: {
		remoteMediaTracks () {
			return this.testTracks.filter((dt) => dt.type==="remote-media_add")
		},
		remoteMediaVideoTracks () {
			return this.testTracks.filter((dt) => dt.type==="remote-media_add" && dt.track.kind==="video")
		},
		remoteMediaAudioTracks () {
			return this.testTracks.filter((dt) => dt.type==="remote-media_add" && dt.track.kind==="audio")
		},
		localMediaTracks () {
			return this.testTracks.filter((dt) => dt.type==="local-media_before")
		},
		isRoomActive () {
			return this.activeRoom !== null;
		},
		videoOnOffText () {
			return (this.videoOnOff ? "カメラをオフする" : "カメラをオンする");
		},
		audioOnOffText () {
			return (this.audioOnOff ? "マイクをオフにする" : "マイクをオンにする");
		},
		participantCount () {
			return this.testTracks.filter((dt) => dt.type==="remote-media_add" && dt.track.kind === 'video').length
		},
	},
	async asyncData ({ app, params, error, route }) {
	},
	mounted () {
		// When we are about to transition away from this page, disconnect
		// from the room, if joined.
		window.addEventListener('beforeunload', this.handler);

		// ルートパラメータにroomNameが設定済みの場合は自動でtwilioに接続する
		if (this.$route.query.roomName) {
			this.identityName = this.$store.state.user.organization_name;
			this.roomName = this.$route.query.roomName;
			this.joinRoom();
		}
	},
	destroyed () {
		window.removeEventListener('beforeunload', this.handler);
	},
	beforeRouteLeave (to, from, next) {
		if (!this.isRoomActive) {

			// プレビューカメラ起動していたら、停止する
			if (this.previewTracks) {
				this.previewTracks.forEach(function (track) {
					track.stop();
				});
			}

			next()
			return;
		}

		if (window.confirm("テレビ会議を終了しますか？")) {
			this.leaveRoomIfJoined();
			next();
			return;
		}
	},
	methods: {
		joinRoom () {
			const vueObj = this;
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			// 画面を切り替え
			$('.screen').toggleClass('screen_show');
			var query = 'identity=' + this.identityName + '&room' + this.roomName;
			this.log(this.identityName + "さんがルームコード'" + this.roomName + "'に参加中です...");

			var connectOptions = {
				video: { width: 640 },
				audio: true,
				name: this.roomName,
				logLevel: 'debug',
			};

			if (this.previewTracks) {
				connectOptions.tracks = this.previewTracks;
			}

			this.$axios.get(`/api/token?${query}`).then(function ({ data }) {
				// vueObj.log("Token is generated as " + data.token);
				// Join the Room with the token from the server and the
				// LocalParticipant's Tracks.
				Video.connect(data.token, connectOptions)
					.then(
						vueObj.roomJoined,
						function (error) {
							vueObj.log('Could not connect to Twilio: ' + error.message);
						}
					);
			});
		},
		roomJoined (room) {
			const vueObj = this;
			this.setButtonsClassInitial();
			window.room = this.activeRoom = room;

			this.log(this.identityName + "さんが参加しました");

			// まだ接続されていない場合は、LocalParticipantのトラックを接続します
			var previewContainer = document.getElementById('local-media_before');
			if (!previewContainer.querySelector('video')) {
				window.previewTracks = this.previewTracks = this.getTracks(room.localParticipant);
				this.attachTracks(this.getTracks(room.localParticipant), previewContainer);
			}

			// 既にルームに参加している参加者のトラックを添付します。
			var remoteMediaContainer = document.getElementById('remote-media_add');
			room.participants.forEach(function (participant) {
				vueObj.log("既に'" + participant.identity + "'さんが参加しています");
				vueObj.participantConnected(participant, remoteMediaContainer);
			});

			// 参加者がルームに参加したら、イベントをログに記録します。
			room.on('participantConnected', function (participant) {
				vueObj.log("'" + participant.identity + "'さんが参加しました");
				vueObj.participantConnected(participant, remoteMediaContainer);
			});

			// 参加者が部屋を離れたら、トラックを切り離します
			room.on('participantDisconnected', function (participant) {
				vueObj.log(participant.identity + "'さんがルームから退出しました");
				vueObj.detachParticipantTracks(participant);
			});

			// LocalParticipantが部屋を離れたら、LocalParticipantのトラックを
			// 含むすべての参加者のトラックを切り離します
			room.on('disconnected', function () {
				vueObj.log('退出が完了しました');
				// $('.screen').toggleClass('screen_show');
				if (vueObj.previewTracks) {
					vueObj.previewTracks.forEach(function (track) {
						track.stop();
					});
					vueObj.previewTracks = null;
				}
				if (vueObj.screenShareTrack) {
					vueObj.screenShareTrack.stop();
				}
				vueObj.detachParticipantTracks(room.localParticipant);
				room.participants.forEach(vueObj.detachParticipantTracks);
				vueObj.activeRoom = null;
			});
		},
		// A new RemoteParticipant joined the Room
		participantConnected (participant, container) {
			const vueObj = this;
			participant.tracks.forEach(function (publication) {
				vueObj.trackPublished(publication, container, participant.identity);
			});
			participant.on('trackPublished', function (publication) {
				vueObj.trackPublished(publication, container, participant.identity);
			});
			participant.on('trackUnpublished', this.trackUnpublished);
		},
		// A new RemoteTrack was published to the Room.
		trackPublished (publication, container, participantIdentity) {
			const vueObj = this;
			if (publication.isSubscribed) {
				this.attachTrack(publication.track, container, participantIdentity);
			}
			publication.on('subscribed', function (track) {
				// vueObj.log('Subscribed to ' + publication.kind + ' track');
				vueObj.attachTrack(track, container, participantIdentity);
			});
			publication.on('unsubscribed', this.detachTrack);
		},
		// A RemoteTrack was unpublished from the Room.
		trackUnpublished (publication) {
			this.log(publication.kind + ' track was unpublished.');
		},
		// Attach the Tracks to the DOM.
		attachTracks (tracks, container) {
			const vueObj = this;
			tracks.forEach(function (track) {
				vueObj.attachTrack(track, container, "");
			});
		},
		// Attach the Track to the DOM.
		attachTrack (track, container, participantIdentity) {
			this.testTracks.push({
				name: track.name,
				type: container.id,
				track: track,
				participantIdentity: participantIdentity
			})

		},
		// Detach the Tracks to the DOM.
		detachTracks (tracks) {
			const vueObj = this;
			tracks.forEach(function (track) {
				vueObj.detachTrack(track);
			});
		},
		// Detach given track from the DOM.
		detachTrack (track) {
			this.testTracks = this.testTracks.filter((dt) => dt.name !== track.name);
			track.detach().forEach(function (element) {
				element.remove();
			});
		},
		getTracks (participant) {
			return Array.from(participant.tracks.values()).filter(function (publication) {
				return publication.track;
			}).map(function (publication) {
				return publication.track;
			});
		},
		// Detach the Participant's Tracks from the DOM.
		detachParticipantTracks (participant) {
			var tracks = this.getTracks(participant);
			tracks.forEach(this.detachTrack);
		},
		setButtonsClassInitial () {
			this.audioOnOff = true;
			this.videoOnOff = true;
			this.screenShareStatus = "NONE";
		},
		buttonLeaveClick () {

			this.log('ルームを退出します');
			this.activeRoom.disconnect();
			this.$router.go(-1);
		},
		// カメラプレビュー
		buttonPreviewClick () {
			// Preview LocalParticipant's Tracks.
			this.previewTracks ? this.unPreviewCamera() : this.previewCamera();
		},
		//Mute Audio
		buttonAudioClick () {
			this.audioOnOff ? this.muteAudio() : this.unMuteAudio();
			this.audioOnOff = !this.audioOnOff;
		},

		//Mute Video
		buttonVideoClick () {
			this.videoOnOff ? this.muteVideo() : this.unMuteVideo();
			this.videoOnOff = !this.videoOnOff;
		},
		videoClick (event) {
			if (this.fullscreen_active) {
				this.DocumentExitFullscreen(document);
				this.fullscreen_active = false;
			} else {
				this.ElementRequestFullscreen(event.target);
				this.fullscreen_active = true;
			}
		},
		async buttonScreenShareClick () {
			if (this.screenShareStatus === "NONE") {
				this.screenShareStatus = "DOING";
				const stream = await navigator.mediaDevices.getDisplayMedia();

				// 画面キャプチャトラックを参加者に公開する
				this.screenShareTrack = new Video.LocalVideoTrack(stream.getVideoTracks()[0]);
				this.activeRoom.localParticipant.publishTrack(this.screenShareTrack);

				// 画面共有停止された場合は、参加者側に表示されているトラックを非公開にする
				this.screenShareTrack.once('stopped', () => {
					this.activeRoom.localParticipant.unpublishTrack(this.screenShareTrack);
					this.screenShareTrack = null;
					this.screenShareStatus = "NONE";
				});
				this.screenShareStatus = "DONE";
			}
			else if (this.screenShareStatus === "DONE") {
				this.screenShareTrack.stop();
			}
			else {
				// DOINGの時は何もしない
			};
		},
		muteVideo () {
			this.activeRoom.localParticipant.videoTracks.forEach(function (videoTracks) {
				videoTracks.track.disable();
			});
		},
		unMuteVideo () {
			this.activeRoom.localParticipant.videoTracks.forEach(function (videoTracks) {
				videoTracks.track.enable();
			});
		},
		unMuteAudio () {
			this.activeRoom.localParticipant.audioTracks.forEach(function (audioTrack) {
				audioTrack.track.enable();
			});
		},
		muteAudio () {
			this.activeRoom.localParticipant.audioTracks.forEach(function (audioTrack) {
				audioTrack.track.disable();
			});
		},
		// Preview Camera
		previewCamera () {
			const vueObj = this;
			// Preview LocalParticipant's Tracks.
			(Video.createLocalTracks()).then(function (tracks) {
				window.previewTracks = vueObj.previewTracks = tracks;
				var previewContainer = document.getElementById('local-media_before');
				if (!previewContainer.querySelector('video')) {
					vueObj.attachTracks(tracks, previewContainer);
				}
			}, function (error) {
				console.error('Unable to access local media', error);
				log('Unable to access Camera and Microphone');
			});
		},
		// Un Preview Camera
		unPreviewCamera () {
			const vueObj = this;
			Promise.resolve(this.previewTracks).then(function (tracks) {
				vueObj.detachTracks(tracks);
				tracks.forEach(function (track) {
					track.stop();
				});
				window.previewTracks = vueObj.previewTracks = null;
			}, function (error) {
				console.error('Unable to access local media', error);
				log('Unable to access Camera and Microphone');
			});
		},
		// リロード実行前の確認画面
		handler (event) {
			// 画面離脱時に接続を切断する
			this.leaveRoomIfJoined();
		},
		// Activity log.
		log (message) {
			var logDiv = document.getElementById('log');
			logDiv.innerHTML += '<p><span>' + message + '</span></p>';
			logDiv.scrollTop = logDiv.scrollHeight;
		},

		// https://hakuhin.jp/js/fullscreen.html
		// 任意のエレメントをフルスクリーン表示する関数
		ElementRequestFullscreen (element){
			var list = [
				"requestFullscreen",
				"webkitRequestFullScreen",
				"mozRequestFullScreen",
				"msRequestFullscreen"
			];
			var i;
			var num = list.length;
			for(i=0;i < num;i++){
				if(element[list[i]]){
					element[list[i]]();
					return true;
				}
			}
			return false;
		},

		// フルスクリーンを終了する関数
		DocumentExitFullscreen (document_obj){
			var list = [
				"exitFullscreen",
				"webkitExitFullscreen",
				"mozCancelFullScreen",
				"msExitFullscreen"
			];
			var i;
			var num = list.length;
			for(i=0;i < num;i++){
				if(document_obj[list[i]]){
					document_obj[list[i]]();
					return true;
				}
			}
			return false;
		},
		// Leave Room.
		leaveRoomIfJoined (e) {
			// プレビューカメラ起動していたら、停止する
			if (this.previewTracks) {
				this.previewTracks.forEach(function (track) {
					track.stop();
				});
			}
			if (this.activeRoom) {
				this.activeRoom.disconnect();
			}
		},
		// タブの表示切替
		tabOpen () {
			var control_tab = $('#control_tab');
			control_tab.toggleClass('active');
		},
		closeIconHideShow () {
			var control_tab = $('#control_tab');
			if( !control_tab.hasClass('active') ){
				$('.tab_switch').children('i').removeClass('mdi-dots-horizontal').addClass('mdi-close');
			}
		},
		closeIconHidehide () {
			var control_tab = $('#control_tab');
			if( !control_tab.hasClass('active') ){
				$('.tab_switch').children('i').removeClass('mdi-close').addClass('mdi-dots-horizontal');
			}else{
				$('.tab_switch').children('i').removeClass('mdi-close').addClass('mdi-dots-horizontal');
			}
		},
	},
	validations: {
		identityName: {
			required,
		},
		roomName: {
			required,
		}
	}
};
</script>
<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Share+Tech+Mono);
.w_100{ width:100% }
.w_65{ width:65% }
.w_50{ width:calc(50% - 20px) }
.meeting_sec{
	.meeting_wrap {
   		position: relative;
		min-height: calc(100vh - 48px);
		padding: 24px;
		box-sizing: border-box;
		overflow: hidden;
		background: #272726 !important;
	}
	#controls{
		box-sizing: border-box;
	}
	.join_wrap{
		height: calc(100vh - 144px);
		width: 100%;
		display: flex;
		align-items: center;
	}
	#remote-media {
		width: 100%;
		min-height: 100px;
		margin: 0 0 30px 0;
		.remotemedia_box{
			width: calc(100% - 150px);
		}
		video {
			background-repeat: no-repeat;
			margin: 0;
			max-width: 100%;
			width: 100%;
			height: auto;
		}

	}
	#remote-media_add,
	#local-media_after{
		&.active{
				text-align: center;
			video{
				width: auto;
				height: 100vh;
			}
		}
	}
	.sc-login-page-wrapper {
		height: 100%;
		// padding: 48px;
		box-sizing: border-box;
		overflow: hidden;
	}
	#local-media_after{
		&.connection{
			position: fixed;
			right: 0;
			top: 72px;
			width: 160px;
		}
	}
	#local-media_before.position_rel {
		position: fixed;
		right: 20px;
		bottom: 10px;
		width: 200px;
		height: 150px;
		padding: 0;
		box-sizing: border-box;
 		background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjEgKDEyMDAyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDUxICsgRmlsbCA1MjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJjdW1tYWNrIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU5LjAwMDAwMCwgLTE3NDYuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxnIGlkPSJGaWxsLTUxLSstRmlsbC01MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU5LjAwMDAwMCwgMTc0Ni4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOS42ODYsMC43MyBDMTcuODUsMC43MyAwLjA4NSwxOC41IDAuMDg1LDQwLjMzIEMwLjA4NSw2Mi4xNyAxNy44NSw3OS45MyAzOS42ODYsNzkuOTMgQzYxLjUyMiw3OS45MyA3OS4yODcsNjIuMTcgNzkuMjg3LDQwLjMzIEM3OS4yODcsMTguNSA2MS41MjIsMC43MyAzOS42ODYsMC43MyBMMzkuNjg2LDAuNzMgWiBNMzkuNjg2LDEuNzMgQzYxLjAwNSwxLjczIDc4LjI4NywxOS4wMiA3OC4yODcsNDAuMzMgQzc4LjI4Nyw2MS42NSA2MS4wMDUsNzguOTMgMzkuNjg2LDc4LjkzIEMxOC4zNjcsNzguOTMgMS4wODUsNjEuNjUgMS4wODUsNDAuMzMgQzEuMDg1LDE5LjAyIDE4LjM2NywxLjczIDM5LjY4NiwxLjczIEwzOS42ODYsMS43MyBaIiBpZD0iRmlsbC01MSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQ3Ljk2LDUzLjMzNSBMNDcuOTYsNTIuODM1IEwyMC4wOTMsNTIuODM1IEwyMC4wOTMsMjcuODI1IEw0Ny40NiwyNy44MjUgTDQ3LjQ2LDM4LjI1NSBMNTkuMjc5LDMwLjgwNSBMNTkuMjc5LDQ5Ljg1NSBMNDcuNDYsNDIuNDA1IEw0Ny40Niw1My4zMzUgTDQ3Ljk2LDUzLjMzNSBMNDcuOTYsNTIuODM1IEw0Ny45Niw1My4zMzUgTDQ4LjQ2LDUzLjMzNSBMNDguNDYsNDQuMjE1IEw2MC4yNzksNTEuNjY1IEw2MC4yNzksMjguOTk1IEw0OC40NiwzNi40NDUgTDQ4LjQ2LDI2LjgyNSBMMTkuMDkzLDI2LjgyNSBMMTkuMDkzLDUzLjgzNSBMNDguNDYsNTMuODM1IEw0OC40Niw1My4zMzUgTDQ3Ljk2LDUzLjMzNSIgaWQ9IkZpbGwtNTIiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
		background-position: center;
		background-color: #c4c4c4;
		background-repeat: no-repeat;
		pointer-events: none;
		opacity: 0;
		transition: 300ms;
		z-index: 4;
			&.active {
			bottom: 20px;
			opacity: 1;
			}
	}
	.flex-center{
		justify-content: center;
	}
	.participantContainer{
		position: relative;
		box-sizing: border-box;
		background: #4e4e4e;
		margin:10px;
	}
	.instructions {
		position: absolute;
		left: 10px;
		top: 10px;
		margin: 0;
		width: calc(100% - 10px);
		box-sizing: border-box;
		p{
			background: white;
			display: inline-block;
			padding: 4px 15px 3px 15px;
			border-radius: 50px;
			margin: 0;
		}
	}
	#controls p.instructions {
		max-width: 640px;
		width: 100%;
		background: red;
	}
	#controls #room-controls input {
		font-family: Helvetica-LightOblique, Helvetica, sans-serif;
		font-style: oblique;
		font-size: 1em;
	}

	#controls button:active {
		position: relative;
		top: 1px;
	}
	.control_tab {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 2;
		width: 100%;
		height: auto;
		padding: 15px 0;
		background: #ffffff;
    	box-shadow: 0px -2px 11px rgba(39, 39, 38, 0.2);
		align-items: center;
		transition:300ms;
	}
	.control_tab.active{
		bottom: -68px;
	}
	.tab_switch{
		position: absolute;
		top: -25px;
		background: #ffffff;
    	color: #272726;
    	box-shadow: 0px -2px 3px rgba(39, 39, 38, 0.2);
		width: 85px;
		height: 25px;
		border-radius: 5px 5px 0 0;
		padding: 0;
		transition: 300ms;
		text-align: center;
		cursor: pointer;
	}
	.tab_switch:hover{
	background: #d2d2d2;
	}
	#local-media video {
		max-width: 100%;
		max-height: 100%;
		border: none;
		background:#4e4e4e;
	}
	.sc-button-icon{
		min-width: 48px;
		height: 48px;
		padding: 4px 8px;
		display: flex !important;
		align-items: center;
		justify-content: center;
		border-radius: 50px;
	}

	.tab_switch .mdi:before{
		line-height: 1;
	}
	#controls #room-controls {
		display: block;
	}

	#controls #room-controls input {
		width: 100%;
		display: block;
	}

	#controls #log {
		width: 100%;
		height: 13.5em;
		background: #c4c4c4;
		font-size: 14px;
		padding: 10px;
		box-sizing: border-box;
		text-align: left;
		overflow-y: scroll;
		overflow-x: hidden;
		p {
			margin: 0;
			span {
				font-size: 1.25em;
				display: inline-block;
				background: white;
				border-radius: 4px;
				padding: 5px 10px;
				box-sizing: border-box;
				margin: 0 0 15px 0;
			}
		}
	}
	// .side{
	// 	.participantContainer {
	// 		width: 160px;
	// 	}
	// 	.flex-center {
	// 		justify-content: space-between;
	// 	}
	// 	.remotemedia_box {
	// 		width: 160px;
	// 	}
	// }
	.wrap{
	flex-wrap: wrap;
	}
	@keyframes screen_hide{
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.screen{
		display: none;
		pointer-events: none;

		&.screen_show{
			display: flex;
			pointer-events: auto;
			animation-name: screen_hide;
			animation-duration: .5s;
		}
	}
	@media screen and (max-width:1000px){
		#local-media_before.position_rel{
			bottom:50px;
			&.active{
				bottom:60px;
			}
		}
		.control_tab{
			padding: 15px 0;
		}
		.control_tab{
			bottom: 0;
		}
		.tab_switch{
			display: none;
		}
	}
}
.none {
    display: none !important;
}
</style>

