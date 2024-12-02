import { Notice } from 'obsidian';
import type { PluginSettings } from './types';

export class DebugUtils {
    private static settings: PluginSettings | null = null;

    static initialize(settings: PluginSettings) {
        this.settings = settings;
    }

    static log(message: string) {
        if (this.settings?.debugMode) {
            new Notice(`[DEBUG] ${message}`);
            console.log(`[DEBUG] ${message}`);
        }
    }

    static error(message: string) {
        if (this.settings?.debugMode) {
            console.error(`[DEBUG] ${message}`);
        } else {
            // Always show error notices, but without debug prefix
            new Notice(message);
        }
    }
}
