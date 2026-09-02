/**
 * AmbientSynthesizer
 * Generates rich, procedural soundscapes natively in the browser via Web Audio API.
 * Completely offline, instant, zero external audio asset dependency.
 */

export type AmbientSoundType = 'rain' | 'cosmic' | 'focus' | 'zen' | 'ocean' | 'off';

export class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSound: AmbientSoundType = 'off';
  private currentNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getActiveSound(): AmbientSoundType {
    return this.activeSound;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public stop(): void {
    if (this.activeSound === 'off') return;

    if (this.masterGain && this.ctx) {
      // Smooth fade out
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      setTimeout(() => {
        this.cleanupNodes();
        this.activeSound = 'off';
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
      }, 350);
    } else {
      this.cleanupNodes();
      this.activeSound = 'off';
    }
  }

  private cleanupNodes() {
    for (const node of this.currentNodes) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    }
    this.currentNodes = [];
  }

  public play(type: AmbientSoundType, customVolume?: number): boolean {
    if (customVolume !== undefined) {
      this.setVolume(customVolume);
    }

    if (type === 'off') {
      this.stop();
      return true;
    }

    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    // Fade out previous sound if running
    this.cleanupNodes();
    this.activeSound = type;
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.4);

    switch (type) {
      case 'cosmic':
        this.generateCosmicDrone();
        break;
      case 'rain':
        this.generateRain();
        break;
      case 'focus':
        this.generateBrownNoiseFocus();
        break;
      case 'zen':
        this.generateZenStream();
        break;
      case 'ocean':
        this.generateOceanWaves();
        break;
      default:
        this.generateCosmicDrone();
    }

    return true;
  }

  // 1. Cosmic Deep Space Drone (432Hz harmonic binaural meditation)
  private generateCosmicDrone() {
    if (!this.ctx || !this.masterGain) return;

    const fundamental = 108; // Base resonance
    const freqs = [fundamental, fundamental * 1.5, fundamental * 2, fundamental * 4];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.5 : 0), this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Subtle slow LFO on filter
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.18 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.currentNodes.push(osc, gain, filter, lfo, lfoGain);
    });
  }

  // 2. Realistic Procedural Rain Shower
  private generateRain() {
    if (!this.ctx || !this.masterGain) return;

    // Continuous Pink/White Noise bed
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(180, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    whiteNoise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.currentNodes.push(whiteNoise, lowpass, highpass, gain);
  }

  // 3. Deep Focus Brown Noise
  private generateBrownNoiseFocus() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownSource = this.ctx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    brownSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    brownSource.start();
    this.currentNodes.push(brownSource, filter, gain);
  }

  // 4. Zen Temple Water Stream
  private generateZenStream() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // Dynamic water trickling LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.4, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(400, this.ctx.currentTime);
    lfo.connect(bandpass.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.currentNodes.push(source, bandpass, lfo, lfoGain, gain);
  }

  // 5. Ocean Waves Sweeping Bed
  private generateOceanWaves() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (last + 0.05 * white) / 1.05;
      last = output[i];
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8s swell period
    lfoGain.gain.setValueAtTime(600, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.currentNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  // Play a soft audible chime when timers complete
  public playChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 bell chime
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const startTime = this.ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 1.9);
    });
  }

  public destroy() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
    }
  }
}
