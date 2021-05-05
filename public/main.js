const { default: AgoraRTC } = require("agora-rtc-sdk-ng")


document.querySelector("#join").onclick = onJoinClick
document.querySelector("#leave").onclick = onLeaveClick
document.querySelector("#publish").onclick = onPublishClick
document.querySelector("unpublish").onclick = onUnpublishClick

client.on("user-joined", onAgoraUserJoined)
client.on("user-left", onAgoraUserLeft)
client.on("user-published", onAgoraUserPublished)
client.on("user-unpublished", onAgoraUserUnpublished)

async function onJoinClick() {
  // TODO: この辺のid必要です！
  const uid = await client.join(appId, channel, token, null)
}

async function onLeaveClick() {
  // 音声のトラックを閉じる（必須）
  client.localTracks.forEach((v) => v.close())

  await client.leave()
}

async function onPublishClick() {
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
  await client.publish([localAudioTrack])
}

async function onUnpublishClick() {
  await client.unpublish()
}

async function onAgoraUserJoined(user) {
  state.participants.add(user)
  renderParticipants(state)
}

async function onAgoraUserLeft(user) {
  state.participants.delete(user)
  renderParticipants(state)
}

async function onAgoraUserPublished(user, mediaType) {
  const track = await client.subscribe(user, mediaType)
  track.play()
}

function createLocalClient() {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8"})
  return client
}
