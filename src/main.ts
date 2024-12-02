import { Plugin, MarkdownView, Menu, Notice, Editor, addIcon, setIcon, TFile } from 'obsidian';
import { XTTSSettingTab } from './settings-ui';
import { AllTalkService } from './xtts';
import { PluginSettings, DEFAULT_SETTINGS, LANGUAGES } from './types';
import { DebugUtils } from './debugUtils';

// Define the stop icon
const STOP_ICON = `<svg viewBox="0 0 100 100" width="20" height="20">
    <rect x="25" y="25" width="50" height="50" fill="currentColor"/>
</svg>`;

export default class XTTSPlugin extends Plugin {
    settings: PluginSettings;
    allTalk: AllTalkService;
    settingTab: XTTSSettingTab;
    stopButton: HTMLElement | null = null;
    availableVoices: string[] = [];
    availableRvcVoices: string[] = [];
    availableModels: string[] = [];
    isGenerating: boolean = false;
    LANGUAGES = LANGUAGES;
    serverStatus: string = 'Checking...';

    async onload() {
        // Register the stop icon
        addIcon('stop-circle', STOP_ICON);

        await this.loadSettings();
        
        // Initialize debug utils with settings
        DebugUtils.initialize(this.settings);
        
        this.allTalk = new AllTalkService(this.settings.serverUrl);

        // Add settings tab
        this.settingTab = new XTTSSettingTab(this.app, this);
        this.addSettingTab(this.settingTab);

        // Initial server check and voice loading
        await this.checkServerAndLoadVoices();

        // Add commands
        this.addCommand({
            id: 'read-highlighted-text',
            name: 'Read Highlighted Text',
            callback: () => this.readHighlightedText()
        });

        this.addCommand({
            id: 'read-whole-page',
            name: 'Read Whole Page',
            callback: () => this.readWholePage()
        });

        this.addCommand({
            id: 'stop-speech',
            name: 'Stop Speech',
            callback: () => this.stopSpeech()
        });

        // Add stop button to status bar
        this.addStopButton();

        // Register event handler for settings changes
        this.registerEvent(
            this.app.workspace.on('layout-change', async () => {
                if (this.settings.serverUrl !== this.allTalk.getServerUrl()) {
                    this.allTalk.setServerUrl(this.settings.serverUrl);
                    await this.checkServerAndLoadVoices();
                }
            })
        );

        // Add context menu items
        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor) => {
                const selection = editor.getSelection();
                if (selection) {
                    menu.addItem((item) => {
                        item
                            .setTitle('Read with AllTalk TTS')
                            .setIcon('audio-file')
                            .onClick(() => this.readText(selection));
                    });
                }
            })
        );

        // Add context menu for reading view
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu: Menu, file) => {
                menu.addItem((item) => {
                    item
                        .setTitle('Read with AllTalk TTS')
                        .setIcon('audio-file')
                        .onClick(() => this.readWholePage());
                });
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        // Update debug utils with new settings
        DebugUtils.initialize(this.settings);
    }

    async checkServerAndLoadVoices() {
        this.serverStatus = 'Checking...';
        this.settingTab.updateServerStatus(this.serverStatus);
        
        try {
            const serverInfo = await this.allTalk.getServerInfo();
            this.availableVoices = serverInfo.voices || [];
            this.availableRvcVoices = serverInfo.rvcvoices || [];
            this.availableModels = serverInfo.models_available.map(m => m.name);
            this.serverStatus = 'Ready';
        } catch (error) {
            DebugUtils.error('Failed to load voices');
            this.serverStatus = 'Offline';
        }
        this.settingTab.updateServerStatus(this.serverStatus);
    }

    async switchModel(modelName: string) {
        try {
            await this.allTalk.switchModel(modelName);
            new Notice('Model switched successfully');
        } catch (error) {
            DebugUtils.error('Failed to switch model');
            new Notice('Failed to switch model');
        }
    }

    private addStopButton() {
        // Add a button to Obsidian's status bar
        this.stopButton = this.addStatusBarItem();
        this.stopButton.addClass('mod-clickable');
        this.stopButton.addClass('alltalk-stop-button');
        setIcon(this.stopButton, 'stop-circle');
        this.stopButton.style.display = 'none';
        this.stopButton.addEventListener('click', () => this.stopSpeech());
    }

    private showStopButton(text: string = '') {
        if (this.stopButton) {
            this.stopButton.style.display = 'flex';
            this.stopButton.style.alignItems = 'center';
            this.stopButton.style.gap = '5px';
            this.stopButton.empty();
            setIcon(this.stopButton, 'stop-circle');
            if (text) {
                this.stopButton.createSpan({ text });
            }
        }
    }

    private hideStopButton() {
        if (this.stopButton) {
            this.stopButton.style.display = 'none';
        }
    }

    getSelectedText(): string | null {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) return null;

        if (activeView.getMode() === 'source') {
            // Edit mode
            return activeView.editor.getSelection();
        } else {
            // Reading mode
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return null;

            // Get the selected text from the preview view
            return selection.toString();
        }
    }

    async saveAudioFile(audioBlob: Blob, text: string, activeFile: TFile): Promise<string> {
        if (!this.settings.saveAudioFiles) return '';

        DebugUtils.log('Starting to save audio file');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const prefix = this.settings.audioFilePrefix || activeFile.basename;
        
        // Create audio folder in the same directory as the note
        const audioFolderName = this.settings.audioFolder || 'audio-alltalk';
        const notePath = activeFile.parent ? activeFile.parent.path : '/';
        const audioFolderPath = `${notePath}/${audioFolderName}`;
        
        // Ensure audio folder exists
        try {
            await this.app.vault.createFolder(audioFolderPath);
        } catch (error) {
            // Folder might already exist, which is fine
        }
        
        const filename = `${prefix}-${timestamp}.wav`;
        const filePath = `${audioFolderPath}/${filename}`;
        
        // Save the audio file
        DebugUtils.log(`Saving audio file (${Math.round(audioBlob.size / 1024)}KB)`);
        const arrayBuffer = await audioBlob.arrayBuffer();
        await this.app.vault.createBinary(filePath, arrayBuffer);
        DebugUtils.log('Audio file saved successfully');

        // Return the relative path from the note to the audio file
        return `${filename}`;
    }

    async embedAudioInNote(filePath: string, activeFile: TFile, selection?: string) {
        if (!this.settings.embedAfterGeneration) return;

        DebugUtils.log('Starting to embed audio');
        const content = await this.app.vault.read(activeFile);
        const audioEmbed = `\n![[${filePath}]]\n`;

        if (selection) {
            // If there's a selection, embed after the selection
            const editor = this.app.workspace.activeEditor?.editor;
            if (editor) {
                const cursor = editor.getCursor('to'); // Get the end of selection
                editor.replaceRange(audioEmbed, cursor);
                DebugUtils.log('Audio embedded after selection');
            }
        } else {
            // If no selection (whole page), add at the bottom with a separator
            const newContent = content + '\n---\n' + audioEmbed;
            await this.app.vault.modify(activeFile, newContent);
            DebugUtils.log('Audio embedded at end of note');
        }
    }

    async readText(text: string) {
        if (!text) {
            new Notice('No text selected');
            return;
        }

        if (this.isGenerating) {
            this.stopSpeech();
            return;
        }

        this.isGenerating = true;
        this.showStopButton('Preparing...');

        try {
            // Generate speech with progress updates
            const speech = await this.allTalk.generateSpeech(
                text, 
                this.settings,
                (current: number, total: number) => {
                    this.showStopButton(`Generating batch ${current}/${total}`);
                }
            );

            if (!speech) {
                this.hideStopButton();
                this.isGenerating = false;
                return;
            }

            // Save audio file if enabled
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile && this.settings.saveAudioFiles) {
                const filePath = await this.saveAudioFile(speech, text, activeFile);
                if (filePath) {
                    await this.embedAudioInNote(filePath, activeFile, text);
                }
            }

            // Play the audio if autoPlayback is enabled
            if (this.settings.autoPlayback) {
                this.showStopButton('Playing...');
                this.allTalk.playSpeech(speech, () => {
                    this.hideStopButton();
                    this.isGenerating = false;
                });
            } else {
                this.hideStopButton();
                this.isGenerating = false;
                new Notice('Audio file generated successfully');
            }
        } catch (error) {
            DebugUtils.error(`Error in readText: ${error.message}`);
            this.hideStopButton();
            this.isGenerating = false;
            new Notice('Failed to generate speech');
        }
    }

    async readHighlightedText() {
        const selectedText = this.getSelectedText();
        if (selectedText) {
            await this.readText(selectedText);
        } else {
            new Notice('No text selected');
        }
    }

    async readWholePage() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            new Notice('No active markdown view');
            return;
        }

        const content = activeView.getViewData();
        if (!content) {
            new Notice('No content in current view');
            return;
        }

        await this.readText(content);
    }

    stopSpeech() {
        this.allTalk.stopSpeech();
        this.hideStopButton();
        this.isGenerating = false;
    }

    onunload() {
        this.stopSpeech();
    }
}
