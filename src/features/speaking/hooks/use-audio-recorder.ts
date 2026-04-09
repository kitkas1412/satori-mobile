import { setAudioModeAsync } from "expo-audio";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useRef, useState } from "react";
import { Alert } from "react-native";

type RecordingResult = { transcript: string; audioUri: string | null };

export function useRecorder() {
  const transcriptRef = useRef("");
  const audioUriRef = useRef<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // ref-based flags (synchronous, no stale state issues)
  const isCleaningUpRef = useRef(false);
  const endFiredRef = useRef(false);
  const resolveRef = useRef<((v: RecordingResult) => void) | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function tryResolve() {
    // resolve only when both "end" and "audioend" have fired
    if (!endFiredRef.current) return;
    if (resolveRef.current === null) return;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    resolveRef.current({
      transcript: transcriptRef.current,
      audioUri: audioUriRef.current,
    });
    resolveRef.current = null;
    setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    isCleaningUpRef.current = false;
  }

  useSpeechRecognitionEvent("result", (event) => {
    const top = event.results?.[0];
    if (top) {
      transcriptRef.current = top.transcript;
    }
  });

  useSpeechRecognitionEvent("audioend", (event) => {
    audioUriRef.current = event.uri ?? null;
    tryResolve();
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    endFiredRef.current = true;
    tryResolve();
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted") return;
    console.warn("Speech recognition error:", event.error, event.message);
    setIsListening(false);
    endFiredRef.current = true;
    tryResolve();
  });

  async function startRecording() {
    if (isCleaningUpRef.current) return;

    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Cần quyền nhận dạng giọng nói",
        "Vui lòng cấp quyền microphone và nhận dạng giọng nói trong cài đặt.",
      );
      return;
    }

    transcriptRef.current = "";
    audioUriRef.current = null;
    endFiredRef.current = false;
    setIsListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: "ja-JP",
      interimResults: true,
      continuous: true,
      addsPunctuation: true,
      requiresOnDeviceRecognition: true,
      recordingOptions: {
        persist: true,
      },
      iosCategory: {
        category: "playAndRecord",
        categoryOptions: ["defaultToSpeaker", "allowBluetooth"],
        mode: "voiceChat",
      },
    });
  }

  async function stopRecording(): Promise<RecordingResult> {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      isCleaningUpRef.current = true;
      ExpoSpeechRecognitionModule.stop();

      // safety net: if iOS never fires "end", resolve after 8s to avoid leak
      safetyTimerRef.current = setTimeout(() => {
        if (resolveRef.current) {
          resolveRef.current({
            transcript: transcriptRef.current,
            audioUri: audioUriRef.current,
          });
          resolveRef.current = null;
          setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
          isCleaningUpRef.current = false;
        }
      }, 8000);
    });
  }

  return {
    startRecording,
    stopRecording,
    isRecording: isListening,
  };
}
