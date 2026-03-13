import { createAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";

export async function playAssistantMessage(
  content: string,
  audioUrl?: string | null
): Promise<void> {
  if (audioUrl) {
    return playAudioFromUrl(audioUrl);
  }
  return speakText(content);
}

async function playAudioFromUrl(url: string): Promise<void> {
  const player = createAudioPlayer(url);
  return new Promise<void>((resolve) => {
    const subscription = player.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        subscription.remove();
        player.remove();
        resolve();
      }
    });
    player.play();
  });
}

async function speakText(text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    Speech.speak(text, {
      language: "ja-JP",
      onDone: resolve,
      onStopped: resolve,
      onError: () => resolve(),
    });
  });
}
