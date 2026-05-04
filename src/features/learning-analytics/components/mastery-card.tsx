import { Colors } from "@/constants/theme";
import { useProfile } from "@/features/profile-management/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { MasteryCategory } from "../api";
import { useMastery } from "../hooks";

interface MasteryCategoryRowProps {
  label: string;
  data: MasteryCategory;
  theme: (typeof Colors)["light"];
}

function MasteryCategoryRow({ label, data, theme }: MasteryCategoryRowProps) {
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <Text
          className="font-heading"
          style={{ fontSize: 14, color: theme.text.primary }}
        >
          {label}
        </Text>
        <View
          style={{
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 3,
            backgroundColor: theme.brand.primarySubtle,
          }}
        >
          <Text
            className="font-heading"
            style={{ fontSize: 13, color: theme.brand.primary }}
          >
            {Math.round(data.percent)}%
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 10,
          borderRadius: 9999,
          overflow: "hidden",
          backgroundColor: theme.border.subtle,
          flexDirection: "row",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.border.subtle,
        }}
      >
        {data.total > 0 && (
          <>
            <View
              style={{
                width: `${(data.mastered / data.total) * 100}%`,
                backgroundColor: theme.icon.success,
              }}
            />
            <View
              style={{
                width: `${(data.learning / data.total) * 100}%`,
                backgroundColor: theme.icon.info,
              }}
            />
            <View
              style={{
                width: `${(data.notStarted / data.total) * 100}%`,
                backgroundColor: theme.background.page,
              }}
            />
          </>
        )}
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <CountChip
          label="Thành thạo"
          count={data.mastered}
          color={theme.icon.success}
          theme={theme}
        />
        <CountChip
          label="Đang học"
          count={data.learning}
          color={theme.icon.info}
          theme={theme}
        />
        <CountChip
          label="Chưa học"
          count={data.notStarted}
          color={theme.background.page}
          borderColor={theme.border.subtle}
          theme={theme}
        />
      </View>
    </View>
  );
}

interface CountChipProps {
  label: string;
  count: number;
  color: string;
  borderColor?: string;
  theme: (typeof Colors)["light"];
}

function CountChip({ label, count, color, borderColor, theme }: CountChipProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          borderWidth: borderColor ? 1 : 0,
          borderColor,
        }}
      />
      <Text
        className="font-body"
        style={{ fontSize: 12, color: theme.text.secondary }}
      >
        {label}
      </Text>
      <Text
        className="font-body"
        style={{ fontSize: 12, color: theme.text.primary }}
      >
        {count}
      </Text>
    </View>
  );
}

export function MasteryCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data: profile } = useProfile();
  const courseId = profile?.enrolledClasses?.[0]?.courseId;
  const { data, isLoading, isError } = useMastery(courseId);

  if (!courseId) return null;

  return (
    <View
      style={{
        backgroundColor: theme.background.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        padding: 16,
        gap: 16,
      }}
    >
      <Text
        className="font-heading"
        style={{ fontSize: 18, fontWeight: "700", color: theme.text.primary }}
      >
        Thành thạo từ vựng & ngữ pháp
      </Text>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={theme.brand.primary}
          style={{ marginVertical: 24 }}
        />
      )}

      {isError && (
        <Text
          className="font-body"
          style={{
            fontSize: 14,
            color: theme.error.text,
            textAlign: "center",
            marginVertical: 24,
          }}
        >
          Không thể tải dữ liệu
        </Text>
      )}

      {data && (
        <>
          <MasteryCategoryRow
            label="Từ vựng"
            data={data.vocabulary}
            theme={theme}
          />
          <View
            style={{ height: 1, backgroundColor: theme.border.subtle }}
          />
          <MasteryCategoryRow
            label="Ngữ pháp"
            data={data.grammar}
            theme={theme}
          />
        </>
      )}
    </View>
  );
}
