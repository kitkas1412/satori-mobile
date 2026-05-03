// Định nghĩa tất cả các kiểu dữ liệu (types & interfaces) dùng trong feature Speaking.
// Mỗi interface được đặt tên theo endpoint API tương ứng để dễ tra cứu.

/** Người gửi tin nhắn trong cuộc hội thoại */
export type Role = "ASSISTANT" | "USER";

/** Trạng thái lượt trong cuộc hội thoại:
 * - AI_TURN: đang phát audio/xử lý phía AI
 * - USER_TURN: người dùng có thể nói
 * - LOADING: đang chờ API trả về phản hồi
 */
export type TurnState = "AI_TURN" | "USER_TURN" | "LOADING";

/** Trạng thái hoàn thành của một nhiệm vụ (mission) */
export type MissionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/** Trạng thái luyện tập của một conversation */
export type PracticeStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

/** Trạng thái của một session hội thoại */
export type SessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

// GET: /learner/conversation/topics?page=0&size=10
/** Cấu trúc phân trang dùng chung cho các danh sách trả về từ API */
export interface TopicListResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

/** Một chủ đề lớn (topic/section) chứa nhiều conversation con */
export interface Topic {
  id: string;
  title: string;
  titleJapanese: string;
  descriptionVi: string;
  category: string;
  jlptLevel: string;
  thumbnailUrl: string | null;
  status: string;
  /** Thứ tự hiển thị trên màn hình */
  orderIndex: number;
  /** Số lượng topic thuộc chủ đề này */
  conversationCount: number;
}

// GET: /learner/conversation/topics/{{topicId}}/conversations
/** Một conversation hội thoại trong danh sách của một topic */
export interface ConversationResponse {
  id: string;
  topicId: string;
  title: string;
  titleJapanese: string;
  descriptionVi: string;
  category: string;
  jlptLevel: string;
  /** Điểm độ khó: 1 = Dễ, 2 = Trung Bình, 3+ = Khó */
  difficultyScore: number;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
  practiceCount: number;
  lastPracticedAt: string | null;
  practiceStatus: PracticeStatus;
  /** Người dùng đã luyện tập topic này chưa */
  practiced: boolean;
}

