export interface PluginSettings {
    serverUrl: string;
    voice: string;
    language: string;
    rvcVoice: string;
    useRvc: boolean;
    // Server settings
    deepSpeedEnabled: boolean;
    lowVramEnabled: boolean;
    currentModel: string;
    // Generation settings
    streamingEnabled: boolean;
    narratorEnabled: boolean;
    narratorVoice: string;
    narratorRvcVoice: string;
    textNotInside: 'character' | 'narrator' | 'silent';
    // Text processing settings
    onlyNarrateQuotes: boolean;
    ignoreAsterisks: boolean;
    skipCodeblocks: boolean;
    skipTaggedBlocks: boolean;
    passAsterisksToTTS: boolean;
    maxChunkSize: number;
    // Playback settings
    playbackSpeed: number;
    autoPlayback: boolean;
    // Audio saving settings
    saveAudioFiles: boolean;
    audioFilePrefix: string;
    embedAfterGeneration: boolean;
    audioFolder: string;
    // Debug settings
    debugMode: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    serverUrl: 'http://localhost:7851',
    voice: 'default',
    language: 'en',
    rvcVoice: 'Disabled',
    useRvc: false,
    // Server settings
    deepSpeedEnabled: false,
    lowVramEnabled: false,
    currentModel: '',
    // Generation settings
    streamingEnabled: false,
    narratorEnabled: false,
    narratorVoice: 'default',
    narratorRvcVoice: 'Disabled',
    textNotInside: 'character',
    // Text processing settings
    onlyNarrateQuotes: false,
    ignoreAsterisks: false,
    skipCodeblocks: true,
    skipTaggedBlocks: true,
    passAsterisksToTTS: false,
    maxChunkSize: 10,
    // Playback settings
    playbackSpeed: 1.0,
    autoPlayback: true,
    // Audio saving settings
    saveAudioFiles: false,
    audioFilePrefix: '',
    embedAfterGeneration: true,
    audioFolder: 'audio',
    // Debug settings
    debugMode: false
};

export interface TTSOptions extends PluginSettings {
    // Any additional TTS-specific options can be added here
}

export const LANGUAGES = {
    'English': 'en',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Spanish': 'es',
    'Portuguese': 'pt',
    'Hindi': 'hi',
    'Chinese': 'zh',
    'Japanese': 'ja',
    'Korean': 'ko'
} as const;

export interface ServerInfo {
    models_available: Array<{
        name: string;
        [key: string]: any;
    }>;
    voices: string[];
    rvcvoices: string[];
    current_model_loaded: string;
    deepspeed_capable: boolean;
    deepspeed_available: boolean;
    deepspeed_enabled: boolean;
    lowvram_capable: boolean;
    lowvram_enabled: boolean;
}
