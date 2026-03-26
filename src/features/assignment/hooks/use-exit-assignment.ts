// Hook hiển thị hộp thoại xác nhận trước khi thoát khỏi bài đang làm.
// Nhận callback onExit để xử lý hành động thoát (ví dụ: router.back()).

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