// GET: /learner/conversation/conversations/{{conversationId}}
/** Chi tiết đầy đủ của một conversation, bao gồm gợi ý từ vựng, ngữ pháp và danh sách nhiệm vụ */
export interface ConversationDetailResponse {
  id: string;
  topicId: string;
  topicName: string | null;
  courseId: string | null;
  courseName: string | null;
  title: string;
  titleJapanese: string;
  description: string;
  descriptionVi: string;
  scenario: string | null;
  /** JSON string chứa mảng từ vựng gợi ý, ví dụ: "[{\"word\":\"名前\",\"meaning\":\"name\",\"reading\":\"なまえ\"}]" */
  vocabularyHints: string | null;
  /** JSON string chứa mảng điểm ngữ pháp, ví dụ: "[\"～です\",\"～と申します\"]" */
  grammarPoints: string | null;
  /** JSON string chứa mảng biểu đạt hữu ích, ví dụ: "[\"はじめまして\"]" */
  usefulExpressions: string | null;
  category: string;
  jlptLevel: string;
  difficultyScore: number;
  aiRole: string | null;
  learnerRole: string | null;
  roleplayContext: string | null;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
  missions: Missions[] | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// POST: /learner/roleplay/free-talk/sessions
/** Tham số khởi tạo session hội thoại tự do (không theo topic) */
export interface FreeTalkSessionRequest {
  /** Cấp độ JLPT của người dùng, ví dụ: "N4", "N3" */
  jlptLevel: string;
  /** Ngôn ngữ UI, ví dụ: "vi", "en" */
  language: string;
}

// POST: /learner/roleplay/sessions
/** Dữ liệu session trả về khi khởi tạo thành công (cả guided và free-talk) */
export interface RoleplaySessionResponse {
  id: string;
  userId: string;
  conversationId: string;
  sessionType: string;
  status: SessionStatus;
  messageCount: number;
  userMessageCount: number;
  missionScore: number | null;
  pronunciationScore: number | null;
  languageScore: number | null;
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  messages: Messages[];
  missions: Missions[];
}

/** Một tin nhắn trong cuộc hội thoại (của AI hoặc người dùng) */
export interface Messages {
  id: string;
  sessionId: string;
  role: Role;
  /** Nội dung chính của tin nhắn */
  content: string;
  japaneseContent: string | null;
  japaneseWithFurigana: string | null;
  translation: string | null;
  romaji: string | null;
  /** URL file audio do AI tạo ra (nếu có) */
  audioUrl: string | null;
  /** Audio MP3 dạng base64 do AI tạo ra (nếu có) */
  audioBase64: string | null;
  /** URL file audio do người dùng ghi âm */
  userAudioUrl: string | null;
  correction: Correction[] | null;
  vocabularyUsed: VocabularyUsed[] | null;
  isHintRequest: boolean;
  sequenceNumber: number;
  createdAt: string;
  messageType: string;
  pronunciationScore: number | null;
}

/** Nhiệm vụ cần hoàn thành trong một topic hoặc session */
export interface Missions {
  id: string;
  title: string;
  titleJapanese: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  /** Lý do AI đánh giá trạng thái nhiệm vụ */
  aiReasoning: string | null;
  missionType: string;
  status: MissionStatus;
  /** Phần trăm hoàn thành (0–100) */
  progressPct: number;
}

export interface Correction {
  id: string;
  messageId: string;
}

export interface VocabularyUsed {
  id: string;
  messageId: string;
  word: string;
  meaning: string;
  jlptLevel: string;
}

// POST: /learner/roleplay/sessions/{{session_id}}/messages
/** Kết quả trả về sau khi gửi tin nhắn: bao gồm tin nhắn mới và cập nhật nhiệm vụ */
export interface SendMessageResponse {
  messages: Messages[];
  missions: Missions[];
  limitReached: boolean;
  allMissionsCompleted: boolean;
}

// POST: /learner/roleplay/sessions/{{session_id}}/complete
/** Một lỗi tiêu biểu được AI sửa trong session */
export interface TopCorrection {
  original: string;
  corrected: string;
  explanation: string;
  errorType: string;
  /** Mức độ nghiêm trọng, ví dụ: "MINOR" | "MAJOR" | "CRITICAL" */
  severity: string;
  /** Tác động đến khả năng người nghe hiểu được */
  comprehensibilityImpact: string;
  /** Lý do AI gán mức severity này */
  severityReasoning: string;
}

/** Kết quả độ chính xác ngôn ngữ sau session */
export interface AccuracyResult {
  score: number;
  totalCorrections: number;
  userMessageCount: number;
  /** Tỷ lệ lỗi dạng %, có thể null nếu không tính được */
  errorRate: number | null;
  errorBreakdown: Record<string, number>;
  feedback: string;
  /** Danh sách lỗi tiêu biểu cần lưu ý */
  topCorrections?: TopCorrection[];
  /** Tổng số mệnh đề người dùng tạo ra */
  totalClauses?: number;
  /** Số mệnh đề không có lỗi */
  cleanClauses?: number;
  /** Số mệnh đề có lỗi */
  dirtyClauses?: number;
  /** Phân bố theo mức độ nghiêm trọng, ví dụ: { MINOR: 2, MAJOR: 1 } */
  severityCounts?: Record<string, number>;
  /** Có lỗi giao tiếp nghiêm trọng (phá vỡ truyền đạt) hay không */
  hasCriticalCommunicationBreakdown?: boolean;
}

/** Một từ phát âm yếu được phát hiện qua nhiều lần xuất hiện */
export interface WeakWord {
  word: string;
  averageAccuracy: number;
  occurrences: number;
  dominantErrorType: string;
  errorTypeLabel: string;
  /** Mức độ ảnh hưởng tới điểm tổng (0-1 hoặc 0-100 tuỳ backend) */
  impact: number;
}

/** Một phoneme (âm vị) cần luyện tập thêm */
export interface WeakPhoneme {
  /** Ký hiệu IPA */
  ipa: string;
  label: string;
  averageScore: number;
  occurrences: number;
  /** Mức ưu tiên / tầng nhóm phoneme */
  tier: string;
  /** Gợi ý bài luyện tập */
  drill: string;
  impact: number;
}

/** Kết quả phát âm tổng hợp sau session */
export interface PronunciationResult {
  score: number;
  averageAccuracy: number;
  averageFluency: number;
  averageCompleteness: number;
  totalAssessed: number;
  feedback: string;
  /** Danh sách từ phát âm yếu */
  weakWords?: WeakWord[];
  /** Danh sách phoneme cần cải thiện */
  weakPhonemes?: WeakPhoneme[];
  /** Phiên không có lỗi phát âm đáng kể */
  cleanSession?: boolean;
  /** Phiên không có dữ liệu audio để chấm */
  noAudio?: boolean;
}

/** Kết quả hoàn thành nhiệm vụ sau session */
export interface TaskCompletionResult {
  score: number;
  completedMissions: number;
  totalMissions: number;
  details: MissionDetails[];
  feedback: string;
}

/** Chi tiết độ phức tạp từ vựng */
export interface LexicalComplexity {
  score: number;
  /** Độ dài trung bình kỳ vọng của từ */
  expectedL_avg: number;
  uniqueWords: number;
  /** Số từ thuộc vốn từ đã biết của người dùng */
  knownWords: number;
  /** Số từ chưa biết */
  unknownWords: number;
  jlptDistribution: Record<string, number>;
  /** Độ dài trung bình thực tế của từ */
  l_avg: number;
}

/** Chi tiết độ phức tạp cú pháp */
export interface SyntacticComplexity {
  score: number;
  /** Tổng số AS-units (đơn vị phân tích cú pháp) */
  totalAS_Units: number;
  totalClauses: number;
  /** Phân loại mệnh đề, ví dụ: { MAIN: 3, SUB: 1 } */
  clauseTypeBreakdown: Record<string, number>;
  /** Số từ trung bình mỗi AS-unit */
  w_per_U: number;
  /** Số mệnh đề trung bình mỗi AS-unit */
  c_per_U: number;
}

/** Kết quả độ phức tạp ngôn ngữ sau session */
export interface ComplexityResult {
  score: number;
  uniqueVocabularyCount: number;
  /** Phân bố theo cấp độ JLPT, ví dụ: { "N5": 3, "N4": 1 } */
  jlptDistribution: Record<string, number>;
  feedback: string;
  /** Phân tích từ vựng chi tiết */
  lexical?: LexicalComplexity;
  /** Phân tích cú pháp chi tiết */
  syntactic?: SyntacticComplexity;
  /** Kết quả chỉ đo được một phần */
  partialMeasurement?: boolean;
  /** Dữ liệu chưa đủ để đánh giá */
  insufficient?: boolean;
}

/** Đánh giá định tính tổng hợp sau session, bao gồm nhận xét chi tiết và bước tiếp theo */
export interface QualitativeSummary {
  overallAssessment: string;
  jlptEstimate: string;
  accuracyFeedback: string;
  pronunciationFeedback: string;
  taskCompletionFeedback: string;
  complexityFeedback: string;
  recurringWarning: string;
  nextSteps: string[];
}

/** Mẫu lỗi lặp lại qua nhiều session */
export interface RecurringPattern {
  errorType: string;
  totalOccurrences: number;
  sessionCount: number;
  totalSessionsChecked: number;
}

/** Kết quả tổng hợp sau khi hoàn thành session */
export interface FeedbackResultResponse {
  sessionId: string;
  accuracy: AccuracyResult;
  pronunciation: PronunciationResult;
  taskCompletion: TaskCompletionResult | null;
  complexity: ComplexityResult;
  qualitativeSummary: QualitativeSummary;
  recurringPatterns: RecurringPattern[];
  missionDetails: MissionDetails[];
  languageEvaluation: LanguageEvaluation | null;
  newBadgesEarned: BadgeEarned[];
  levelUp: LevelUp | null;
  streakNotification: StreakNotification | null;
}

/** Chi tiết kết quả của một nhiệm vụ sau khi session kết thúc */
export interface MissionDetails {
  title: string;
  titleVi: string;
  titleJapanese: string;
  status: string;
  progressPct: number;
  /** Giải thích của AI về lý do nhiệm vụ đạt/chưa đạt */
  reasoning: string;
}

/** Đánh giá ngôn ngữ tổng hợp của AI sau session, gồm 4 chỉ số và nhận xét */
export interface LanguageEvaluation {
  /** Điểm lưu loát (0–100) */
  fluencyScore: number;
  /** Điểm chính xác ngữ pháp (0–100) */
  accuracyScore: number;
  /** Điểm phong phú từ vựng (0–100) */
  vocabularyScore: number;
  /** Điểm sử dụng ngữ pháp (0–100) */
  grammarScore: number;
  /** Danh sách điểm mạnh AI ghi nhận */
  strengths: string[];
  /** Danh sách điểm cần cải thiện */
  improvements: string[];
  /** Nhận xét tổng hợp bằng văn bản */
  summary: string;
}

/** Loại huy hiệu */
export type BadgeType =
  | "LEARNING_STREAK"
  | "CONVERSATION_MASTER"
  | "PRONUNCIATION_EXPERT"
  | "VOCABULARY_BUILDER"
  | "GRAMMAR_GURU"
  | string;

/** Huy hiệu mới được trao sau khi hoàn thành session */
export interface BadgeEarned {
  badgeId: string;
  badgeName: string;
  description: string;
  badgeType: BadgeType;
  iconUrl: string;
  expReward: number;
  earnedAt: string;
  isFeatured: boolean;
}

/** Thông tin lên cấp sau khi hoàn thành session */
export interface LevelUp {
  previousLevel: number;
  newLevel: number;
  expEarned: number;
  oldTotalExp: number;
  totalExp: number;
  expToNextLevel: number;
  progressPercentage: number;
  isLevelUp: boolean;
}

/** Thông báo chuỗi ngày học sau khi hoàn thành session */
export interface StreakNotification {
  is_first_activity_today: boolean;
  current_streak: number;
  longest_streak: number;
  /** Định dạng YYYY-MM-DD */
  streak_last_date: string;
}
