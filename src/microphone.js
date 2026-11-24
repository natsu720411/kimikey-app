export async function createMicrophoneInput({ noiseReduction = true } = {}) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone API is unavailable')
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: noiseReduction,
      noiseSuppression: noiseReduction,
      autoGainControl: false,
      channelCount: 1,
    },
  })

  let audioContext = null
  try {
    audioContext = new AudioContext()
    if (audioContext.state === 'suspended') await audioContext.resume()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 4096
    analyser.smoothingTimeConstant = 0

    const microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)
    return { stream, audioContext, analyser, microphone }
  } catch (error) {
    stream.getTracks().forEach(track => track.stop())
    await audioContext?.close().catch(() => {})
    throw error
  }
}

export function releaseMicrophoneInput({ stream, audioContext }) {
  stream?.getTracks().forEach(track => track.stop())
  audioContext?.close().catch(() => {})
}
