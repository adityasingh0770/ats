/** Shared context — browsers may start suspended until a user gesture (e.g. submit). */
let ctx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  return ctx;
}

async function ensureRunning(audioCtx) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    try {
      await audioCtx.resume();
    } catch {
      /* ignore */
    }
  }
}

/** Short bright “ding” — satisfying correct feedback */
export async function playCorrectSoundFX() {
  const audioCtx = getAudioContext();
  await ensureRunning(audioCtx);
  if (!audioCtx) return;

  const t0 = audioCtx.currentTime;
  const notes = [
    { f: 523.25, t: 0, dur: 0.22 },
    { f: 659.25, t: 0.06, dur: 0.24 },
    { f: 783.99, t: 0.12, dur: 0.32 },
    { f: 1046.5, t: 0.06, dur: 0.18 },
  ];

  notes.forEach(({ f, t, dur }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t0 + t);
    gain.gain.setValueAtTime(0.0001, t0 + t);
    gain.gain.exponentialRampToValueAtTime(0.14, t0 + t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + t + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t0 + t);
    osc.stop(t0 + t + dur + 0.05);
  });
}

/** Low descending tone — “not quite” */
export async function playIncorrectSoundFX() {
  const audioCtx = getAudioContext();
  await ensureRunning(audioCtx);
  if (!audioCtx) return;

  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, t0);
  osc.frequency.exponentialRampToValueAtTime(90, t0 + 0.28);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.4);
}
