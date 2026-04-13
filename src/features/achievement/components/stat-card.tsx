import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
}

export function StatCard({ label, value, icon: Icon, iconColor }: StatCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        width: 140,
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        borderRadius: 14,
        paddingHorizontal: 17,
        paddingVertical: 16,
        gap: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Icon size={20} color={iconColor} />
        <Text
          className="font-heading"
          style={{ fontSize: 14, color: theme.text.secondary }}
        >
          {label}
        </Text>
      </View>
      <Text
        className="font-heading"
        style={{ fontSize: 18, color: theme.text.primary }}
      >
        {value}
      </Text>
    </View>
  );
}
