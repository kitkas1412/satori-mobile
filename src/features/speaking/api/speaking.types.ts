export interface LessonSectionItem {
  id: string;
  title: string;
  titleJapanese: string;
  descriptionVi: string;
  category: string;
  jlptLevel: string;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
  topicCount: number;
}

export interface ConversationTopic {
  id: string;
  themeId: string;
  title: string;
  titleJapanese: string;
  category: string;
  jlptLevel: string;
  difficultyScore: number;
  isRoleplay: boolean;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
}

export interface PagedContent<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
