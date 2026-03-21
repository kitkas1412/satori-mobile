// Hook nộp bài viết: gọi API upload ảnh, invalidate cache danh sách bài tập,
// lưu kết quả vào store và điều hướng đến màn hình kết quả bài viết.

import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ImagePickerAsset } from "expo-image-picker";

import { submitWritingApi } from "../api";
import { practiceQueryKeys } from "./use-assignments";
import { usePracticeStore } from "@/stores";

interface UseWritingSubmitParams {
  assignmentId: string;
  images: ImagePickerAsset[];
}

export function useWritingSubmit({
  assignmentId,
  images,
}: UseWritingSubmitParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setWritingResult = usePracticeStore((s) => s.setWritingResult);

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
      queryClient.invalidateQueries({ queryKey: practiceQueryKeys.assignments });
      // Lưu kết quả vào store để màn hình kết quả đọc mà không cần gọi API lại
      setWritingResult(data);
      router.replace("/assignment-writing-result");
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
    },
  });

  return { handleSubmit: mutation.mutate, isPending: mutation.isPending };
}
