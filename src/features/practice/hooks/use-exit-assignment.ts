import { Alert } from "react-native";

export function useExitAssignment(onExit: () => void) {
  function handleExit() {
    Alert.alert(
      "Thoát bài tập?",
      "Tiến độ của bạn sẽ không được lưu.",
      [
        { text: "Tiếp tục làm", style: "cancel" },
        { text: "Thoát", style: "destructive", onPress: onExit },
      ],
    );
  }

  return { handleExit };
}
