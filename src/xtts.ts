import { XTTS } from 'xtts-v2';

let xttsInstance: XTTS | null = null;

async function initializeXTTS() {
  if (!xttsInstance) {
    xttsInstance = new XTTS();
    await xttsInstance.initialize();
  }
}

export async function generateSpeech(text: string): Promise<Blob> {
  await initializeXTTS();
  return xttsInstance!.generateSpeech(text);
}

export function playSpeech(speech: Blob) {
  const audio = new Audio(URL.createObjectURL(speech));
  audio.play();
}

export function stopSpeech() {
  if (xttsInstance) {
    xttsInstance.stop();
  }
}
