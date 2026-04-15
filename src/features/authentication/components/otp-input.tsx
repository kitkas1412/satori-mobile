import { Colors } from "@/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  value?: string;
  onChangeText?: (otp: string) => void;
  autoFocus?: boolean;
  theme: typeof Colors["light"];
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  value = "",
  onChangeText,
  autoFocus = false,
  theme,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill("")),
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      hiddenInputRef.current?.focus();
    }
  }, [autoFocus]);

  // Calculate which box should show the cursor
  const activeIndex = otp.join("").length;

  // Handle paste and typing from hidden input
  const handlePasteOrType = (text: string) => {
    // Remove non-numeric characters (letters, spaces, dashes, etc.)
    const cleanedText = text.replace(/[^0-9]/g, "");

    // Truncate if longer than length
    const truncatedText = cleanedText.slice(0, length);

    // Split into array and fill remaining with empty strings
    const digits = truncatedText.split("");
    const newOtp = [
      ...digits,
      ...Array(Math.max(0, length - digits.length)).fill(""),
    ];

    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChangeText?.(otpString);

    // Call onComplete when all digits are filled
    if (truncatedText.length === length) {
      onComplete?.(truncatedText);
    }
  };

  const handleKeyPress = (e: any) => {
    // Handle backspace navigation
    if (e.nativeEvent.key === "Backspace") {
      const currentValue = otp.join("");
      if (currentValue.length > 0) {
        const newOtp = [...otp];
        const lastFilledIndex = currentValue.length - 1;
        newOtp[lastFilledIndex] = "";
        setOtp(newOtp);
        onChangeText?.(newOtp.join(""));
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View className="relative">
      {/* Visual OTP boxes */}
      <View className="flex-row gap-[12px] justify-center">
        {Array.from({ length }).map((_, index) => {
          const isActive = isFocused && index === activeIndex;
          const hasValue = otp[index];

          return (
            <View
              key={index}
              className="w-12 h-14 border-[1.85px] rounded-lg items-center justify-center"
              style={{
                backgroundColor: theme.background.surface,
                borderColor: isActive || hasValue ? theme.border.brand : theme.border.subtle,
              }}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className="text-center text-lg font-heading w-full h-full"
                value={otp[index]}
                editable={false}
                pointerEvents="none"
              />
              {/* Show cursor indicator for active box */}
              {isActive && !hasValue && (
                <View className="absolute w-[2px] h-6" style={{ backgroundColor: theme.brand.primary }} />
              )}
            </View>
          );
        })}
      </View>

      {/* Transparent overlay input for paste functionality and SMS autofill */}
      <TextInput
        ref={hiddenInputRef}
        value={otp.join("")}
        onChangeText={handlePasteOrType}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={length}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        caretHidden
        contextMenuHidden={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
        }}
      />
    </View>
  );
};
