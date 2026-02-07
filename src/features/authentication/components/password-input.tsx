import { BaseInput } from "@/components/ui/base-input";
import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  ReturnKeyTypeOptions,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean | string;
  label?: string;
  editable?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    {
      value,
      onChangeText,
      error = false,
      label = "Nhập mật khẩu",
      editable = true,
      placeholder = "Nhập mật khẩu của bạn",
      autoFocus = false,
      onSubmitEditing,
      returnKeyType,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <BaseInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={error}
        label={label}
        leftIcon={
          <MaterialIcons
            name="lock-outline"
            size={24}
            color={error ? "#ef4444" : "rgba(0,0,0,0.6)"}
          />
        }
        rightAccessory={
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(0,0,0,0.6)"
            />
          </TouchableOpacity>
        }
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
