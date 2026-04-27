import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { ScoreCircle } from "@/components/ui";

interface ScoreRow {
  label: string;
  value: string | number;
}

interface FeedbackScoreCardProps {
  title: string;
  score: number;
  rows?: ScoreRow[];
}

function StatRow({
  label,
  value,
  isLast = false,
  theme,
}: ScoreRow & { isLast?: boolean; theme: (typeof Colors)["light"] }) {
  return (
    <View
      className="flex-row items-center justify-between py-1.5"
      style={
        !isLast
          ? { borderBottomWidth: 0.5, borderBottomColor: theme.border.subtle }
          : undefined
      }
    >
      <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
        {label}
      </Text>
      <Text className="font-heading text-xs" style={{ color: theme.text.primary }}>
        {value}
      </Text>
    </View>
  );
}

export function FeedbackScoreCard({ title, score, rows }: FeedbackScoreCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-xl p-4 gap-3 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
        {title}
      </Text>
      <View className="items-center py-2">
        <ScoreCircle score={score} label="Điểm" />
      </View>
      {rows && rows.length > 0 && (
        <View>
          {rows.map((row, index) => (
            <StatRow
              key={index}
              label={row.label}
              value={row.value}
              isLast={index === rows.length - 1}
              theme={theme}
            />
          ))}
        </View>
      )}
    </View>
  );
}
