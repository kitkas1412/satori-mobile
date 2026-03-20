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
          name: img.fileName ?? `image_${Date.now()}.jpg`,
          mimeType: img.mimeType ?? undefined,
        })),
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: practiceQueryKeys.assignments });
      setWritingResult(data);
      router.replace("/assignment-writing-result");
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
    },
  });

  return { handleSubmit: mutation.mutate, isPending: mutation.isPending };
}
