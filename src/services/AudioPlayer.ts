/**
 * AudioPlayer handles queuing, decoding, and gapless scheduled playback
 * of 24kHz 16-bit PCM audio streams received from the Gemini Live API.
 * Includes dynamic clarity volume booster, audio limiter compressor,
 * interruption handling, crystal speech synthesis fallback, and audio visualization metrics.
 */

export class AudioPlayer {
  private audioCtx: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private limiterNode: DynamicsCompressorNode | null = null;
  private nextStartTime: number = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private isPlaying: boolean = false;
  private onStateChangeCallback: ((isPlaying: boolean) => void) | null = null;
  private checkInterval: any = null;
  private volumeMultiplier: number = 1.35; // Default clear boost
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor(onStateChange?: (isPlaying: boolean) => void) {
    if (onStateChange) {
      this.onStateChangeCallback = onStateChange;
    }
  }

  public setOnStateChange(callback: (isPlaying: boolean) => void) {
    this.onStateChangeCallback = callback;
  }

  public setVoiceBoost(level: 'normal' | 'boost' | 'broadcast') {
    switch (level) {
      case 'normal':
        this.volumeMultiplier = 1.0;
        break;
      case 'boost':
        this.volumeMultiplier = 1.35;
        break;
      case 'broadcast':
        this.volumeMultiplier = 1.75;
        break;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.volumeMultiplier;
    }
  }

  private initAudioContext(): void {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      try {
        // Live API returns 24000Hz PCM audio
        this.audioCtx = new AudioContextClass({ sampleRate: 24000, latencyHint: 'interactive' });
      } catch (e) {
        console.warn('[AudioPlayer] Fallback to default sampleRate AudioContext');
        this.audioCtx = new AudioContextClass();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.volumeMultiplier;

      // Limiter / Compressor prevents clipping at high volume boosts
      this.limiterNode = this.audioCtx.createDynamicsCompressor();
      this.limiterNode.threshold.value = -6.0;
      this.limiterNode.knee.value = 5.0;
      this.limiterNode.ratio.value = 12.0;
      this.limiterNode.attack.value = 0.002;
      this.limiterNode.release.value = 0.1;

      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.85;

      this.gainNode.connect(this.limiterNode);
      this.limiterNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async playChunk(base64Pcm16: string): Promise<void> {
    try {
      this.initAudioContext();
      if (!this.audioCtx || !this.gainNode) return;

      const arrayBuffer = this.base64ToArrayBuffer(base64Pcm16);
      const audioBuffer = this.pcm16ToAudioBuffer(arrayBuffer, this.audioCtx, 24000);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const currentTime = this.audioCtx.currentTime;
      // Schedule gapless playback: start either at nextStartTime or currentTime (whichever is later)
      const startTime = Math.max(currentTime + 0.005, this.nextStartTime);
      source.start(startTime);

      this.nextStartTime = startTime + audioBuffer.duration;
      this.activeSources.add(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        this.notifyStateChange(true);
        this.startStateMonitor();
      }

      source.onended = () => {
        this.activeSources.delete(source);
        if (this.activeSources.size === 0 && this.audioCtx && this.audioCtx.currentTime >= this.nextStartTime - 0.05) {
          this.isPlaying = false;
          this.notifyStateChange(false);
        }
      };
    } catch (err) {
      console.error('[AudioPlayer] Error playing audio chunk:', err);
    }
  }

  /**
   * Speaks crystal-clear audio using Web Speech Synthesis engine (for English teaching, grammar pronunciation, and offline/clear voice)
   */
  public speakCrystalVoice(
    text: string,
    lang: string = 'en-US',
    rate: number = 0.95,
    pitch: number = 1.05
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.interrupt();

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;

        // Try to pick a natural sounding voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => (v.lang.startsWith(lang) || v.lang.includes(lang.split('-')[0])) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Siri'))
        ) || voices.find((v) => v.lang.startsWith(lang));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        this.isPlaying = true;
        this.notifyStateChange(true);
        this.activeUtterance = utterance;

        utterance.onend = () => {
          this.isPlaying = false;
          this.activeUtterance = null;
          this.notifyStateChange(false);
          resolve();
        };

        utterance.onerror = () => {
          this.isPlaying = false;
          this.activeUtterance = null;
          this.notifyStateChange(false);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[AudioPlayer] Web Speech Synthesis error:', err);
        this.isPlaying = false;
        this.notifyStateChange(false);
        resolve();
      }
    });
  }

  public interrupt(): void {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.activeUtterance = null;

    // Immediately stop all scheduled/playing audio buffer sources
    this.activeSources.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // ignore already stopped sources
      }
    });
    this.activeSources.clear();

    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    } else {
      this.nextStartTime = 0;
    }

    if (this.isPlaying) {
      this.isPlaying = false;
      this.notifyStateChange(false);
    }
  }

  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(2.5, volume * this.volumeMultiplier));
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Returns normalized audio frequency data (0-255) and volume level (0-1)
   * for assistant's voice visualizer.
   */
  public getAudioMetrics(): { frequencyData: Uint8Array; volume: number } {
    if (!this.analyserNode || !this.isPlaying) {
      return { frequencyData: new Uint8Array(32), volume: 0 };
    }

    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(frequencyData);

    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
    }
    const average = sum / frequencyData.length;
    const volume = Math.min(1, average / 120);

    return { frequencyData, volume };
  }

  public destroy(): void {
    this.interrupt();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (e) {
        // ignore
      }
      this.audioCtx = null;
    }
  }

  private startStateMonitor(): void {
    if (this.checkInterval) clearInterval(this.checkInterval);
    this.checkInterval = setInterval(() => {
      if (this.isPlaying && this.activeSources.size === 0 && !this.activeUtterance) {
        if (!this.audioCtx || this.audioCtx.currentTime >= this.nextStartTime - 0.05) {
          this.isPlaying = false;
          this.notifyStateChange(false);
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
      }
    }, 100);
  }

  private notifyStateChange(playing: boolean): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(playing);
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private pcm16ToAudioBuffer(
    buffer: ArrayBuffer,
    ctx: AudioContext,
    sampleRate: number
  ): AudioBuffer {
    const int16Array = new Int16Array(buffer);
    const audioBuffer = ctx.createBuffer(1, int16Array.length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < int16Array.length; i++) {
      channelData[i] = int16Array[i] / 32768.0;
    }

    return audioBuffer;
  }
}

