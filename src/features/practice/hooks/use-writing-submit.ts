import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ImagePickerAsset } from "expo-image-picker";

import { submitWritingApi } from "../api";
import { practiceQueryKeys } from "./use-assignments";

interface UseWritingSubmitParams {
  assignmentId: string;
  images: ImagePickerAsset[];
  getTimeSpentSeconds: () => number;
}

export function useWritingSubmit({
  assignmentId,
  images,
  getTimeSpentSeconds,
}: UseWritingSubmitParams) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      submitWritingApi(
        assignmentId,
        images.map((img) => ({
          uri: img.uri,
          name: img.fileName ?? `image_${Date.now()}.jpg`,
        })),
        getTimeSpentSeconds(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceQueryKeys.assignments });
      router.replace("/(tabs)/practice");
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
    },
  });

  return { handleSubmit: mutation.mutate, isPending: mutation.isPending };
}
