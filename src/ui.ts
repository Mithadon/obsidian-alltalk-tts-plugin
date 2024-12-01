import { App, PluginSettingTab, Setting } from 'obsidian';

export function createReadButton(app: App, plugin: any) {
  const button = document.createElement('button');
  button.textContent = 'Read Highlighted Text';
  button.addEventListener('click', () => {
    plugin.readHighlightedText();
  });
  document.body.appendChild(button);
}

export function createStopButton(app: App, plugin: any) {
  const button = document.createElement('button');
  button.textContent = 'Stop Speech';
  button.addEventListener('click', () => {
    plugin.stopSpeech();
  });
  document.body.appendChild(button);
}

export function createReadWholePageButton(app: App, plugin: any) {
  const button = document.createElement('button');
  button.textContent = 'Read Whole Page';
  button.addEventListener('click', () => {
    plugin.readWholePage();
  });
  document.body.appendChild(button);
}

export function addEventListeners(plugin: any) {
  document.addEventListener('selectionchange', () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      createReadButton(plugin.app, plugin);
    }
  });

  createStopButton(plugin.app, plugin);
  createReadWholePageButton(plugin.app, plugin);
}
