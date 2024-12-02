import { Notice } from 'obsidian';
import type { ServerInfo } from './types';
import { DebugUtils } from './debugUtils';
import { WavHandler } from './wavHandler';

export interface TTSRequestParams {
    text_input: string;
    text_filtering: string;
    character_voice_gen: string;
    rvccharacter_voice_gen: string;
    narrator_enabled: string;
    narrator_voice_gen: string;
    rvcnarrator_voice_gen: string;
    text_not_inside: string;
    only_narrate_quotes: string;
    language: string;
    output_file_name: string;
    output_file_timestamp: string;
    autoplay: string;
    deepSpeedEnabled?: boolean;
    lowVramEnabled?: boolean;
}

interface TTSResponse {
    output_file_url: string;
    [key: string]: any;
}

interface BatchResult {
    index: number;
    url: string;
}

export class ServerApi {
    private serverUrl: string;
    private batchUrls: BatchResult[] = [];

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
    }

    setServerUrl(url: string) {
        this.serverUrl = url;
    }

    getServerUrl(): string {
        return this.serverUrl;
    }

    private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    async checkServerStatus(): Promise<boolean> {
        try {
            // First check if server is reachable
            const response = await this.fetchWithTimeout(`${this.serverUrl}/api/ready`, {}, 2000);
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            
            const status = await response.text();
            if (status !== 'Ready') {
                throw new Error('Server not ready');
            }
            
            return true;
        } catch (error) {
            DebugUtils.error(`Server check failed: ${error.message}`);
            return false;
        }
    }

    async getServerInfo(): Promise<ServerInfo> {
        try {
            // First check if server is reachable
            const isReady = await this.checkServerStatus();
            if (!isReady) {
                throw new Error('Server is not ready');
            }

            // Then get the server settings
            const settingsResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/currentsettings`);
            if (!settingsResponse.ok) {
                throw new Error(`Failed to fetch server settings: ${settingsResponse.status}`);
            }
            const settings = await settingsResponse.json();

            // Then get the voices
            const voicesResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/voices`);
            if (!voicesResponse.ok) {
                throw new Error(`Failed to fetch voices: ${voicesResponse.status}`);
            }
            const voicesData = await voicesResponse.json();

            // Get RVC voices
            const rvcResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/rvcvoices`);
            if (!rvcResponse.ok) {
                throw new Error(`Failed to fetch RVC voices: ${rvcResponse.status}`);
            }
            const rvcData = await rvcResponse.json();

            // Combine all the data
            return {
                models_available: settings.models_available || [],
                voices: voicesData.voices || [],
                rvcvoices: rvcData.rvcvoices || [],
                current_model_loaded: settings.current_model_loaded || '',
                deepspeed_capable: settings.deepspeed_capable || false,
                deepspeed_available: settings.deepspeed_available || false,
                deepspeed_enabled: settings.deepspeed_enabled || false,
                lowvram_capable: settings.lowvram_capable || false,
                lowvram_enabled: settings.lowvram_enabled || false
            };
        } catch (error) {
            DebugUtils.error(`Failed to get server info: ${error.message}`);
            throw error;
        }
    }

    async switchModel(modelName: string): Promise<void> {
        try {
            const response = await this.fetchWithTimeout(
                `${this.serverUrl}/api/reload?tts_method=${encodeURIComponent(modelName)}`,
                { method: 'POST' }
            );
            
            if (!response.ok) {
                throw new Error(`Failed to switch model: ${response.status}`);
            }
            
            await response.json();
        } catch (error) {
            DebugUtils.error(`Failed to switch model: ${error.message}`);
            throw error;
        }
    }

    async generateSpeechBatch(params: TTSRequestParams, batchIndex: number): Promise<void> {
        DebugUtils.log(`Starting batch ${batchIndex + 1} generation`);

        // Set server settings if needed
        if (params.deepSpeedEnabled) {
            const dsResponse = await fetch(`${this.serverUrl}/api/deepspeed?new_deepspeed_value=True`, {
                method: 'POST'
            });
            if (!dsResponse.ok) {
                DebugUtils.error('Failed to enable DeepSpeed');
            }
        }

        if (params.lowVramEnabled) {
            const lvrResponse = await fetch(`${this.serverUrl}/api/lowvramsetting?new_low_vram_value=True`, {
                method: 'POST'
            });
            if (!lvrResponse.ok) {
                DebugUtils.error('Failed to enable Low VRAM mode');
            }
        }

        // Create API parameters without the non-API fields
        const apiParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (key !== 'deepSpeedEnabled' && key !== 'lowVramEnabled') {
                apiParams.append(key, value);
            }
        });

        // Generate speech
        const response = await fetch(`${this.serverUrl}/api/tts-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: apiParams
        });

        if (!response.ok) {
            throw new Error(`TTS generation failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Store the URL for this batch
        this.batchUrls.push({
            index: batchIndex,
            url: data.output_file_url
        });

        DebugUtils.log(`Batch ${batchIndex + 1} complete, URL stored`);
    }

    async downloadAndCombineAudio(): Promise<Blob> {
        try {
            DebugUtils.log(`Starting download of ${this.batchUrls.length} batches`);
            
            // Sort batches by index
            this.batchUrls.sort((a, b) => a.index - b.index);

            // Download all audio files
            const blobs: Blob[] = [];
            for (const batch of this.batchUrls) {
                DebugUtils.log(`Downloading batch ${batch.index + 1}`);
                const audioResponse = await fetch(`${this.serverUrl}${batch.url}`);
                if (!audioResponse.ok) {
                    throw new Error(`Failed to fetch audio for batch ${batch.index + 1}`);
                }
                const blob = await audioResponse.blob();
                blobs.push(blob);
                DebugUtils.log(`Batch ${batch.index + 1} downloaded`);
            }

            DebugUtils.log(`Combining ${blobs.length} audio files`);
            // Use WavHandler to properly combine WAV files
            const finalBlob = await WavHandler.combineWavBlobs(blobs);
            DebugUtils.log('Audio combination complete');

            return finalBlob;
        } finally {
            // Clear the batch URLs array
            this.batchUrls = [];
        }
    }

    async generateStreamingSpeech(text: string, voice: string, language: string): Promise<Blob> {
        const params = new URLSearchParams({
            'text': text,
            'voice': voice,
            'language': language,
            'output_file': 'stream_output.wav'
        });

        const response = await fetch(`${this.serverUrl}/api/tts-generate-streaming?${params}`);
        if (!response.ok) {
            throw new Error(`Streaming TTS failed: ${response.status}`);
        }

        return await response.blob();
    }
}
