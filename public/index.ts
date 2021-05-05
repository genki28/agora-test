import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" })

