import { api } from "@/lib/axios";
import type { ApiResponse, UserProfile } from "@/types/api";
import type { ImagePickerAsset } from "expo-image-picker";

export async function uploadAvatarApi(asset: ImagePickerAsset): Promise<UserProfile> {
  const form = new FormData();
  form.append("file", {
    uri: asset.uri,
    name: asset.fileName ?? "avatar.jpg",
    type: asset.mimeType ?? "image/jpeg",
  } as unknown as Blob);
  const response = await api.post<ApiResponse<UserProfile>>("/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}
