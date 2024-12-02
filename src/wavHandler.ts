export class WavHandler {
    private static readInt32LE(buffer: ArrayBuffer, offset: number): number {
        const view = new DataView(buffer);
        return view.getInt32(offset, true);
    }

    private static readInt16LE(buffer: ArrayBuffer, offset: number): number {
        const view = new DataView(buffer);
        return view.getInt16(offset, true);
    }

    private static writeInt32LE(value: number): Uint8Array {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, value, true);
        return new Uint8Array(buffer);
    }

    private static writeInt16LE(value: number): Uint8Array {
        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        view.setInt16(0, value, true);
        return new Uint8Array(buffer);
    }

    static async combineWavBlobs(blobs: Blob[]): Promise<Blob> {
        // Convert all blobs to array buffers
        const buffers = await Promise.all(
            blobs.map(blob => blob.arrayBuffer())
        );

        // Parse WAV headers and collect audio data
        let format: number | null = null;
        let sampleRate: number | null = null;
        let channels: number | null = null;
        let bitsPerSample: number | null = null;
        const audioDataChunks: Uint8Array[] = [];
        let totalAudioLength = 0;

        for (const buffer of buffers) {
            // Verify RIFF header
            const header = new Uint8Array(buffer, 0, 4);
            if (new TextDecoder().decode(header) !== 'RIFF') {
                throw new Error('Invalid WAV file: Missing RIFF header');
            }

            // Verify WAVE format
            const format_marker = new Uint8Array(buffer, 8, 4);
            if (new TextDecoder().decode(format_marker) !== 'WAVE') {
                throw new Error('Invalid WAV file: Not in WAVE format');
            }

            // Find fmt chunk
            let offset = 12;
            while (offset < buffer.byteLength) {
                const chunkId = new TextDecoder().decode(new Uint8Array(buffer, offset, 4));
                const chunkSize = WavHandler.readInt32LE(buffer, offset + 4);

                if (chunkId === 'fmt ') {
                    // Parse format chunk
                    const currentFormat = WavHandler.readInt16LE(buffer, offset + 8);
                    const currentChannels = WavHandler.readInt16LE(buffer, offset + 10);
                    const currentSampleRate = WavHandler.readInt32LE(buffer, offset + 12);
                    const currentBitsPerSample = WavHandler.readInt16LE(buffer, offset + 22);

                    // Verify all files have the same format
                    if (format === null) {
                        format = currentFormat;
                        channels = currentChannels;
                        sampleRate = currentSampleRate;
                        bitsPerSample = currentBitsPerSample;
                    } else if (
                        format !== currentFormat ||
                        channels !== currentChannels ||
                        sampleRate !== currentSampleRate ||
                        bitsPerSample !== currentBitsPerSample
                    ) {
                        throw new Error('WAV files have different formats');
                    }
                } else if (chunkId === 'data') {
                    // Extract audio data
                    const audioData = new Uint8Array(buffer, offset + 8, chunkSize);
                    audioDataChunks.push(audioData);
                    totalAudioLength += chunkSize;
                }

                offset += 8 + chunkSize;
                // Ensure we're at an even boundary
                if (offset % 2 !== 0) offset++;
            }
        }

        // Create new WAV file
        const headerLength = 44; // Standard WAV header length
        const totalLength = headerLength + totalAudioLength;
        const finalBuffer = new ArrayBuffer(totalLength);
        const finalView = new Uint8Array(finalBuffer);

        // Write WAV header
        const header = new TextEncoder().encode('RIFF');
        finalView.set(header, 0);
        finalView.set(WavHandler.writeInt32LE(totalLength - 8), 4);
        finalView.set(new TextEncoder().encode('WAVE'), 8);
        finalView.set(new TextEncoder().encode('fmt '), 12);
        finalView.set(WavHandler.writeInt32LE(16), 16); // fmt chunk size
        finalView.set(WavHandler.writeInt16LE(format!), 20); // format
        finalView.set(WavHandler.writeInt16LE(channels!), 22); // channels
        finalView.set(WavHandler.writeInt32LE(sampleRate!), 24); // sample rate
        finalView.set(WavHandler.writeInt32LE(sampleRate! * channels! * (bitsPerSample! / 8)), 28); // byte rate
        finalView.set(WavHandler.writeInt16LE(channels! * (bitsPerSample! / 8)), 32); // block align
        finalView.set(WavHandler.writeInt16LE(bitsPerSample!), 34); // bits per sample
        finalView.set(new TextEncoder().encode('data'), 36);
        finalView.set(WavHandler.writeInt32LE(totalAudioLength), 40);

        // Write audio data
        let dataOffset = 44;
        for (const chunk of audioDataChunks) {
            finalView.set(chunk, dataOffset);
            dataOffset += chunk.length;
        }

        return new Blob([finalBuffer], { type: 'audio/wav' });
    }
}
