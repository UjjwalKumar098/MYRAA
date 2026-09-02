/**
 * AudioStreamer handles capturing microphone input via Web Audio API,
 * processing audio with voice clarity filters (rumble reduction, speech boost, compressor),
 * converting raw audio into pristine 16kHz 16-bit PCM binary chunks,
 * base64-encoding them, and providing real-time microphone audio visualizer metrics.
 */

export class AudioStreamer {
  private audioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private highPassFilterNode: BiquadFilterNode | null = null;
  private presenceFilterNode: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private onAudioChunkCallback: ((base64Pcm16: string) => void) | null = null;
  private isStreaming: boolean = false;
  private isMuted: boolean = false;
  private clarityFiltersEnabled: boolean = true;

  constructor(onAudioChunk?: (base64Pcm16: string) => void) {
    if (onAudioChunk) {
      this.onAudioChunkCallback = onAudioChunk;
    }
  }

  public setOnAudioChunk(callback: (base64Pcm16: string) => void) {
    this.onAudioChunkCallback = callback;
  }

  public setClarityFilters(enabled: boolean) {
    this.clarityFiltersEnabled = enabled;
  }

  public async start(): Promise<void> {
    if (this.isStreaming) return;

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not supported or not available in this browser context. Please use Chrome, Safari, or Edge.');
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      // Standardize AudioContext - use native sampleRate and accurately downsample to 16kHz
      try {
        this.audioCtx = new AudioContextClass({ latencyHint: 'interactive' });
      } catch (e) {
        console.warn('[AudioStreamer] Fallback to default AudioContext constructor');
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Request microphone access with high-fidelity voice constraints
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 16000 },
        },
      });

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);

      // 1. High-Pass Filter: Cuts sub-80Hz environmental rumble & desk bumps
      this.highPassFilterNode = this.audioCtx.createBiquadFilter();
      this.highPassFilterNode.type = 'highpass';
      this.highPassFilterNode.frequency.value = 85;
      this.highPassFilterNode.Q.value = 0.7;

      // 2. Speech Clarity Peaking Filter: Gently enhances 2.8kHz presence for crisp voice articulation
      this.presenceFilterNode = this.audioCtx.createBiquadFilter();
      this.presenceFilterNode.type = 'peaking';
      this.presenceFilterNode.frequency.value = 2800;
      this.presenceFilterNode.gain.value = 3.0; // +3dB presence boost
      this.presenceFilterNode.Q.value = 1.0;

      // 3. Dynamics Compressor: Levels whisper-quiet voices and prevents loud clipping
      this.compressorNode = this.audioCtx.createDynamicsCompressor();
      this.compressorNode.threshold.value = -30;
      this.compressorNode.knee.value = 20;
      this.compressorNode.ratio.value = 4;
      this.compressorNode.attack.value = 0.003;
      this.compressorNode.release.value = 0.15;

      // 4. AnalyserNode for live UI meter & visualizer
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect audio processing chain
      this.sourceNode.connect(this.highPassFilterNode);
      this.highPassFilterNode.connect(this.presenceFilterNode);
      this.presenceFilterNode.connect(this.compressorNode);
      this.compressorNode.connect(this.analyserNode);

      // Buffer size 2048 gives smooth ~128ms chunks at 16k
      const bufferSize = 2048;
      this.processorNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);

      const currentSampleRate = this.audioCtx.sampleRate;

      this.processorNode.onaudioprocess = (event: AudioProcessingEvent) => {
        if (!this.isStreaming || this.isMuted) return;

        const inputData = event.inputBuffer.getChannelData(0);
        // Resample accurately to 16kHz for Gemini Live API
        const resampledData = this.resampleTo16k(inputData, currentSampleRate);
        const pcm16Buffer = this.floatTo16BitPCM(resampledData);
        const base64Data = this.arrayBufferToBase64(pcm16Buffer);

        if (this.onAudioChunkCallback && base64Data) {
          this.onAudioChunkCallback(base64Data);
        }
      };

      this.compressorNode.connect(this.processorNode);
      // Destination connection keeps processor active in modern Chrome/Safari
      this.processorNode.connect(this.audioCtx.destination);

      this.isStreaming = true;
    } catch (error: any) {
      console.error('[AudioStreamer] Error initializing microphone:', error);
      this.stop();
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError' || error?.message?.toLowerCase().includes('permission denied')) {
        const permErr = new Error('Microphone permission was denied. Please allow microphone access in your browser address bar (lock icon) and try again.');
        permErr.name = 'NotAllowedError';
        throw permErr;
      }
      if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
        const notFoundErr = new Error('No microphone device found. Please connect a microphone or headset and try again.');
        notFoundErr.name = 'NotFoundError';
        throw notFoundErr;
      }
      throw error;
    }
  }

  private resampleTo16k(inputData: Float32Array, inputSampleRate: number): Float32Array {
    if (!inputSampleRate || inputSampleRate === 16000) return inputData;
    const ratio = inputSampleRate / 16000;
    const newLength = Math.round(inputData.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const indexFloor = Math.floor(srcIndex);
      const indexCeil = Math.min(indexFloor + 1, inputData.length - 1);
      const weight = srcIndex - indexFloor;
      result[i] = inputData[indexFloor] * (1 - weight) + inputData[indexCeil] * weight;
    }
    return result;
  }

  public stop(): void {
    this.isStreaming = false;

    if (this.processorNode) {
      try {
        this.processorNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.processorNode = null;
    }

    if (this.compressorNode) {
      try {
        this.compressorNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.compressorNode = null;
    }

    if (this.presenceFilterNode) {
      try {
        this.presenceFilterNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.presenceFilterNode = null;
    }

    if (this.highPassFilterNode) {
      try {
        this.highPassFilterNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.highPassFilterNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.analyserNode) {
      try {
        this.analyserNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.analyserNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
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

  public setMute(muted: boolean): void {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsStreaming(): boolean {
    return this.isStreaming;
  }

  /**
   * Returns normalized audio frequency data (0-255) and volume level (0-1)
   */
  public getAudioMetrics(): { frequencyData: Uint8Array; volume: number } {
    if (!this.analyserNode || !this.isStreaming || this.isMuted) {
      return { frequencyData: new Uint8Array(32), volume: 0 };
    }

    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(frequencyData);

    // Calculate RMS volume level
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
    }
    const average = sum / frequencyData.length;
    const volume = Math.min(1, average / 128);

    return { frequencyData, volume };
  }

  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

