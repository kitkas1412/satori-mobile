// Component hiển thị một câu hỏi trong bài trắc nghiệm.
// Hỗ trợ hai loại câu hỏi: trắc nghiệm (multiple_choice / true_false) và điền vào chỗ trống (fill_blank).

import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";
import { MarkdownText, ProgressBar } from "@/components/ui";
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
      className="flex-row items-center gap-4 rounded-xl p-4 bg-background-surface"
      style={{
        borderWidth: selected ? 2 : 1.5,
        borderColor: selected ? theme.primary : theme.border,
        backgroundColor: selected ? theme.primary : theme.white,
      }}
    >
      {/* Vòng tròn nhãn (A, B, C... hoặc ○/×) */}
      <View
        className="items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: selected ? 2 : 1.5,
          borderColor: selected ? theme.white : theme.border,
          backgroundColor: selected ? theme.primary : theme.white,
        }}
      >
        <Text
          className="font-heading text-sm text-center"
          style={{ color: selected ? theme.white : theme.textMuted }}
        >
          {label}
        </Text>
      </View>
      <MarkdownText
        fontSize={16}
        color={selected ? theme.white : theme.textMuted}
        containerStyle={{ flex: 1 }}
      >
        {option.text}
      </MarkdownText>
    </Pressable>
  );
}

interface QuestionViewProps {
  question: Question;
  index: number;
  total: number;
  selectedOptionId: string | undefined;
  fillBlankAnswer: string | undefined;
  onSelectOption: (optionId: string) => void;
  onFillBlankChange: (text: string) => void;
  theme: (typeof Colors)["light"];
}

export function QuestionView({
  question,
  index,
  total,
  selectedOptionId,
  fillBlankAnswer,
  onSelectOption,
  onFillBlankChange,
  theme,
}: QuestionViewProps) {
  // Tiến độ tính theo số câu đã xem (index + 1 trên tổng số)
  const progress = (index + 1) / total;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 16,
      }}
    >
      {/* Bộ đếm câu hỏi: hiển thị "問題" (mondai) và số thứ tự */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="font-heading text-sm"
          style={{ color: theme.textMuted }}
        >
          問題
        </Text>
        <Text
          className="font-heading text-sm"
          style={{ color: theme.textMuted }}
        >
          {index + 1}/{total}
        </Text>
      </View>

      {/* Thanh tiến độ */}
      <View className="mb-6">
        <ProgressBar progress={progress} />
      </View>

      {/* Thẻ câu hỏi */}
      <View
        className="bg-background-surface rounded-2xl p-5 mb-6"
        style={{
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <MarkdownText
          fontSize={18}
          fontFamily="Nunito_700Bold"
          color={theme.textDefault}
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
          placeholderTextColor={theme.textMuted}
          className="font-body text-base rounded-xl p-4"
          style={{
            borderWidth: 1.5,
            borderColor: fillBlankAnswer ? theme.primary : theme.border,
            backgroundColor: fillBlankAnswer ? theme.primary : theme.white,
            color: theme.textDefault,
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
