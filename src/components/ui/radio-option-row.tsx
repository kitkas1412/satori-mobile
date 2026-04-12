import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, TouchableOpacity, View } from "react-native";

interface RadioOptionRowProps {
  label: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioOptionRow({ label, subtitle, selected, onPress }: RadioOptionRowProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: selected ? theme.brand.primary : theme.border.subtle,
      }}
    >
      <View className="px-4 py-3 flex-row items-center justify-between">
        <View style={{ gap: 2 }}>
          <Text className="font-body text-base" style={{ color: theme.text.primary }}>
            {label}
          </Text>
          {subtitle && (
            <Text className="font-body text-sm" style={{ color: theme.text.secondary }}>
              {subtitle}
            </Text>
          )}
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: selected ? theme.brand.primary : theme.border.default,
            backgroundColor: selected ? theme.brand.primary : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.text.onBrand,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
