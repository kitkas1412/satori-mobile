// Hook gọi API bắt đầu một bài tập.
// Trả về mutation — màn hình gọi mutate(id) để kích hoạt và nhận data khi thành công.

import { useMutation } from "@tanstack/react-query";
import { startAssignmentApi } from "../api";

export function useStartAssignment() {
  return useMutation({
    mutationFn: (id: string) => startAssignmentApi(id),
  });
}
