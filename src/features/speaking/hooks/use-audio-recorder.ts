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
  const audioEndFiredRef = useRef(false);
  const resolveRef = useRef<((v: RecordingResult) => void) | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function tryResolve() {
    // resolve only when both "end" and "audioend" have fired
    if (!endFiredRef.current) return;
    if (!audioEndFiredRef.current) return;
    if (resolveRef.current === null) return;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Switch audio session sang playback TRƯỚC khi resolve — tránh race với
    // playAssistantMessage chạy ngay sau, khi session còn ở `.playAndRecord`
    // sẽ routing audio qua earpiece với volume thấp.
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
    }).catch(() => {});

    const resolver = resolveRef.current;
    resolveRef.current = null;
    isCleaningUpRef.current = false;
    resolver?.({
      transcript: transcriptRef.current,
      audioUri: audioUriRef.current,
    });
  }

  useSpeechRecognitionEvent("result", (event) => {
    const alts = event.results;
    if (!alts || alts.length === 0) return;
    const best = alts.reduce((acc, cur) => {
      const a = acc.confidence ?? 0;
      const c = cur.confidence ?? 0;
      return c > a ? cur : acc;
    }, alts[0]);
    if (best.transcript) transcriptRef.current = best.transcript;
  });

  useSpeechRecognitionEvent("audioend", (event) => {
    audioUriRef.current = event.uri ?? null;
    audioEndFiredRef.current = true;
    tryResolve();
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    endFiredRef.current = true;
    tryResolve();
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted") return;

    if (event.error === "network") {
      Alert.alert(
        "Mất kết nối",
        "Không thể nhận dạng giọng nói khi mất mạng. Vui lòng kiểm tra kết nối và thử lại.",
      );
    } else if (event.error === "language-not-supported") {
      Alert.alert(
        "Thiết bị không hỗ trợ",
        "Thiết bị này không hỗ trợ nhận dạng tiếng Nhật.",
      );
    }

    setIsListening(false);
    endFiredRef.current = true;
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
    audioEndFiredRef.current = false;
    setIsListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: "ja-JP",
      interimResults: true,
      continuous: true,
      addsPunctuation: true,
      requiresOnDeviceRecognition: false,
      maxAlternatives: 3,
      iosTaskHint: "dictation",
      recordingOptions: {
        persist: true,
      },
      iosCategory: {
        category: "playAndRecord",
        categoryOptions: ["defaultToSpeaker", "allowBluetooth"],
        mode: "default",
      },
    });
  }

  async function stopRecording(): Promise<RecordingResult> {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      isCleaningUpRef.current = true;
      ExpoSpeechRecognitionModule.stop();

      // safety net: if iOS never fires "end", resolve after 8s to avoid leak
      safetyTimerRef.current = setTimeout(async () => {
        if (!resolveRef.current) return;
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        }).catch(() => {});
        const resolver = resolveRef.current;
        resolveRef.current = null;
        isCleaningUpRef.current = false;
        audioEndFiredRef.current = false;
        resolver?.({
          transcript: transcriptRef.current,
          audioUri: audioUriRef.current,
        });
      }, 8000);
    });
  }

  return {
    startRecording,
    stopRecording,
    isRecording: isListening,
  };
}
