// Component hiển thị một câu hỏi trong bài trắc nghiệm.
// Hỗ trợ hai loại câu hỏi: trắc nghiệm (multiple_choice / true_false) và điền vào chỗ trống (fill_blank).

import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";
import { MarkdownText } from "@/components/ui";
import type { Question, Option } from "../api";

// Component một lựa chọn trong câu trắc nghiệm.
// Thay đổi màu nền và viền khi được chọn.
function OptionButton({
  option,
  label,
  selected,
  onPress,
  theme,
}: {
  option: Option;
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: (typeof Colors)["light"];
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl p-4"
      style={{
        borderWidth: 1,
        borderColor: selected ? theme.brand.primary : theme.border.subtle,
        backgroundColor: selected
          ? theme.brand.primary
          : theme.background.surface,
      }}
    >
      {/* Vòng tròn nhãn (A, B, C... hoặc ○/×) */}
      <View
        className="items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: selected ? theme.icon.onBrand : theme.border.default,
          backgroundColor: selected
            ? theme.brand.primary
            : theme.background.surface,
        }}
      >
        <Text
          className="font-heading text-sm text-center"
          style={{ color: selected ? theme.text.onBrand : theme.text.primary }}
        >
          {label}
        </Text>
      </View>
      <MarkdownText
        fontSize={16}
        color={selected ? theme.text.onBrand : theme.text.disabled}
        containerStyle={{ flex: 1 }}
      >
        {option.text}
      </MarkdownText>
    </Pressable>
  );
}

interface QuestionViewProps {
  question: Question;
  selectedOptionId: string | undefined;
  fillBlankAnswer: string | undefined;
  onSelectOption: (optionId: string) => void;
  onFillBlankChange: (text: string) => void;
  theme: (typeof Colors)["light"];
}

export function QuestionView({
  question,
  selectedOptionId,
  fillBlankAnswer,
  onSelectOption,
  onFillBlankChange,
  theme,
}: QuestionViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 16,
      }}
    >
      {/* Thẻ câu hỏi */}
      <View
        className="rounded-2xl p-5 mb-6"
        style={{
          backgroundColor: theme.background.surface,
          shadowColor: theme.border.strong,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <MarkdownText
          fontSize={18}
          fontFamily="Nunito_700Bold"
          color={theme.text.primary}
        >
          {question.questionText}
        </MarkdownText>
      </View>

      {/* Khu vực trả lời: ô nhập text (fill_blank) hoặc danh sách lựa chọn */}
      {question.questionType === "fill_blank" ? (
        <TextInput
          value={fillBlankAnswer ?? ""}
          onChangeText={onFillBlankChange}
          placeholder="Nhập câu trả lời..."
          placeholderTextColor={theme.text.tertiary}
          className="font-body text-base rounded-xl p-4"
          style={{
            borderWidth: 1,
            borderColor: fillBlankAnswer
              ? theme.brand.primary
              : theme.border.subtle,
            backgroundColor: fillBlankAnswer
              ? theme.background.surface
              : theme.brand.primary,
            color: theme.background.surface,
          }}
        />
      ) : (
        <View className="gap-3">
          {(question.options ?? []).map((option) => {
            // Câu đúng/sai (true_false): dùng ký hiệu ○ (đúng) và × (sai) thay vì id dạng chữ.
            // Các câu khác: dùng id trực tiếp làm nhãn (thường là A, B, C, D).
            const label =
              option.id === "TRUE" || option.id === "FALSE"
                ? option.id === "TRUE"
                  ? "○"
                  : "×"
                : option.id;
            return (
              <OptionButton
                key={option.id}
                option={option}
                label={label}
                selected={selectedOptionId === option.id}
                // Nhấn lại lựa chọn đang chọn sẽ bỏ chọn (truyền chuỗi rỗng)
                onPress={() =>
                  onSelectOption(
                    selectedOptionId === option.id ? "" : option.id,
                  )
                }
                theme={theme}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
