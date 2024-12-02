/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
If you want to view the source, visit the plugin's github repository
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/main.ts
__export(exports, {
  default: () => XTTSPlugin
});
var import_obsidian4 = __toModule(require("obsidian"));

// src/settings-ui.ts
var import_obsidian = __toModule(require("obsidian"));

// src/types.ts
var DEFAULT_SETTINGS = {
  serverUrl: "http://localhost:7851",
  voice: "default",
  language: "en",
  rvcVoice: "Disabled",
  useRvc: false,
  deepSpeedEnabled: false,
  lowVramEnabled: false,
  currentModel: "",
  streamingEnabled: false,
  narratorEnabled: false,
  narratorVoice: "default",
  narratorRvcVoice: "Disabled",
  textNotInside: "character",
  onlyNarrateQuotes: false,
  ignoreAsterisks: false,
  skipCodeblocks: true,
  skipTaggedBlocks: true,
  passAsterisksToTTS: false,
  maxChunkSize: 10,
  playbackSpeed: 1,
  autoPlayback: true,
  saveAudioFiles: false,
  audioFilePrefix: "",
  embedAfterGeneration: true,
  audioFolder: "audio",
  debugMode: false
};
var LANGUAGES = {
  "English": "en",
  "French": "fr",
  "German": "de",
  "Italian": "it",
  "Spanish": "es",
  "Portuguese": "pt",
  "Hindi": "hi",
  "Chinese": "zh",
  "Japanese": "ja",
  "Korean": "ko"
};

