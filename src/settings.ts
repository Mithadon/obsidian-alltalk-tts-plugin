import { App, PluginSettingTab, Setting } from 'obsidian';

export interface PluginSettings {
  apiKey: string;
  voice: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  apiKey: '',
  voice: 'default'
};

export async function loadSettings(plugin: any): Promise<PluginSettings> {
  const data = await plugin.loadData();
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function saveSettings(plugin: any, settings: PluginSettings): Promise<void> {
  await plugin.saveData(settings);
}

export function displaySettings(plugin: any): void {
  const { containerEl } = plugin.settingTab;
  containerEl.empty();

  new Setting(containerEl)
    .setName('API Key')
    .setDesc('Enter your XTTS v2 API key')
    .addText(text => text
      .setPlaceholder('Enter your API key')
      .setValue(plugin.settings.apiKey)
      .onChange(async (value) => {
        plugin.settings.apiKey = value;
        await saveSettings(plugin, plugin.settings);
      }));

  new Setting(containerEl)
    .setName('Voice')
    .setDesc('Select the voice for text-to-speech')
    .addDropdown(dropdown => dropdown
      .addOption('default', 'Default')
      .addOption('voice1', 'Voice 1')
      .addOption('voice2', 'Voice 2')
      .setValue(plugin.settings.voice)
      .onChange(async (value) => {
        plugin.settings.voice = value;
        await saveSettings(plugin, plugin.settings);
      }));
}
