/**
 * LiveSession coordinates the WebSocket connection to the server's Gemini Live bridge,
 * synchronizing AudioStreamer, AudioPlayer, ToolManager, and the active session state.
 */

import { AudioStreamer } from './AudioStreamer';
import { AudioPlayer } from './AudioPlayer';
import { ToolManager } from './ToolManager';
import { AssistantState, LiveMessagePayload, LanguageSettings } from '../types';

export interface LiveSessionCallbacks {
  onStateChange: (state: AssistantState) => void;
  onError: (errorMsg: string) => void;
  onToolActivity?: (toolName: string, detail: string) => void;
  onConfigUpdated?: (config: LanguageSettings) => void;
}

export class LiveSession {
  private ws: WebSocket | null = null;
  private audioStreamer: AudioStreamer;
  private audioPlayer: AudioPlayer;
  private toolManager: ToolManager;
  private callbacks: LiveSessionCallbacks;
  private currentState: AssistantState = 'disconnected';
  private pingInterval: any = null;
  private isExplicitDisconnect: boolean = false;
  private lastErrorDispatched: boolean = false;
  private currentSettings: LanguageSettings = {
    primaryLanguage: 'en',
    translationMode: false,
    sourceLanguage: 'en',
    targetLanguage: 'hi',
    voice: 'Aoede',
  };

  constructor(
    audioStreamer: AudioStreamer,
    audioPlayer: AudioPlayer,
    toolManager: ToolManager,
    callbacks: LiveSessionCallbacks
  ) {
    this.audioStreamer = audioStreamer;
    this.audioPlayer = audioPlayer;
    this.toolManager = toolManager;
    this.callbacks = callbacks;

    // Listen to audio player state changes (when Myraa starts/stops speaking)
    this.audioPlayer.setOnStateChange((isPlaying) => {
      if (this.currentState === 'disconnected' || this.currentState === 'connecting') return;

      if (isPlaying) {
        this.setState('speaking');
      } else {
        this.setState('listening');
      }
    });

    // Wire microphone chunks from streamer to WebSocket
    this.audioStreamer.setOnAudioChunk((base64Data) => {
      this.sendAudioChunk(base64Data);
    });
  }

  public async start(settings?: LanguageSettings): Promise<void> {
    if (settings) {
      this.currentSettings = settings;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitDisconnect = false;
    this.lastErrorDispatched = false;
    this.setState('connecting');

    try {
      // Start microphone streaming first to verify permissions
      await this.audioStreamer.start();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const params = new URLSearchParams({
        lang: this.currentSettings.primaryLanguage,
        mode: this.currentSettings.translationMode ? 'translator' : 'conversation',
        sourceLang: this.currentSettings.sourceLanguage,
        targetLang: this.currentSettings.targetLanguage,
        voice: this.currentSettings.voice,
        gfMode: this.currentSettings.girlfriendMode !== undefined ? String(this.currentSettings.girlfriendMode) : 'true',
        gfPersona: this.currentSettings.gfPersona || 'sweet_caring',
        petName: this.currentSettings.petName || 'babe',
      });

      const wsUrl = `${protocol}//${window.location.host}/live?${params.toString()}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[LiveSession] Connected to backend voice bridge');
        this.startHeartbeat();
      };

      this.ws.onmessage = async (event) => {
        try {
          const payload: LiveMessagePayload = JSON.parse(event.data);
          await this.handleMessage(payload);
        } catch (err) {
          console.error('[LiveSession] Error parsing message:', err);
        }
      };

      this.ws.onerror = (event) => {
        console.warn('[LiveSession] WebSocket connection event:', (event as any)?.type || 'error');
      };

      this.ws.onclose = (event) => {
        console.log('[LiveSession] WebSocket closed:', event.code, event.reason);
        this.stopHeartbeat();
        this.audioPlayer.interrupt();
        this.audioStreamer.stop();

        this.setState('disconnected');

        if (!this.isExplicitDisconnect && event.code !== 1000) {
          if (!this.lastErrorDispatched) {
            this.callbacks.onError('Voice session paused. Tap to resume.');
          }
        }
      };
    } catch (err: any) {
      console.error('[LiveSession] Failed to start voice session:', err);
      this.audioStreamer.stop();
      this.setState('disconnected');
      this.callbacks.onError(err?.message || 'Could not access microphone or connect.');
    }
  }

  public updateLanguageSettings(settings: LanguageSettings): void {
    this.currentSettings = settings;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[LiveSession] Pushing updated language config to active live session:', settings);
      this.ws.send(
        JSON.stringify({
          type: 'update_config',
          config: settings,
        })
      );
    }
  }


  public stop(): void {
    this.isExplicitDisconnect = true;
    this.stopHeartbeat();
    this.audioPlayer.interrupt();
    this.audioStreamer.stop();

    if (this.ws) {
      try {
        this.ws.close(1000, 'User stopped session');
      } catch (e) {
        // ignore
      }
      this.ws = null;
    }

    this.setState('disconnected');
  }

  public setMute(muted: boolean): void {
    this.audioStreamer.setMute(muted);
  }

  public interrupt(): void {
    this.audioPlayer.interrupt();
    if (this.currentState === 'speaking') {
      this.setState('listening');
    }
  }

  public getState(): AssistantState {
    return this.currentState;
  }

  private setState(state: AssistantState) {
    this.currentState = state;
    this.callbacks.onStateChange(state);
  }

  private sendAudioChunk(base64Data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'audio',
          audio: base64Data,
          mimeType: 'audio/pcm;rate=16000',
        })
      );
    }
  }

  private async handleMessage(payload: LiveMessagePayload) {
    switch (payload.type) {
      case 'status':
        if (payload.status === 'ready') {
          this.setState('listening');
        } else if (payload.status === 'connecting') {
          this.setState('connecting');
        }
        break;

      case 'audio':
        if (payload.audio) {
          await this.audioPlayer.playChunk(payload.audio);
        }
        break;

      case 'interrupted':
        console.log('[LiveSession] Received interruption signal');
        this.audioPlayer.interrupt();
        this.setState('listening');
        break;

      case 'turn_complete':
        // Turn complete handled automatically by AudioPlayer when queue finishes
        break;

      case 'tool_call':
        if (payload.functionCalls && payload.functionCalls.length > 0) {
          console.log('[LiveSession] Executing tool calls:', payload.functionCalls);
          const functionResponses = await this.toolManager.executeCalls(payload.functionCalls);
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
              JSON.stringify({
                type: 'tool_response',
                functionResponses,
              })
            );
          }
        }
        break;

      case 'config_updated':
        console.log('[LiveSession] Server acknowledged config update:', payload.config);
        if (payload.config && this.callbacks.onConfigUpdated) {
          this.callbacks.onConfigUpdated(payload.config);
        }
        break;

      case 'error':
        console.error('[LiveSession] Server error message:', payload.error);
        this.lastErrorDispatched = true;
        this.callbacks.onError(payload.error || 'Server error');
        break;

      case 'session_closed':
        this.stop();
        break;
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 15000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}
