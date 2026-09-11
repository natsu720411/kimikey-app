export async function createMicrophoneInput() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
      channelCount: 1,
    },
  })

  const audioContext = new AudioContext()
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 4096
  analyser.smoothingTimeConstant = 0

  const microphone = audioContext.createMediaStreamSource(stream)
  microphone.connect(analyser)

  return { stream, audioContext, analyser, microphone }
}

export function releaseMicrophoneInput({ stream, audioContext }) {
  stream?.getTracks().forEach(track => track.stop())
  audioContext?.close().catch(() => {})
}
