export const HISTORY_SIZE = 5
export const frequencyHistory = []

export function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function frequencyToMidi(frequency) {
  return 69 + 12 * Math.log2(frequency / 440)
}

export function frequencyToCents(frequency, midi) {
  return 1200 * Math.log2(frequency / midiToFrequency(midi))
}

export function calculateRms(buffer) {
  let sum = 0
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i]
  return Math.sqrt(sum / buffer.length)
}

export function yinPitchDetection(buffer, sampleRate, micThreshold) {
  if (!buffer || buffer.length < 1024 || !Number.isFinite(sampleRate) || sampleRate <= 0) return -1
  const rms = calculateRms(buffer)
  if (!Number.isFinite(rms) || rms < micThreshold) return -1

  // 45Hzまでの低音を検出。窓長不足時は安全にスキップする。
  const threshold = 0.12
  const minFrequency = 45
  const maxFrequency = 1600
  const minTau = Math.max(2, Math.floor(sampleRate / maxFrequency))
  const maxTau = Math.min(Math.floor(sampleRate / minFrequency), Math.floor(buffer.length / 2) - 1)
  if (maxTau <= minTau + 2) return -1
  const yinBuffer = new Float32Array(maxTau + 1)

  for (let tau = 1; tau <= maxTau; tau++) {
    let sum = 0
    for (let i = 0; i < buffer.length - tau; i++) {
      const delta = buffer[i] - buffer[i + tau]
      sum += delta * delta
    }
    yinBuffer[tau] = sum
  }

  yinBuffer[0] = 1
  let runningSum = 0
  for (let tau = 1; tau <= maxTau; tau++) {
    runningSum += yinBuffer[tau]
    yinBuffer[tau] = runningSum === 0 ? 1 : (yinBuffer[tau] * tau) / runningSum
  }

  let tauEstimate = -1
  for (let tau = minTau; tau < maxTau; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < maxTau && yinBuffer[tau + 1] < yinBuffer[tau]) tau++
      tauEstimate = tau
      break
    }
  }
  if (tauEstimate === -1 || yinBuffer[tauEstimate] > threshold) return -1

  let betterTau = tauEstimate
  if (tauEstimate > 1 && tauEstimate + 1 < yinBuffer.length) {
    const s0 = yinBuffer[tauEstimate - 1]
    const s1 = yinBuffer[tauEstimate]
    const s2 = yinBuffer[tauEstimate + 1]
    const denominator = 2 * (2 * s1 - s2 - s0)
    if (denominator !== 0) betterTau = tauEstimate + (s2 - s0) / denominator
  }

  if (!Number.isFinite(betterTau) || betterTau <= 0) return -1
  const frequency = sampleRate / betterTau
  if (!Number.isFinite(frequency) || frequency < minFrequency || frequency > maxFrequency) return -1
  return frequency
}

export function getSmoothedFrequency(frequency) {
  frequencyHistory.push(frequency)
  if (frequencyHistory.length > HISTORY_SIZE) frequencyHistory.shift()
  const sorted = [...frequencyHistory].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
