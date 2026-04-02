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

// GET: /learner/conversation/themes?page=0&size=10
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
  topicCount: number;
}

// GET: /learner/conversation/themes/{{theme_id}}/topics
/** Một conversation hội thoại trong danh sách của một topic */
export interface ConversationResponse {
  id: string;
  themeId: string;
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

// GET: /learner/conversation/topics/{{topic_id}}
/** Chi tiết đầy đủ của một conversation, bao gồm gợi ý từ vựng, ngữ pháp và danh sách nhiệm vụ */
export interface ConversationDetailResponse {
  id: string;
  themeId: string;
  themeName: string | null;
  courseId: string | null;
  courseName: string | null;
  title: string;
  titleJapanese: string;
  description: string;
  descriptionVi: string;
  scenario: string | null;
  vocabularyHints: string[] | null;
  grammarPoints: string[] | null;
  usefulExpressions: string[] | null;
  category: string;
  jlptLevel: string;
  difficultyScore: number;
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
  topicId: string;
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
  translation: string | null;
  romaji: string | null;
  /** URL file audio do AI tạo ra (nếu có) */
  audioUrl: string | null;
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
}

// POST: /learner/roleplay/sessions/{{session_id}}/complete
/** Kết quả tổng hợp sau khi hoàn thành session: điểm số và đánh giá chi tiết */
export interface FeedbackResultResponse {
  sessionId: string;
  missionScore: number | null;
  pronunciationScore: number | null;
  languageScore: number | null;
  overallScore: number | null;
  missionDetails: MissionDetails[];
  pronunciationSummary: string | null;
  languageEvaluation: LanguageEvaluation | null;
}

/** Chi tiết kết quả của một nhiệm vụ sau khi session kết thúc */
export interface MissionDetails {
  title: string;
  titleVi: string;
  titleJapanese: string;
  status: MissionStatus;
  progressPct: number;
  /** Giải thích của AI về lý do nhiệm vụ đạt/chưa đạt */
  reasoning: string | null;
}

/** Đánh giá ngôn ngữ tổng hợp của AI sau session, gồm 4 chỉ số và nhận xét */
export interface LanguageEvaluation {
  /** Điểm lưu loát (0–100) */
  fluencyScore: number | null;
  /** Điểm chính xác ngữ pháp (0–100) */
  accuracyScore: number | null;
  /** Điểm phong phú từ vựng (0–100) */
  vocabularyScore: number | null;
  /** Điểm sử dụng ngữ pháp (0–100) */
  grammarScore: number | null;
  /** Danh sách điểm mạnh AI ghi nhận */
  strengths: string[];
  /** Danh sách điểm cần cải thiện */
  improvements: string[];
  /** Nhận xét tổng hợp bằng văn bản */
  summary: string | null;
}
