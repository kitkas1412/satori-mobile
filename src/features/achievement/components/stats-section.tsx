import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Dumbbell, Flame, Mic, Zap } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useAchievementProgress } from "../hooks";
import { StatCard } from "./stat-card";

export function StatsSection() {
  const { data } = useAchievementProgress();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  if (!data) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      <StatCard label="Kinh nghiệm" value={`${data.totalExp} EXP`} icon={Zap} iconColor={theme.icon.info} />
      <StatCard label="Streak" value={`${data.streakCurrent} ngày`} icon={Flame} iconColor={theme.icon.error} />
      <StatCard label="Luyện nói" value={`${data.speakingCount} hội thoại`} icon={Mic} iconColor={theme.icon.purple} />
      <StatCard label="Luyện tập" value={`${data.practiceCount} lần`} icon={Dumbbell} iconColor={theme.icon.success} />
    </ScrollView>
  );
}
