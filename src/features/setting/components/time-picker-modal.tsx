import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X } from "lucide-react-native";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TimePickerModalProps {
  visible: boolean;
  title: string;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function TimePickerModal({
  visible,
  title,
  value,
  onChange,
  onClose,
  onConfirm,
}: TimePickerModalProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        onPress={onClose}
      />
      <View
        style={{
          backgroundColor: theme.background.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View
          className="flex-row items-center justify-between px-4"
          style={{ paddingTop: 16, paddingBottom: 8 }}
        >
          <TouchableOpacity onPress={onClose} hitSlop={12} activeOpacity={0.6}>
            <View
              style={{
                backgroundColor: theme.background.page,
                borderRadius: 99,
                padding: 6,
              }}
            >
              <X size={18} color={theme.icon.primary} />
            </View>
          </TouchableOpacity>
          <Text
            className="text-base font-heading"
            style={{ color: theme.text.primary }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onConfirm} hitSlop={12} activeOpacity={0.6}>
            <Text
              className="text-base font-heading"
              style={{ color: theme.brand.primary }}
            >
              Xong
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", width: "100%" }}>
          <DateTimePicker
            value={value}
            mode="time"
            display="spinner"
            is24Hour
            onChange={(_, date) => {
              if (date) onChange(date);
            }}
            style={{ height: 216 }}
          />
        </View>
      </View>
    </Modal>
  );
}
