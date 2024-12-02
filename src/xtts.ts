import { Notice } from 'obsidian';
import type { PluginSettings, ServerInfo } from './types';
import { AudioProcessor } from './audioProcessor';
import { ServerApi, TTSRequestParams } from './serverApi';
import { DebugUtils } from './debugUtils';

export type ProgressCallback = (current: number, total: number) => void;

export class AllTalkService {
    private serverApi: ServerApi;
    private audioElement: HTMLAudioElement | null = null;
    private playbackSpeed: number = 1.0;
    private generationCancelled: boolean = false;

    constructor(serverUrl: string) {
        this.serverApi = new ServerApi(serverUrl);
    }

    async checkServerStatus(): Promise<boolean> {
        return await this.serverApi.checkServerStatus();
    }

    async getServerInfo(): Promise<ServerInfo> {
        return await this.serverApi.getServerInfo();
    }

    async switchModel(modelName: string): Promise<void> {
        await this.serverApi.switchModel(modelName);
    }

    async generateSpeech(text: string, options: PluginSettings, onProgress?: ProgressCallback): Promise<Blob | null> {
        try {
            DebugUtils.log('Starting speech generation');
            if (!await this.checkServerStatus()) {
                return null;
            }

            const processedText = AudioProcessor.processText(text, {
                skipCodeblocks: options.skipCodeblocks,
                skipTaggedBlocks: options.skipTaggedBlocks,
                ignoreAsterisks: options.ignoreAsterisks,
                passAsterisksToTTS: options.passAsterisksToTTS
            });

            if (!processedText) {
                new Notice('No text to process after applying filters');
                return null;
            }

            if (options.streamingEnabled) {
                DebugUtils.log('Using streaming mode');
                return await this.serverApi.generateStreamingSpeech(
                    processedText,
                    options.voice,
                    options.language
                );
            }

            // Reset cancellation flag
            this.generationCancelled = false;

            // Split text into chunks (sentences)
            const sentences = processedText.split(/(?<=[.!?])\s+/);
            const totalBatches = Math.ceil(sentences.length / options.maxChunkSize);
            DebugUtils.log(`Processing ${totalBatches} batches`);

            // Process text in batches
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                if (this.generationCancelled) {
                    DebugUtils.log('Generation cancelled by user');
                    throw new Error('Generation cancelled by user');
                }

                onProgress?.(batchIndex + 1, totalBatches);

                // Get the sentences for this batch
                const start = batchIndex * options.maxChunkSize;
                const end = Math.min(start + options.maxChunkSize, sentences.length);
                const batchText = sentences.slice(start, end).join(' ');

                try {
                    const params: TTSRequestParams = {
                        text_input: batchText,
                        text_filtering: 'standard',
                        character_voice_gen: options.voice,
                        rvccharacter_voice_gen: options.useRvc ? options.rvcVoice : 'Disabled',
                        narrator_enabled: options.narratorEnabled.toString(),
                        narrator_voice_gen: options.narratorVoice,
                        rvcnarrator_voice_gen: options.narratorRvcVoice,
                        text_not_inside: options.textNotInside,
                        only_narrate_quotes: options.onlyNarrateQuotes.toString(),
                        language: options.language,
                        output_file_name: `batch_${batchIndex}`,
                        output_file_timestamp: 'true',
                        autoplay: 'false',
                        deepSpeedEnabled: options.deepSpeedEnabled,
                        lowVramEnabled: options.lowVramEnabled
                    };

                    // Generate speech for this batch
                    await this.serverApi.generateSpeechBatch(params, batchIndex);

                } catch (error) {
                    DebugUtils.error(`Failed to generate batch ${batchIndex + 1}`);
                    throw error;
                }
            }

            // After all batches are generated, download and combine them
            DebugUtils.log('All batches generated, combining audio');
            const finalBlob = await this.serverApi.downloadAndCombineAudio();
            DebugUtils.log('Audio combination complete');
            return finalBlob;

        } catch (error) {
            DebugUtils.error(`Error: ${error.message}`);
            if (!this.generationCancelled) {
                new Notice('Failed to generate speech. Check debug messages for details.');
            }
            return null;
        }
    }

    playSpeech(audioBlob: Blob, onComplete?: () => void) {
        if (this.audioElement) {
            this.audioElement.pause();
            URL.revokeObjectURL(this.audioElement.src);
            this.audioElement = null;
        }

        const url = URL.createObjectURL(audioBlob);
        this.audioElement = new Audio(url);
        
        // Set playback speed
        this.audioElement.playbackRate = this.playbackSpeed;
        
        this.audioElement.onended = () => {
            if (this.audioElement) {
                URL.revokeObjectURL(url);
                this.audioElement = null;
            }
            onComplete?.();
        };

        this.audioElement.onerror = (error) => {
            new Notice('Failed to play audio');
            if (this.audioElement) {
                URL.revokeObjectURL(url);
                this.audioElement = null;
            }
            onComplete?.();
        };

        this.audioElement.play().catch(error => {
            new Notice('Failed to start audio playback');
            onComplete?.();
        });
    }

    stopSpeech() {
        this.generationCancelled = true;
        if (this.audioElement) {
            this.audioElement.pause();
            URL.revokeObjectURL(this.audioElement.src);
            this.audioElement = null;
        }
    }

    setServerUrl(url: string) {
        this.serverApi.setServerUrl(url);
    }

    getServerUrl(): string {
        return this.serverApi.getServerUrl();
    }

    setPlaybackSpeed(speed: number) {
        this.playbackSpeed = speed;
        if (this.audioElement) {
            this.audioElement.playbackRate = speed;
        }
    }
}
