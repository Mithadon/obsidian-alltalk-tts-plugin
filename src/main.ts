import { Plugin } from 'obsidian';
import { generateSpeech, playSpeech, stopSpeech } from './xtts';
import { createReadButton, createStopButton } from './ui';
import { PluginSettings, loadSettings, saveSettings, displaySettings } from './settings';

export default class XTTSPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    console.log('Loading XTTS Plugin');
    this.settings = await loadSettings(this);

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

    this.addSettingTab(new XTTSPluginSettingTab(this.app, this));
  }

  async readHighlightedText() {
    const selectedText = this.app.workspace.activeLeaf.view.getSelection();
    if (selectedText) {
      const speech = await generateSpeech(selectedText);
      playSpeech(speech);
    }
  }

  async readWholePage() {
    const pageText = this.app.workspace.activeLeaf.view.data;
    if (pageText) {
      const speech = await generateSpeech(pageText);
      playSpeech(speech);
    }
  }

  stopSpeech() {
    stopSpeech();
  }

  onunload() {
    console.log('Unloading XTTS Plugin');
  }
}

class XTTSPluginSettingTab extends PluginSettingTab {
  plugin: XTTSPlugin;

  constructor(app: App, plugin: XTTSPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    displaySettings(this.plugin);
  }
}
