// import { appId, channel, token } from './secrets'
require('dotenv').config()

const appId = process.env.appId
const channel = process.env.channel
const token = process.env.token

import {
  querySelector,
  renderButtons,
  renderParticipants,
  renderUserId,
} from "./modules/ui.js"
const AgoraRTC = window.AgoraRTC;

const state = {
  client: null,
  currentUserId: null,
  joined: false,
  localAudioTrack: null,
  participants: new Set(),
  published: false,
  speakers: new Set()
}

main()

function main() {
  const client = createLocalClient()
  state.client = client

  querySelector("#join").onclick = onJoinClick
  querySelector("#leave").onclick = onLeaveClick
  querySelector("#publish").onclick = onPublishClick
  querySelector("#unpublish").onclick = onUnpublishClick
  
  client.on("user-joined", onAgoraUserJoined)
  client.on("user-left", onAgoraUserLeft)
  client.on("user-published", onAgoraUserPublished)
  client.on("user-unpublished", onAgoraUserUnpublished)
}

async function onJoinClick() {
  if (!state.client) {
    throw new Error("Client must be ready")
  }

  // TODO: この辺のid必要です！
  const uid = await state.client.join(appId, channel, token, null)

  state.currentUserId = uid
  state.joined = true
  renderButtons(state)
  renderUserId(state)
}

async function onLeaveClick() {
  if (!state.client) {
    throw new Error("Client must be ready")
  }

  // 音声のトラックを閉じる（必須）
  client.localTracks.forEach((v) => v.close())

  await client.leave()

  state.currentUserId = null
  state.joined = false
  state.localAudioTrack = null
  state.participants.clear()
  state.published = false
  renderButtons(state)
  renderUserId(state)
  renderParticipants(state)
}

async function onPublishClick() {
  if (!state.client) {
    throw new Error("Client must be ready");
  }

  // Create an audio track from the audio sampled by a microphone.
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Publish the local audio track to the channel.
  await state.client.publish([localAudioTrack]);

  state.localAudioTrack = localAudioTrack;
  state.published = true;
  renderButtons(state);
}

async function onUnpublishClick() {
  if (!state.client) {
    throw new Error("Client must be ready");
  }

  await state.client.unpublish();

  state.published = false;
  renderButtons(state);
}

/**
 * @param {IAgoraRTCRemoteUser} user
 */
 async function onAgoraUserJoined(user) {
  state.participants.add(user);
  renderParticipants(state);
}

/**
 * @param {IAgoraRTCRemoteUser} user
 */
async function onAgoraUserLeft(user) {
  state.participants.delete(user);
  renderParticipants(state);
}

/**
 * @param {IAgoraRTCRemoteUser} user
 * @param {"audio" | "video"} mediaType
 */
 async function onAgoraUserPublished(user, mediaType) {
  if (!state.client) {
    throw new Error("Client must be ready");
  }

  state.speakers.add(user);
  renderParticipants(state);

  const remoteTrack = await state.client.subscribe(user, mediaType);
  remoteTrack.play();
}

/**
 * @param {IAgoraRTCRemoteUser} user
 */
async function onAgoraUserUnpublished(user) {
  state.speakers.delete(user);
  renderParticipants(state);

  // Get the dynamically created DIV container.
  // (I didn't find what this DIV is in the document)
  const playerContainer = document.getElementById(String(user.uid));
  if (playerContainer) {
    // Destroy the container.
    playerContainer.remove();
  }
}

function createLocalClient() {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return client;
}
