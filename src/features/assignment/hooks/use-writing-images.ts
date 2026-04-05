// Hook quản lý danh sách ảnh bài làm của học viên:
// chọn từ thư viện, chụp camera, xóa ảnh, và đo thời gian bắt đầu làm bài.

import { useEffect, useRef, useState } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";

import type { AssignmentDetailResponse } from "../api/practice.types";

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UseWritingImagesParams {
  data: AssignmentDetailResponse | undefined;
}

export function useWritingImages({ data }: UseWritingImagesParams) {
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const startedAtRef = useRef<number>(0);

  // Ghi nhận thời điểm bắt đầu khi dữ liệu bài tập vừa được tải xong.
  // Cùng pattern với useQuizTimer: kiểm tra === 0 để chỉ ghi nhận một lần duy nhất.
  useEffect(() => {
    if (data && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [data]);

  // Mở thư viện ảnh để học viên chọn nhiều ảnh cùng lúc.
  // Nếu chưa cấp quyền, hướng dẫn mở Cài đặt thay vì từ chối im lặng.
  async function handlePickImage() {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Đã đủ ảnh", `Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} hình ảnh.`);
      return;
    }
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
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
    });
    if (!result.canceled) {
      const validAssets = result.assets.filter(
        (asset) => asset.fileSize === undefined || asset.fileSize <= MAX_FILE_SIZE,
      );
      if (validAssets.length < result.assets.length) {
        Alert.alert(
          "Ảnh quá lớn",
          "Một số ảnh vượt quá 5MB và đã bị bỏ qua.",
        );
      }
      setImages((prev) => [...prev, ...validAssets]);
    }
  }

  // Mở camera để học viên chụp ảnh bài làm trực tiếp.
  async function handleTakePhoto() {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Đã đủ ảnh", `Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} hình ảnh.`);
      return;
    }
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
      const asset = result.assets[0];
      if (asset.fileSize !== undefined && asset.fileSize > MAX_FILE_SIZE) {
        Alert.alert("Ảnh quá lớn", "Ảnh vượt quá 5MB, vui lòng chụp lại.");
        return;
      }
      setImages((prev) => [...prev, asset]);
    }
  }

  // Xóa ảnh tại vị trí index khỏi danh sách
  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  // Định dạng ngày hạn nộp sang dd/MM/yyyy để hiển thị trên màn hình
  const dueDate = data?.dueDate
    ? (() => {
        const d = new Date(data.dueDate);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : null;

  return { images, handlePickImage, handleTakePhoto, handleRemoveImage, dueDate };
}
