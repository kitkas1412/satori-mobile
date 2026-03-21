import { useEffect, useRef, useState } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";

import type { AssignmentDetailResponse } from "../api/practice.types";

interface UseWritingImagesParams {
  data: AssignmentDetailResponse | undefined;
}

export function useWritingImages({ data }: UseWritingImagesParams) {
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    if (data && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [data]);

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập camera trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const dueDate = data?.dueDate
    ? (() => {
        const d = new Date(data.dueDate);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : null;

  return { images, handlePickImage, handleTakePhoto, handleRemoveImage, dueDate };
}
