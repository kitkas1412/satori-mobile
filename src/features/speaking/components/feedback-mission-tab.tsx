import { View } from "react-native";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import { EmptyMissionsCard } from "./empty-missions-card";
import { MissionDetailsCard } from "./mission-details-card";
import type { TaskCompletionResult } from "@/features/speaking/api/speaking.types";

interface FeedbackMissionTabProps {
  taskCompletion: TaskCompletionResult | null | undefined;
  taskCompletionFeedback: string;
}

export function FeedbackMissionTab({
  taskCompletion,
  taskCompletionFeedback,
}: FeedbackMissionTabProps) {
  if (!taskCompletion) {
    return (
      <View className="gap-4">
        <EmptyMissionsCard />
        {/* {taskCompletionFeedback ? (
          <FeedbackCard title="Phản hồi nhiệm vụ" text={taskCompletionFeedback} />
        ) : null} */}
      </View>
    );
  }

  const hasMissions = (taskCompletion.details?.length ?? 0) > 0;

  return (
    <View className="gap-4">
      <FeedbackScoreCard title="Nhiệm vụ" score={taskCompletion.score} />
      {/* <FeedbackCard title="Phản hồi nhiệm vụ" text={taskCompletion.feedback} /> */}
      {hasMissions ? (
        <MissionDetailsCard missionDetails={taskCompletion.details} />
      ) : (
        <EmptyMissionsCard />
      )}
    </View>
  );
}
