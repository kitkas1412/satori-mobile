import { AlertCircle } from "lucide-react-native";
import { Modal, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import { PrimaryButton } from "./button";

export function ErrorOverlay() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { visible, message, onBack, hide } = useErrorOverlayStore();

  function handleBack() {
    hide();
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  return (
    <Modal visible={visible} transparent={false} statusBarTranslucent>
      <View
        className="flex-1 items-center justify-center px-8 gap-6"
        style={{ backgroundColor: theme.background.page }}
      >
        <AlertCircle size={64} color={theme.error.default} />

        <View className="items-center gap-3">
          <Text
            className="font-heading text-2xl text-center"
            style={{ color: theme.text.primary }}
          >
            Có lỗi xảy ra
          </Text>
          <Text
            className="font-body text-base text-center"
            style={{ color: theme.text.secondary }}
          >
            {message}
          </Text>
        </View>

        <View className="w-full">
          <PrimaryButton text="Quay về" onPress={handleBack} />
        </View>
      </View>
    </Modal>
  );
}
