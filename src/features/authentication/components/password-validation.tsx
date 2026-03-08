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
  return (
    <View className="flex-col gap-3">
      {rules.map((rule, index) => (
        <View key={index} className="flex-row items-start gap-2">
          {rule.isValid ? (
            <Check size={16} color="hsl(160, 84%, 39%)" />
          ) : (
            <X size={16} color="hsl(0, 84%, 60%)" />
          )}
          <Text className="font-body text-xs text-black">{rule.label}</Text>
        </View>
      ))}
    </View>
  );
};
