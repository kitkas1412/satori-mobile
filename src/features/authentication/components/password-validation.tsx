import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Check, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface ValidationRule {
  label: string;
  isValid: boolean;
}

interface PasswordValidationProps {
  rules: ValidationRule[];
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  rules,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <View className="flex-col gap-3">
      {rules.map((rule, index) => (
        <View key={index} className="flex-row items-start gap-2">
          {rule.isValid ? (
            <Check size={16} color={theme.icon.success} />
          ) : (
            <X size={16} color={theme.icon.error} />
          )}
          <Text className="font-body text-xs" style={{ color: theme.text.primary }}>{rule.label}</Text>
        </View>
      ))}
    </View>
  );
};
