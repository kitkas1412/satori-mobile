// Hook nộp bài viết: gọi API upload ảnh, invalidate cache danh sách bài tập,
// lưu kết quả vào store và gọi callback điều hướng đến màn hình kết quả bài viết.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImagePickerAsset } from "expo-image-picker";

import { submitWritingApi } from "../api";
import { useAssignmentStore } from "@/stores";
import { assignmentQueryKeys } from "./use-assignments";

interface UseWritingSubmitParams {
  assignmentId: string;
  images: ImagePickerAsset[];
  onNavigate: () => void;
  dueDate?: string;
}

export function useWritingSubmit({
  assignmentId,
  images,
  onNavigate,
  dueDate,
}: UseWritingSubmitParams) {
  const queryClient = useQueryClient();
  const setWritingResult = useAssignmentStore((s) => s.setWritingResult);

  const mutation = useMutation({
    mutationFn: () =>
      submitWritingApi(
        assignmentId,
        images.map((img) => ({
          uri: img.uri,
          name: img.fileName ?? `image_${Date.now()}.jpg`, // Fallback tên file nếu không có
          mimeType: img.mimeType ?? undefined,
        })),
      ),
    onSuccess: (data) => {
      // Làm mới danh sách bài tập để phản ánh trạng thái "Đã nộp"
      queryClient.invalidateQueries({
        queryKey: assignmentQueryKeys.all,
      });
      // Lưu kết quả vào store để màn hình kết quả đọc mà không cần gọi API lại
      setWritingResult(data, false, dueDate);
      onNavigate();
    },
  });

  return { handleSubmit: mutation.mutate, isPending: mutation.isPending };
}
