# Obsidian AllTalk TTS Plugin

This plugin integrates [AllTalk TTS](https://github.com/erew123/alltalk_tts/) with Obsidian, allowing you to use your local AllTalk TTS server to generate high-quality text-to-speech from your notes.

## Prerequisites

1. Install and set up [AllTalk TTS](https://github.com/erew123/alltalk_tts/) on your computer
2. Ensure the AllTalk TTS server is running (default: http://localhost:7851)

## Installation

### Required Files

For manual installation, you need these files in your `.obsidian/plugins/obsidian-alltalk-tts/` folder:

```
obsidian-alltalk-tts/
├── main.js
├── manifest.json
└── styles.css (if any styles are added in the future)
```

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "AllTalk TTS"
4. Install the plugin and enable it

### Manual Installation

1. Create a folder called `obsidian-alltalk-tts` in your vault's `.obsidian/plugins/` directory
2. Download `main.js` and `manifest.json` from the latest release
3. Place both files in the `obsidian-alltalk-tts` folder you created
4. Reload Obsidian
5. Enable the plugin in Community Plugins settings

### Building from Source

If you want to build the plugin yourself:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the plugin
4. Copy `main.js` and `manifest.json` to your vault's `.obsidian/plugins/obsidian-alltalk-tts/` folder

## Usage

### Commands

The plugin adds three commands that you can use:

1. **Read Highlighted Text**: Reads the currently selected text using AllTalk TTS
2. **Read Whole Page**: Reads the entire current note
3. **Stop Speech**: Stops the current speech playback

You can access these commands through:
- The Command Palette (Ctrl/Cmd + P)
- Custom hotkeys (can be set in Settings → Hotkeys)

### Settings

Configure the plugin in Settings → AllTalk TTS:

- **Server URL**: URL of your AllTalk TTS server (default: http://localhost:7851)
- **Voice**: Select from available TTS voices
- **Language**: Choose the text language
- **RVC Voice**: Optional RVC voice model for voice conversion

## Troubleshooting

1. **Server Connection Error**: 
   - Ensure AllTalk TTS server is running
   - Check the server URL in plugin settings
   - Verify no firewall is blocking the connection

2. **No Voices Available**: 
   - Make sure AllTalk TTS has loaded a model
   - Check the AllTalk TTS web interface for status

3. **No Audio Output**:
   - Check your system's audio output settings
   - Ensure no other application is blocking audio playback

## Support

- For plugin issues: [GitHub Issues](https://github.com/mithadon/obsidian-alltalk-tts-plugin/issues)
- For AllTalk TTS issues: [AllTalk TTS GitHub](https://github.com/erew123/alltalk_tts/issues)

## License

This plugin is released under MIT license. See [LICENSE](LICENSE) for details.
