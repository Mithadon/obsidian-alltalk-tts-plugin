import { App, PluginSettingTab, Setting } from 'obsidian';
import type XTTSPlugin from './main';
import { LANGUAGES } from './types';

export class XTTSSettingTab extends PluginSettingTab {
    private plugin: XTTSPlugin;
    private statusEl: HTMLElement | null = null;

    constructor(app: App, plugin: XTTSPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        this.createServerSection();
        this.createVoiceSection();
        this.createRvcSection();
        this.createPlaybackSection();
        this.createAudioSavingSection();
        this.createAdvancedSection();
    }

    updateServerStatus(status: string): void {
        if (this.statusEl) {
            this.statusEl.setText(`Server Status: ${status}`);
            this.statusEl.setAttribute('data-status', status.toLowerCase());
        }
    }

    private createServerSection(): void {
        const { containerEl } = this;
        
        // Server Status
        const statusContainer = containerEl.createEl('div', { cls: 'alltalk-status-container' });
        this.statusEl = statusContainer.createEl('div', { 
            text: `Server Status: ${this.plugin.serverStatus}`,
            cls: 'alltalk-status'
        });
        this.statusEl.setAttribute('data-status', this.plugin.serverStatus.toLowerCase());

        containerEl.createEl('h3', { text: 'Server Settings' });

        new Setting(containerEl)
            .setName('Server URL')
            .setDesc('AllTalk TTS server URL')
            .addText(text => text
                .setPlaceholder('http://localhost:7851')
                .setValue(this.plugin.settings.serverUrl)
                .onChange(async (value) => {
                    this.plugin.settings.serverUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('DeepSpeed')
            .setDesc('Enable DeepSpeed acceleration')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.deepSpeedEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.deepSpeedEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Low VRAM Mode')
            .setDesc('Enable low VRAM mode for better compatibility with lower-end GPUs')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.lowVramEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.lowVramEnabled = value;
                    await this.plugin.saveSettings();
                }));
    }

