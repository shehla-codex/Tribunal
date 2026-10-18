/**
 * Web Audio API synthesizer for courtroom sound effects.
 * 100% synthesized in-browser: zero external audio files, zero copyrighted assets.
 */

const STORAGE_KEY_MUTED = "tribunal_sound_muted";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Checks whether sound effects are currently muted.
 */
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY_MUTED) === "true";
  } catch {
    return false;
  }
}

/**
 * Updates the sound mute preference in localStorage.
 */
export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MUTED, muted ? "true" : "false");
  } catch {
    // ignore localStorage errors
  }
}

/**
 * Synthesizes a weighty wooden gavel impact and courtroom chime using Web Audio API.
 * Never throws an exception.
 */
export function playObjectionSound(): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Gavel wooden block impact (quick downward frequency sweep)
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.type = "sine";
    impactOsc.frequency.setValueAtTime(260, now);
    impactOsc.frequency.exponentialRampToValueAtTime(55, now + 0.12);

    impactGain.gain.setValueAtTime(0.7, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    impactOsc.connect(impactGain);
    impactGain.connect(ctx.destination);
    impactOsc.start(now);
    impactOsc.stop(now + 0.16);

    // 2. Wooden snap transient (short filtered noise burst)
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // 3. Resonant courtroom bench body (warm low rumble)
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(115, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    bodyGain.gain.setValueAtTime(0.4, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.31);

    // 4. Subtle courtroom dramatic resonance (two gentle harmonics)
    [480, 720].forEach((freq) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, now + 0.02);

      chimeGain.gain.setValueAtTime(0.18, now + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.02);
      chimeOsc.stop(now + 0.42);
    });
  } catch {
    // Ignore audio synthesis errors on unsupported browsers
  }
}
