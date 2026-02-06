import { Check, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface PasswordValidationProps {
  password: string;
}

interface ValidationRule {
  label: string;
  isValid: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  {
    label: "Mật khẩu trên 8 ký tự",
    isValid: (password) => password.length >= 8,
  },
  {
    label: "Chữ cái viết hoa",
    isValid: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Chữ cái thường",
    isValid: (password) => /[a-z]/.test(password),
  },
  {
    label: "Ký tự đặc biệt (!@#$,...)",
    isValid: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
}) => {
  return (
    <View className="flex-col gap-3">
      {validationRules.map((rule, index) => {
        const isValid = rule.isValid(password);
        return (
          <View key={index} className="flex-row items-start gap-2">
            {isValid ? (
              <Check size={16} color="#10B981" />
            ) : (
              <X size={16} color="#EF4444" />
            )}
            <Text className="font-body text-[12px] text-black">
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