    private createVoiceSection(): void {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: 'Voice Settings' });

        new Setting(containerEl)
            .setName('Voice')
            .setDesc('Select the voice for text-to-speech')
            .addDropdown(dropdown => {
                this.plugin.availableVoices.forEach(voice => dropdown.addOption(voice, voice));
                return dropdown
                    .setValue(this.plugin.settings.voice)
                    .onChange(async (value) => {
                        this.plugin.settings.voice = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Language')
            .setDesc('Select the language for text-to-speech')
            .addDropdown(dropdown => {
                Object.entries(LANGUAGES).forEach(([name, code]) => 
                    dropdown.addOption(code as string, name)
                );
                return dropdown
                    .setValue(this.plugin.settings.language)
                    .onChange(async (value) => {
                        this.plugin.settings.language = value;
                        await this.plugin.saveSettings();
                    });
            });
    }

    private createRvcSection(): void {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: 'RVC Settings' });

        new Setting(containerEl)
            .setName('Use RVC Voice')
            .setDesc('Enable RVC voice conversion')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useRvc)
                .onChange(async (value) => {
                    this.plugin.settings.useRvc = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.useRvc) {
            new Setting(containerEl)
                .setName('RVC Voice')
                .setDesc('Select the RVC voice for conversion')
                .addDropdown(dropdown => {
                    dropdown.addOption('Disabled', 'Disabled');
                    this.plugin.availableRvcVoices.forEach(voice => dropdown.addOption(voice, voice));
                    return dropdown
                        .setValue(this.plugin.settings.rvcVoice)
                        .onChange(async (value) => {
                            this.plugin.settings.rvcVoice = value;
                            await this.plugin.saveSettings();
                        });
                });
        }
    }

    private createPlaybackSection(): void {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: 'Playback Settings' });

        new Setting(containerEl)
            .setName('Auto Playback')
            .setDesc('Automatically play audio after generation')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoPlayback)
                .onChange(async (value) => {
                    this.plugin.settings.autoPlayback = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Playback Speed')
            .setDesc('Adjust the speed of audio playback (0.5x to 2.0x)')
            .addSlider(slider => slider
                .setLimits(0.5, 2.0, 0.1)
                .setValue(this.plugin.settings.playbackSpeed)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.playbackSpeed = value;
                    await this.plugin.saveSettings();
                }));
    }

    private createAudioSavingSection(): void {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: 'Audio Saving Settings' });

        new Setting(containerEl)
            .setName('Save Audio Files')
            .setDesc('Save generated audio files alongside notes')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.saveAudioFiles)
                .onChange(async (value) => {
                    this.plugin.settings.saveAudioFiles = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.saveAudioFiles) {
            new Setting(containerEl)
                .setName('Audio Folder')
                .setDesc('Folder name for audio files (relative to note location)')
                .addText(text => text
                    .setPlaceholder('audio')
                    .setValue(this.plugin.settings.audioFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.audioFolder = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Audio File Prefix')
                .setDesc('Optional prefix for audio files (leave empty to use note name)')
                .addText(text => text
                    .setPlaceholder('custom-prefix')
                    .setValue(this.plugin.settings.audioFilePrefix)
                    .onChange(async (value) => {
                        this.plugin.settings.audioFilePrefix = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Auto-embed Audio')
                .setDesc('Automatically embed generated audio in notes')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.embedAfterGeneration)
                    .onChange(async (value) => {
                        this.plugin.settings.embedAfterGeneration = value;
                        await this.plugin.saveSettings();
                    }));
        }
    }

    private createAdvancedSection(): void {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: 'Advanced Settings' });

        new Setting(containerEl)
            .setName('Maximum Chunk Size')
            .setDesc('Maximum number of sentences to process in each batch')
            .addSlider(slider => slider
                .setLimits(1, 20, 1)
                .setValue(this.plugin.settings.maxChunkSize)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxChunkSize = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Streaming Mode')
            .setDesc('Enable streaming mode for faster response (disables narrator features)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.streamingEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.streamingEnabled = value;
                    if (value) {
                        this.plugin.settings.narratorEnabled = false;
                    }
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (!this.plugin.settings.streamingEnabled) {
            this.createNarratorSettings();
        }

        this.createTextProcessingSettings();

        new Setting(containerEl)
            .setName('Debug Mode')
            .setDesc('Show detailed debug messages during generation')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.debugMode)
                .onChange(async (value) => {
                    this.plugin.settings.debugMode = value;
                    await this.plugin.saveSettings();
                }));
    }

    private createNarratorSettings(): void {
        const { containerEl } = this;
        new Setting(containerEl)
            .setName('Narrator Mode')
            .setDesc('Enable narrator for text outside quotes or asterisks')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.narratorEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.narratorEnabled = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.narratorEnabled) {
            new Setting(containerEl)
                .setName('Narrator Voice')
                .setDesc('Select the voice for narration')
                .addDropdown(dropdown => {
                    this.plugin.availableVoices.forEach(voice => dropdown.addOption(voice, voice));
                    return dropdown
                        .setValue(this.plugin.settings.narratorVoice)
                        .onChange(async (value) => {
                            this.plugin.settings.narratorVoice = value;
                            await this.plugin.saveSettings();
                        });
                });

            new Setting(containerEl)
                .setName('Narrator RVC Voice')
                .setDesc('Select the RVC voice for narrator')
                .addDropdown(dropdown => {
                    dropdown.addOption('Disabled', 'Disabled');
                    this.plugin.availableRvcVoices.forEach(voice => dropdown.addOption(voice, voice));
                    return dropdown
                        .setValue(this.plugin.settings.narratorRvcVoice)
                        .onChange(async (value) => {
                            this.plugin.settings.narratorRvcVoice = value;
                            await this.plugin.saveSettings();
                        });
                });

            new Setting(containerEl)
                .setName('Text Not Inside Quotes/Asterisks Is')
                .setDesc('How to handle text not inside quotes or asterisks')
                .addDropdown(dropdown => dropdown
                    .addOption('character', 'Character Voice')
                    .addOption('narrator', 'Narrator Voice')
                    .addOption('silent', 'Silent')
                    .setValue(this.plugin.settings.textNotInside)
                    .onChange(async (value: 'character' | 'narrator' | 'silent') => {
                        this.plugin.settings.textNotInside = value;
                        await this.plugin.saveSettings();
                    }));
        }
    }

    private createTextProcessingSettings(): void {
        const { containerEl } = this;
        new Setting(containerEl)
            .setName('Only Narrate Quotes')
            .setDesc('Only use narrator voice for quoted text')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.onlyNarrateQuotes)
                .onChange(async (value) => {
                    this.plugin.settings.onlyNarrateQuotes = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Ignore Asterisk Content')
            .setDesc('Ignore text between asterisks, including quotes')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.ignoreAsterisks)
                .onChange(async (value) => {
                    this.plugin.settings.ignoreAsterisks = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Skip Codeblocks')
            .setDesc('Skip text within code blocks')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.skipCodeblocks)
                .onChange(async (value) => {
                    this.plugin.settings.skipCodeblocks = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Skip Tagged Blocks')
            .setDesc('Skip text within <tagged> blocks')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.skipTaggedBlocks)
                .onChange(async (value) => {
                    this.plugin.settings.skipTaggedBlocks = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Pass Asterisks to TTS')
            .setDesc('Include asterisk characters in TTS input')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.passAsterisksToTTS)
                .onChange(async (value) => {
                    this.plugin.settings.passAsterisksToTTS = value;
                    await this.plugin.saveSettings();
                }));
    }
}
