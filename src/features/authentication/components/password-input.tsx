import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  label?: string;
  editable?: boolean;
  placeholder?: string;
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
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <>
        {label && (
          <Text className="mt-6 font-heading text-[17px] leading-[22px] text-black">
            {label}
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => (ref as any)?.current?.focus()}
          className={`mt-2 rounded-[8px] border ${error ? "border-red-500" : "border-[rgba(0,0,0,0.38)]"} px-[14px] py-[16.5px] flex-row items-center gap-[16px] bg-white`}
        >
          <MaterialIcons
            name="lock-outline"
            size={24}
            color={error ? "#ef4444" : "rgba(0,0,0,0.6)"}
          />
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.6)"
            className="flex-1 font-body text-[16px] text-typography-black"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
          />
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
        </TouchableOpacity>
      </>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
