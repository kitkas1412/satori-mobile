// Định nghĩa các kiểu dữ liệu dùng trong feature Chatbot.

// POST: /learner/curriculum-chat/sessions
/** Tham số khởi tạo phiên chat với AI theo chương trình học */

export interface CreateChatSessionRequest {
  courseId: string;
  jlptLevel: string;
}

/** Trạng thái của một phiên chat */
export type ChatSessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

/** Dữ liệu phiên chat trả về khi khởi tạo thành công */
export interface ChatSessionResponse {
  sessionId: string;
  status: ChatSessionStatus;
  courseId: string;
  lessonId: string | null;
  jlptLevel: string;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string | null;
}

// POST: /learner/curriculum-chat/sessions/{sessionId}/messages
/** Tham số gửi tin nhắn trong phiên chat */
export interface SendMessageRequest {
  message: string;
}

/** Dữ liệu phản hồi khi gửi tin nhắn thành công */
export interface SendMessageResponse {
  sessionId: string;
  messageId: string;
  content: string;
  sources: any[];
  noContextFound: boolean;
  timestamp: string;
}