// src/settings-ui.ts
var XTTSSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.statusEl = null;
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.createServerSection();
    this.createVoiceSection();
    this.createRvcSection();
    this.createPlaybackSection();
    this.createAudioSavingSection();
    this.createAdvancedSection();
  }
  updateServerStatus(status) {
    if (this.statusEl) {
      this.statusEl.setText(`Server Status: ${status}`);
      this.statusEl.setAttribute("data-status", status.toLowerCase());
    }
  }
  createServerSection() {
    const { containerEl } = this;
    const statusContainer = containerEl.createEl("div", { cls: "alltalk-status-container" });
    this.statusEl = statusContainer.createEl("div", {
      text: `Server Status: ${this.plugin.serverStatus}`,
      cls: "alltalk-status"
    });
    this.statusEl.setAttribute("data-status", this.plugin.serverStatus.toLowerCase());
    containerEl.createEl("h3", { text: "Server Settings" });
    new import_obsidian.Setting(containerEl).setName("Server URL").setDesc("AllTalk TTS server URL").addText((text) => text.setPlaceholder("http://localhost:7851").setValue(this.plugin.settings.serverUrl).onChange(async (value) => {
      this.plugin.settings.serverUrl = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("DeepSpeed").setDesc("Enable DeepSpeed acceleration").addToggle((toggle) => toggle.setValue(this.plugin.settings.deepSpeedEnabled).onChange(async (value) => {
      this.plugin.settings.deepSpeedEnabled = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Low VRAM Mode").setDesc("Enable low VRAM mode for better compatibility with lower-end GPUs").addToggle((toggle) => toggle.setValue(this.plugin.settings.lowVramEnabled).onChange(async (value) => {
      this.plugin.settings.lowVramEnabled = value;
      await this.plugin.saveSettings();
    }));
  }
  createVoiceSection() {
    const { containerEl } = this;
    containerEl.createEl("h3", { text: "Voice Settings" });
    new import_obsidian.Setting(containerEl).setName("Voice").setDesc("Select the voice for text-to-speech").addDropdown((dropdown) => {
      this.plugin.availableVoices.forEach((voice) => dropdown.addOption(voice, voice));
      return dropdown.setValue(this.plugin.settings.voice).onChange(async (value) => {
        this.plugin.settings.voice = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Language").setDesc("Select the language for text-to-speech").addDropdown((dropdown) => {
      Object.entries(LANGUAGES).forEach(([name, code]) => dropdown.addOption(code, name));
      return dropdown.setValue(this.plugin.settings.language).onChange(async (value) => {
        this.plugin.settings.language = value;
        await this.plugin.saveSettings();
      });
    });
  }
  createRvcSection() {
    const { containerEl } = this;
    containerEl.createEl("h3", { text: "RVC Settings" });
    new import_obsidian.Setting(containerEl).setName("Use RVC Voice").setDesc("Enable RVC voice conversion").addToggle((toggle) => toggle.setValue(this.plugin.settings.useRvc).onChange(async (value) => {
      this.plugin.settings.useRvc = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.useRvc) {
      new import_obsidian.Setting(containerEl).setName("RVC Voice").setDesc("Select the RVC voice for conversion").addDropdown((dropdown) => {
        dropdown.addOption("Disabled", "Disabled");
        this.plugin.availableRvcVoices.forEach((voice) => dropdown.addOption(voice, voice));
        return dropdown.setValue(this.plugin.settings.rvcVoice).onChange(async (value) => {
          this.plugin.settings.rvcVoice = value;
          await this.plugin.saveSettings();
        });
      });
    }
  }
  createPlaybackSection() {
    const { containerEl } = this;
    containerEl.createEl("h3", { text: "Playback Settings" });
    new import_obsidian.Setting(containerEl).setName("Auto Playback").setDesc("Automatically play audio after generation").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoPlayback).onChange(async (value) => {
      this.plugin.settings.autoPlayback = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Playback Speed").setDesc("Adjust the speed of audio playback (0.5x to 2.0x)").addSlider((slider) => slider.setLimits(0.5, 2, 0.1).setValue(this.plugin.settings.playbackSpeed).setDynamicTooltip().onChange(async (value) => {
      this.plugin.settings.playbackSpeed = value;
      await this.plugin.saveSettings();
    }));
  }
  createAudioSavingSection() {
    const { containerEl } = this;
    containerEl.createEl("h3", { text: "Audio Saving Settings" });
    new import_obsidian.Setting(containerEl).setName("Save Audio Files").setDesc("Save generated audio files alongside notes").addToggle((toggle) => toggle.setValue(this.plugin.settings.saveAudioFiles).onChange(async (value) => {
      this.plugin.settings.saveAudioFiles = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.saveAudioFiles) {
      new import_obsidian.Setting(containerEl).setName("Audio Folder").setDesc("Folder name for audio files (relative to note location)").addText((text) => text.setPlaceholder("audio").setValue(this.plugin.settings.audioFolder).onChange(async (value) => {
        this.plugin.settings.audioFolder = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("Audio File Prefix").setDesc("Optional prefix for audio files (leave empty to use note name)").addText((text) => text.setPlaceholder("custom-prefix").setValue(this.plugin.settings.audioFilePrefix).onChange(async (value) => {
        this.plugin.settings.audioFilePrefix = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("Auto-embed Audio").setDesc("Automatically embed generated audio in notes").addToggle((toggle) => toggle.setValue(this.plugin.settings.embedAfterGeneration).onChange(async (value) => {
        this.plugin.settings.embedAfterGeneration = value;
        await this.plugin.saveSettings();
      }));
    }
  }
  createAdvancedSection() {
    const { containerEl } = this;
    containerEl.createEl("h3", { text: "Advanced Settings" });
    new import_obsidian.Setting(containerEl).setName("Maximum Chunk Size").setDesc("Maximum number of sentences to process in each batch").addSlider((slider) => slider.setLimits(1, 20, 1).setValue(this.plugin.settings.maxChunkSize).setDynamicTooltip().onChange(async (value) => {
      this.plugin.settings.maxChunkSize = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Streaming Mode").setDesc("Enable streaming mode for faster response (disables narrator features)").addToggle((toggle) => toggle.setValue(this.plugin.settings.streamingEnabled).onChange(async (value) => {
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
    new import_obsidian.Setting(containerEl).setName("Debug Mode").setDesc("Show detailed debug messages during generation").addToggle((toggle) => toggle.setValue(this.plugin.settings.debugMode).onChange(async (value) => {
      this.plugin.settings.debugMode = value;
      await this.plugin.saveSettings();
    }));
  }
  createNarratorSettings() {
    const { containerEl } = this;
    new import_obsidian.Setting(containerEl).setName("Narrator Mode").setDesc("Enable narrator for text outside quotes or asterisks").addToggle((toggle) => toggle.setValue(this.plugin.settings.narratorEnabled).onChange(async (value) => {
      this.plugin.settings.narratorEnabled = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.narratorEnabled) {
      new import_obsidian.Setting(containerEl).setName("Narrator Voice").setDesc("Select the voice for narration").addDropdown((dropdown) => {
        this.plugin.availableVoices.forEach((voice) => dropdown.addOption(voice, voice));
        return dropdown.setValue(this.plugin.settings.narratorVoice).onChange(async (value) => {
          this.plugin.settings.narratorVoice = value;
          await this.plugin.saveSettings();
        });
      });
      new import_obsidian.Setting(containerEl).setName("Narrator RVC Voice").setDesc("Select the RVC voice for narrator").addDropdown((dropdown) => {
        dropdown.addOption("Disabled", "Disabled");
        this.plugin.availableRvcVoices.forEach((voice) => dropdown.addOption(voice, voice));
        return dropdown.setValue(this.plugin.settings.narratorRvcVoice).onChange(async (value) => {
          this.plugin.settings.narratorRvcVoice = value;
          await this.plugin.saveSettings();
        });
      });
      new import_obsidian.Setting(containerEl).setName("Text Not Inside Quotes/Asterisks Is").setDesc("How to handle text not inside quotes or asterisks").addDropdown((dropdown) => dropdown.addOption("character", "Character Voice").addOption("narrator", "Narrator Voice").addOption("silent", "Silent").setValue(this.plugin.settings.textNotInside).onChange(async (value) => {
        this.plugin.settings.textNotInside = value;
        await this.plugin.saveSettings();
      }));
    }
  }
  createTextProcessingSettings() {
    const { containerEl } = this;
    new import_obsidian.Setting(containerEl).setName("Only Narrate Quotes").setDesc("Only use narrator voice for quoted text").addToggle((toggle) => toggle.setValue(this.plugin.settings.onlyNarrateQuotes).onChange(async (value) => {
      this.plugin.settings.onlyNarrateQuotes = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Ignore Asterisk Content").setDesc("Ignore text between asterisks, including quotes").addToggle((toggle) => toggle.setValue(this.plugin.settings.ignoreAsterisks).onChange(async (value) => {
      this.plugin.settings.ignoreAsterisks = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Skip Codeblocks").setDesc("Skip text within code blocks").addToggle((toggle) => toggle.setValue(this.plugin.settings.skipCodeblocks).onChange(async (value) => {
      this.plugin.settings.skipCodeblocks = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Skip Tagged Blocks").setDesc("Skip text within <tagged> blocks").addToggle((toggle) => toggle.setValue(this.plugin.settings.skipTaggedBlocks).onChange(async (value) => {
      this.plugin.settings.skipTaggedBlocks = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Pass Asterisks to TTS").setDesc("Include asterisk characters in TTS input").addToggle((toggle) => toggle.setValue(this.plugin.settings.passAsterisksToTTS).onChange(async (value) => {
      this.plugin.settings.passAsterisksToTTS = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/xtts.ts
var import_obsidian3 = __toModule(require("obsidian"));

// src/audioProcessor.ts
var AudioProcessor = class {
  static splitTextIntoChunks(text, maxChunks) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = "";
    let currentChunkSentences = 0;
    for (const sentence of sentences) {
      if (currentChunkSentences >= maxChunks) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
        currentChunkSentences = 0;
      }
      currentChunk += sentence + " ";
      currentChunkSentences++;
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  }
  static processText(text, options) {
    let processedText = text;
    if (options.skipCodeblocks) {
      processedText = processedText.replace(/```[\s\S]*?```/g, "");
      processedText = processedText.replace(/`[^`]*`/g, "");
    }
    if (options.skipTaggedBlocks) {
      processedText = processedText.replace(/<[^>]*>/g, "");
    }
    if (options.ignoreAsterisks) {
      processedText = processedText.replace(/\*[^*]*\*/g, "");
    } else if (!options.passAsterisksToTTS) {
      processedText = processedText.replace(/\*(.*?)\*/g, "$1");
    }
    processedText = processedText.replace(/\s+/g, " ").trim();
    return processedText;
  }
  static combineAudioChunks(chunks) {
    if (chunks.length === 0)
      return null;
    chunks.sort((a, b) => a.index - b.index);
    return new Blob(chunks.map((chunk) => chunk.data), { type: "audio/wav" });
  }
  static validateChunks(results, expectedCount) {
    if (results.length !== expectedCount)
      return false;
    const indices = results.map((r) => r.index).sort((a, b) => a - b);
    for (let i = 0; i < indices.length; i++) {
      if (indices[i] !== i)
        return false;
    }
    return true;
  }
};

// src/debugUtils.ts
var import_obsidian2 = __toModule(require("obsidian"));
var DebugUtils = class {
  static initialize(settings) {
    this.settings = settings;
  }
  static log(message) {
    var _a;
    if ((_a = this.settings) == null ? void 0 : _a.debugMode) {
      new import_obsidian2.Notice(`[DEBUG] ${message}`);
      console.log(`[DEBUG] ${message}`);
    }
  }
  static error(message) {
    var _a;
    if ((_a = this.settings) == null ? void 0 : _a.debugMode) {
      console.error(`[DEBUG] ${message}`);
    } else {
      new import_obsidian2.Notice(message);
    }
  }
};
DebugUtils.settings = null;

// src/wavHandler.ts
var WavHandler = class {
  static readInt32LE(buffer, offset) {
    const view = new DataView(buffer);
    return view.getInt32(offset, true);
  }
  static readInt16LE(buffer, offset) {
    const view = new DataView(buffer);
    return view.getInt16(offset, true);
  }
  static writeInt32LE(value) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setInt32(0, value, true);
    return new Uint8Array(buffer);
  }
  static writeInt16LE(value) {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setInt16(0, value, true);
    return new Uint8Array(buffer);
  }
  static async combineWavBlobs(blobs) {
    const buffers = await Promise.all(blobs.map((blob) => blob.arrayBuffer()));
    let format = null;
    let sampleRate = null;
    let channels = null;
    let bitsPerSample = null;
    const audioDataChunks = [];
    let totalAudioLength = 0;
    for (const buffer of buffers) {
      const header2 = new Uint8Array(buffer, 0, 4);
      if (new TextDecoder().decode(header2) !== "RIFF") {
        throw new Error("Invalid WAV file: Missing RIFF header");
      }
      const format_marker = new Uint8Array(buffer, 8, 4);
      if (new TextDecoder().decode(format_marker) !== "WAVE") {
        throw new Error("Invalid WAV file: Not in WAVE format");
      }
      let offset = 12;
      while (offset < buffer.byteLength) {
        const chunkId = new TextDecoder().decode(new Uint8Array(buffer, offset, 4));
        const chunkSize = WavHandler.readInt32LE(buffer, offset + 4);
        if (chunkId === "fmt ") {
          const currentFormat = WavHandler.readInt16LE(buffer, offset + 8);
          const currentChannels = WavHandler.readInt16LE(buffer, offset + 10);
          const currentSampleRate = WavHandler.readInt32LE(buffer, offset + 12);
          const currentBitsPerSample = WavHandler.readInt16LE(buffer, offset + 22);
          if (format === null) {
            format = currentFormat;
            channels = currentChannels;
            sampleRate = currentSampleRate;
            bitsPerSample = currentBitsPerSample;
          } else if (format !== currentFormat || channels !== currentChannels || sampleRate !== currentSampleRate || bitsPerSample !== currentBitsPerSample) {
            throw new Error("WAV files have different formats");
          }
        } else if (chunkId === "data") {
          const audioData = new Uint8Array(buffer, offset + 8, chunkSize);
          audioDataChunks.push(audioData);
          totalAudioLength += chunkSize;
        }
        offset += 8 + chunkSize;
        if (offset % 2 !== 0)
          offset++;
      }
    }
    const headerLength = 44;
    const totalLength = headerLength + totalAudioLength;
    const finalBuffer = new ArrayBuffer(totalLength);
    const finalView = new Uint8Array(finalBuffer);
    const header = new TextEncoder().encode("RIFF");
    finalView.set(header, 0);
    finalView.set(WavHandler.writeInt32LE(totalLength - 8), 4);
    finalView.set(new TextEncoder().encode("WAVE"), 8);
    finalView.set(new TextEncoder().encode("fmt "), 12);
    finalView.set(WavHandler.writeInt32LE(16), 16);
    finalView.set(WavHandler.writeInt16LE(format), 20);
    finalView.set(WavHandler.writeInt16LE(channels), 22);
    finalView.set(WavHandler.writeInt32LE(sampleRate), 24);
    finalView.set(WavHandler.writeInt32LE(sampleRate * channels * (bitsPerSample / 8)), 28);
    finalView.set(WavHandler.writeInt16LE(channels * (bitsPerSample / 8)), 32);
    finalView.set(WavHandler.writeInt16LE(bitsPerSample), 34);
    finalView.set(new TextEncoder().encode("data"), 36);
    finalView.set(WavHandler.writeInt32LE(totalAudioLength), 40);
    let dataOffset = 44;
    for (const chunk of audioDataChunks) {
      finalView.set(chunk, dataOffset);
      dataOffset += chunk.length;
    }
    return new Blob([finalBuffer], { type: "audio/wav" });
  }
};

// src/serverApi.ts
var ServerApi = class {
  constructor(serverUrl) {
    this.batchUrls = [];
    this.serverUrl = serverUrl;
  }
  setServerUrl(url) {
    this.serverUrl = url;
  }
  getServerUrl() {
    return this.serverUrl;
  }
  async fetchWithTimeout(url, options = {}, timeout = 5e3) {
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
  async checkServerStatus() {
    try {
      const response = await this.fetchWithTimeout(`${this.serverUrl}/api/ready`, {}, 2e3);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const status = await response.text();
      if (status !== "Ready") {
        throw new Error("Server not ready");
      }
      return true;
    } catch (error) {
      DebugUtils.error(`Server check failed: ${error.message}`);
      return false;
    }
  }
  async getServerInfo() {
    try {
      const isReady = await this.checkServerStatus();
      if (!isReady) {
        throw new Error("Server is not ready");
      }
      const settingsResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/currentsettings`);
      if (!settingsResponse.ok) {
        throw new Error(`Failed to fetch server settings: ${settingsResponse.status}`);
      }
      const settings = await settingsResponse.json();
      const voicesResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/voices`);
      if (!voicesResponse.ok) {
        throw new Error(`Failed to fetch voices: ${voicesResponse.status}`);
      }
      const voicesData = await voicesResponse.json();
      const rvcResponse = await this.fetchWithTimeout(`${this.serverUrl}/api/rvcvoices`);
      if (!rvcResponse.ok) {
        throw new Error(`Failed to fetch RVC voices: ${rvcResponse.status}`);
      }
      const rvcData = await rvcResponse.json();
      return {
        models_available: settings.models_available || [],
        voices: voicesData.voices || [],
        rvcvoices: rvcData.rvcvoices || [],
        current_model_loaded: settings.current_model_loaded || "",
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
  async switchModel(modelName) {
    try {
      const response = await this.fetchWithTimeout(`${this.serverUrl}/api/reload?tts_method=${encodeURIComponent(modelName)}`, { method: "POST" });
      if (!response.ok) {
        throw new Error(`Failed to switch model: ${response.status}`);
      }
      await response.json();
    } catch (error) {
      DebugUtils.error(`Failed to switch model: ${error.message}`);
      throw error;
    }
  }
  async generateSpeechBatch(params, batchIndex) {
    DebugUtils.log(`Starting batch ${batchIndex + 1} generation`);
    if (params.deepSpeedEnabled) {
      const dsResponse = await fetch(`${this.serverUrl}/api/deepspeed?new_deepspeed_value=True`, {
        method: "POST"
      });
      if (!dsResponse.ok) {
        DebugUtils.error("Failed to enable DeepSpeed");
      }
    }
    if (params.lowVramEnabled) {
      const lvrResponse = await fetch(`${this.serverUrl}/api/lowvramsetting?new_low_vram_value=True`, {
        method: "POST"
      });
      if (!lvrResponse.ok) {
        DebugUtils.error("Failed to enable Low VRAM mode");
      }
    }
    const apiParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "deepSpeedEnabled" && key !== "lowVramEnabled") {
        apiParams.append(key, value);
      }
    });
    const response = await fetch(`${this.serverUrl}/api/tts-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: apiParams
    });
    if (!response.ok) {
      throw new Error(`TTS generation failed: ${response.status}`);
    }
    const data = await response.json();
    this.batchUrls.push({
      index: batchIndex,
      url: data.output_file_url
    });
    DebugUtils.log(`Batch ${batchIndex + 1} complete, URL stored`);
  }
  async downloadAndCombineAudio() {
    try {
      DebugUtils.log(`Starting download of ${this.batchUrls.length} batches`);
      this.batchUrls.sort((a, b) => a.index - b.index);
      const blobs = [];
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
      const finalBlob = await WavHandler.combineWavBlobs(blobs);
      DebugUtils.log("Audio combination complete");
      return finalBlob;
    } finally {
      this.batchUrls = [];
    }
  }
  async generateStreamingSpeech(text, voice, language) {
    const params = new URLSearchParams({
      "text": text,
      "voice": voice,
      "language": language,
      "output_file": "stream_output.wav"
    });
    const response = await fetch(`${this.serverUrl}/api/tts-generate-streaming?${params}`);
    if (!response.ok) {
      throw new Error(`Streaming TTS failed: ${response.status}`);
    }
    return await response.blob();
  }
};

// src/xtts.ts
var AllTalkService = class {
  constructor(serverUrl) {
    this.audioElement = null;
    this.playbackSpeed = 1;
    this.generationCancelled = false;
    this.serverApi = new ServerApi(serverUrl);
  }
  async checkServerStatus() {
    return await this.serverApi.checkServerStatus();
  }
  async getServerInfo() {
    return await this.serverApi.getServerInfo();
  }
  async switchModel(modelName) {
    await this.serverApi.switchModel(modelName);
  }
  async generateSpeech(text, options, onProgress) {
    try {
      DebugUtils.log("Starting speech generation");
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
        new import_obsidian3.Notice("No text to process after applying filters");
        return null;
      }
      if (options.streamingEnabled) {
        DebugUtils.log("Using streaming mode");
        return await this.serverApi.generateStreamingSpeech(processedText, options.voice, options.language);
      }
      this.generationCancelled = false;
      const sentences = processedText.split(/(?<=[.!?])\s+/);
      const totalBatches = Math.ceil(sentences.length / options.maxChunkSize);
      DebugUtils.log(`Processing ${totalBatches} batches`);
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        if (this.generationCancelled) {
          DebugUtils.log("Generation cancelled by user");
          throw new Error("Generation cancelled by user");
        }
        onProgress == null ? void 0 : onProgress(batchIndex + 1, totalBatches);
        const start = batchIndex * options.maxChunkSize;
        const end = Math.min(start + options.maxChunkSize, sentences.length);
        const batchText = sentences.slice(start, end).join(" ");
        try {
          const params = {
            text_input: batchText,
            text_filtering: "standard",
            character_voice_gen: options.voice,
            rvccharacter_voice_gen: options.useRvc ? options.rvcVoice : "Disabled",
            narrator_enabled: options.narratorEnabled.toString(),
            narrator_voice_gen: options.narratorVoice,
            rvcnarrator_voice_gen: options.narratorRvcVoice,
            text_not_inside: options.textNotInside,
            only_narrate_quotes: options.onlyNarrateQuotes.toString(),
            language: options.language,
            output_file_name: `batch_${batchIndex}`,
            output_file_timestamp: "true",
            autoplay: "false",
            deepSpeedEnabled: options.deepSpeedEnabled,
            lowVramEnabled: options.lowVramEnabled
          };
          await this.serverApi.generateSpeechBatch(params, batchIndex);
        } catch (error) {
          DebugUtils.error(`Failed to generate batch ${batchIndex + 1}`);
          throw error;
        }
      }
      DebugUtils.log("All batches generated, combining audio");
      const finalBlob = await this.serverApi.downloadAndCombineAudio();
      DebugUtils.log("Audio combination complete");
      return finalBlob;
    } catch (error) {
      DebugUtils.error(`Error: ${error.message}`);
      if (!this.generationCancelled) {
        new import_obsidian3.Notice("Failed to generate speech. Check debug messages for details.");
      }
      return null;
    }
  }
  playSpeech(audioBlob, onComplete) {
    if (this.audioElement) {
      this.audioElement.pause();
      URL.revokeObjectURL(this.audioElement.src);
      this.audioElement = null;
    }
    const url = URL.createObjectURL(audioBlob);
    this.audioElement = new Audio(url);
    this.audioElement.playbackRate = this.playbackSpeed;
    this.audioElement.onended = () => {
      if (this.audioElement) {
        URL.revokeObjectURL(url);
        this.audioElement = null;
      }
      onComplete == null ? void 0 : onComplete();
    };
    this.audioElement.onerror = (error) => {
      new import_obsidian3.Notice("Failed to play audio");
      if (this.audioElement) {
        URL.revokeObjectURL(url);
        this.audioElement = null;
      }
      onComplete == null ? void 0 : onComplete();
    };
    this.audioElement.play().catch((error) => {
      new import_obsidian3.Notice("Failed to start audio playback");
      onComplete == null ? void 0 : onComplete();
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
  setServerUrl(url) {
    this.serverApi.setServerUrl(url);
  }
  getServerUrl() {
    return this.serverApi.getServerUrl();
  }
  setPlaybackSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }
};

// src/main.ts
var STOP_ICON = `<svg viewBox="0 0 100 100" width="20" height="20">
    <rect x="25" y="25" width="50" height="50" fill="currentColor"/>
</svg>`;
var XTTSPlugin = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.stopButton = null;
    this.availableVoices = [];
    this.availableRvcVoices = [];
    this.availableModels = [];
    this.isGenerating = false;
    this.LANGUAGES = LANGUAGES;
    this.serverStatus = "Checking...";
  }
  async onload() {
    (0, import_obsidian4.addIcon)("stop-circle", STOP_ICON);
    await this.loadSettings();
    DebugUtils.initialize(this.settings);
    this.allTalk = new AllTalkService(this.settings.serverUrl);
    this.settingTab = new XTTSSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);
    await this.checkServerAndLoadVoices();
    this.addCommand({
      id: "read-highlighted-text",
      name: "Read Highlighted Text",
      callback: () => this.readHighlightedText()
    });
    this.addCommand({
      id: "read-whole-page",
      name: "Read Whole Page",
      callback: () => this.readWholePage()
    });
    this.addCommand({
      id: "stop-speech",
      name: "Stop Speech",
      callback: () => this.stopSpeech()
    });
    this.addStopButton();
    this.registerEvent(this.app.workspace.on("layout-change", async () => {
      if (this.settings.serverUrl !== this.allTalk.getServerUrl()) {
        this.allTalk.setServerUrl(this.settings.serverUrl);
        await this.checkServerAndLoadVoices();
      }
    }));
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
      const selection = editor.getSelection();
      if (selection) {
        menu.addItem((item) => {
          item.setTitle("Read with AllTalk TTS").setIcon("audio-file").onClick(() => this.readText(selection));
        });
      }
    }));
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      menu.addItem((item) => {
        item.setTitle("Read with AllTalk TTS").setIcon("audio-file").onClick(() => this.readWholePage());
      });
    }));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    DebugUtils.initialize(this.settings);
  }
  async checkServerAndLoadVoices() {
    this.serverStatus = "Checking...";
    this.settingTab.updateServerStatus(this.serverStatus);
    try {
      const serverInfo = await this.allTalk.getServerInfo();
      this.availableVoices = serverInfo.voices || [];
      this.availableRvcVoices = serverInfo.rvcvoices || [];
      this.availableModels = serverInfo.models_available.map((m) => m.name);
      this.serverStatus = "Ready";
    } catch (error) {
      DebugUtils.error("Failed to load voices");
      this.serverStatus = "Offline";
    }
    this.settingTab.updateServerStatus(this.serverStatus);
  }
  async switchModel(modelName) {
    try {
      await this.allTalk.switchModel(modelName);
      new import_obsidian4.Notice("Model switched successfully");
    } catch (error) {
      DebugUtils.error("Failed to switch model");
      new import_obsidian4.Notice("Failed to switch model");
    }
  }
  addStopButton() {
    this.stopButton = this.addStatusBarItem();
    this.stopButton.addClass("mod-clickable");
    this.stopButton.addClass("alltalk-stop-button");
    (0, import_obsidian4.setIcon)(this.stopButton, "stop-circle");
    this.stopButton.style.display = "none";
    this.stopButton.addEventListener("click", () => this.stopSpeech());
  }
  showStopButton(text = "") {
    if (this.stopButton) {
      this.stopButton.style.display = "flex";
      this.stopButton.style.alignItems = "center";
      this.stopButton.style.gap = "5px";
      this.stopButton.empty();
      (0, import_obsidian4.setIcon)(this.stopButton, "stop-circle");
      if (text) {
        this.stopButton.createSpan({ text });
      }
    }
  }
  hideStopButton() {
    if (this.stopButton) {
      this.stopButton.style.display = "none";
    }
  }
  getSelectedText() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (!activeView)
      return null;
    if (activeView.getMode() === "source") {
      return activeView.editor.getSelection();
    } else {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return null;
      return selection.toString();
    }
  }
  async saveAudioFile(audioBlob, text, activeFile) {
    if (!this.settings.saveAudioFiles)
      return "";
    DebugUtils.log("Starting to save audio file");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const prefix = this.settings.audioFilePrefix || activeFile.basename;
    const audioFolderName = this.settings.audioFolder || "audio-alltalk";
    const notePath = activeFile.parent ? activeFile.parent.path : "/";
    const audioFolderPath = `${notePath}/${audioFolderName}`;
    try {
      await this.app.vault.createFolder(audioFolderPath);
    } catch (error) {
    }
    const filename = `${prefix}-${timestamp}.wav`;
    const filePath = `${audioFolderPath}/${filename}`;
    DebugUtils.log(`Saving audio file (${Math.round(audioBlob.size / 1024)}KB)`);
    const arrayBuffer = await audioBlob.arrayBuffer();
    await this.app.vault.createBinary(filePath, arrayBuffer);
    DebugUtils.log("Audio file saved successfully");
    return `${filename}`;
  }
  async embedAudioInNote(filePath, activeFile, selection) {
    var _a;
    if (!this.settings.embedAfterGeneration)
      return;
    DebugUtils.log("Starting to embed audio");
    const content = await this.app.vault.read(activeFile);
    const audioEmbed = `
![[${filePath}]]
`;
    if (selection) {
      const editor = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor;
      if (editor) {
        const cursor = editor.getCursor("to");
        editor.replaceRange(audioEmbed, cursor);
        DebugUtils.log("Audio embedded after selection");
      }
    } else {
      const newContent = content + "\n---\n" + audioEmbed;
      await this.app.vault.modify(activeFile, newContent);
      DebugUtils.log("Audio embedded at end of note");
    }
  }
  async readText(text) {
    if (!text) {
      new import_obsidian4.Notice("No text selected");
      return;
    }
    if (this.isGenerating) {
      this.stopSpeech();
      return;
    }
    this.isGenerating = true;
    this.showStopButton("Preparing...");
    try {
      const speech = await this.allTalk.generateSpeech(text, this.settings, (current, total) => {
        this.showStopButton(`Generating batch ${current}/${total}`);
      });
      if (!speech) {
        this.hideStopButton();
        this.isGenerating = false;
        return;
      }
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile && this.settings.saveAudioFiles) {
        const filePath = await this.saveAudioFile(speech, text, activeFile);
        if (filePath) {
          await this.embedAudioInNote(filePath, activeFile, text);
        }
      }
      if (this.settings.autoPlayback) {
        this.showStopButton("Playing...");
        this.allTalk.playSpeech(speech, () => {
          this.hideStopButton();
          this.isGenerating = false;
        });
      } else {
        this.hideStopButton();
        this.isGenerating = false;
        new import_obsidian4.Notice("Audio file generated successfully");
      }
    } catch (error) {
      DebugUtils.error(`Error in readText: ${error.message}`);
      this.hideStopButton();
      this.isGenerating = false;
      new import_obsidian4.Notice("Failed to generate speech");
    }
  }
  async readHighlightedText() {
    const selectedText = this.getSelectedText();
    if (selectedText) {
      await this.readText(selectedText);
    } else {
      new import_obsidian4.Notice("No text selected");
    }
  }
  async readWholePage() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (!activeView) {
      new import_obsidian4.Notice("No active markdown view");
      return;
    }
    const content = activeView.getViewData();
    if (!content) {
      new import_obsidian4.Notice("No content in current view");
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
};