// Hook gọi AI đánh giá bài viết trước khi nộp.
// Gọi API evaluate, trả kết quả feedback qua callback onSuccess.

import { useMutation } from "@tanstack/react-query";
import type { ImagePickerAsset } from "expo-image-picker";

import { evaluateWritingApi } from "../api";

interface UseWritingEvaluateParams {
  assignmentId: string;
  prompt: string;
  images: ImagePickerAsset[];
  onSuccess: (feedback: string) => void;
}

export function useWritingEvaluate({
  assignmentId,
  prompt,
  images,
  onSuccess,
}: UseWritingEvaluateParams) {
  const mutation = useMutation({
    mutationFn: () =>
      evaluateWritingApi(
        assignmentId,
        prompt,
        images.map((img) => ({
          uri: img.uri,
          name: img.fileName ?? `image_${Date.now()}.jpg`,
          mimeType: img.mimeType ?? undefined,
        })),
      ),
    onSuccess: (data) => {
      onSuccess(data.feedback);
    },
  });

  return { handleEvaluate: mutation.mutate, isPending: mutation.isPending };
}
