import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Dumbbell, Flame, Mic, Zap } from "lucide-react-native";
import { ScrollView } from "react-native";
import type { AchievementProgress } from "../api";
import { StatCard } from "./stat-card";

interface StatsSectionProps {
  progress: AchievementProgress;
}

export function StatsSection({ progress }: StatsSectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      <StatCard label="Kinh nghiệm" value={`${progress.totalExp} EXP`} icon={Zap} iconColor={theme.icon.info} />
      <StatCard label="Streak" value={`${progress.streakCurrent} ngày`} icon={Flame} iconColor={theme.icon.error} />
      <StatCard label="Luyện nói" value={`${progress.speakingCount} hội thoại`} icon={Mic} iconColor={theme.icon.purple} />
      <StatCard label="Luyện tập" value={`${progress.practiceCount} lần`} icon={Dumbbell} iconColor={theme.icon.success} />
    </ScrollView>
  );
}
