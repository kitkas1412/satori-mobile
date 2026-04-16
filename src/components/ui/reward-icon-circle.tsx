import type { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  backgroundColor: string;
  children: ReactNode;
};

export function RewardIconCircle({ backgroundColor, children }: Props) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: 96, height: 96, backgroundColor }}
    >
      {children}
    </View>
  );
}
