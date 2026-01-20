import { ScrollView } from "react-native";

import {
  DailyReport,
  Header,
  QuickPractice,
  StreakCard,
} from "@/features/home/components";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background-default"
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <StreakCard />
      <DailyReport />
      <QuickPractice />
    </ScrollView>
  );
}
