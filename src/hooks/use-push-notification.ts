import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Thông báo",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    showBadge: true,
  });
}

export async function getPushToken(): Promise<string | null> {
  try {
    await ensureAndroidChannel();
    console.log("[PushToken] channel ok");

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("[PushToken] permission:", existingStatus);

    if (existingStatus === "undetermined") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[PushToken] permission denied, abort");
      return null;
    }

    console.log("[PushToken] calling getDevicePushTokenAsync...");
    const tokenData = await Notifications.getDevicePushTokenAsync();
    console.log("[PushToken] token:", tokenData.data);
    return tokenData.data;
  } catch (e) {
    console.error("[PushToken] ERROR:", e);
    return null;
  }
}
