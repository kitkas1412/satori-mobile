import { ScrollView } from "react-native";

import {
  DailyReport,
  HomeHeader,
  QuickPractice,
  StreakCard,
} from "@/features/home/components";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background-default"
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader />
      <StreakCard />
      <DailyReport />
      <QuickPractice />
    </ScrollView>
  );
}
