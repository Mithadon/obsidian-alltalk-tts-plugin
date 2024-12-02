export interface ChunkResult {
    index: number;
    data: Blob;
}

export class AudioProcessor {
    /**
     * Split text into chunks based on sentence boundaries
     */
    static splitTextIntoChunks(text: string, maxChunks: number): string[] {
        // Split text into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks: string[] = [];
        let currentChunk = '';
        let currentChunkSentences = 0;

        for (const sentence of sentences) {
            if (currentChunkSentences >= maxChunks) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
                currentChunkSentences = 0;
            }
            currentChunk += sentence + ' ';
            currentChunkSentences++;
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    /**
     * Process text according to settings
     */
    static processText(text: string, options: {
        skipCodeblocks: boolean;
        skipTaggedBlocks: boolean;
        ignoreAsterisks: boolean;
        passAsterisksToTTS: boolean;
    }): string {
        let processedText = text;

        // Remove code blocks
        if (options.skipCodeblocks) {
            processedText = processedText.replace(/```[\s\S]*?```/g, '');
            processedText = processedText.replace(/`[^`]*`/g, '');
        }

        // Remove tagged blocks
        if (options.skipTaggedBlocks) {
            processedText = processedText.replace(/<[^>]*>/g, '');
        }

        // Handle asterisk content
        if (options.ignoreAsterisks) {
            processedText = processedText.replace(/\*[^*]*\*/g, '');
        } else if (!options.passAsterisksToTTS) {
            // Remove asterisks but keep content
            processedText = processedText.replace(/\*(.*?)\*/g, '$1');
        }

        // Clean up extra whitespace
        processedText = processedText.replace(/\s+/g, ' ').trim();

        return processedText;
    }

    /**
     * Combine multiple audio blobs into a single blob
     */
    static combineAudioChunks(chunks: ChunkResult[]): Blob | null {
        if (chunks.length === 0) return null;

        // Sort chunks by index to ensure correct order
        chunks.sort((a, b) => a.index - b.index);

        // Combine all blobs
        return new Blob(chunks.map(chunk => chunk.data), { type: 'audio/wav' });
    }

    /**
     * Validate chunk results for completeness
     */
    static validateChunks(results: ChunkResult[], expectedCount: number): boolean {
        if (results.length !== expectedCount) return false;

        // Verify we have all chunks in sequence
        const indices = results.map(r => r.index).sort((a, b) => a - b);
        for (let i = 0; i < indices.length; i++) {
            if (indices[i] !== i) return false;
        }

        return true;
    }
}
