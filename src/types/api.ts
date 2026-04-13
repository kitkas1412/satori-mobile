// API Response types

export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
}

export interface SkillPoint {
  category: string | null;
  skill: string | null;
  description: string | null;
  confidence: number;
  source: string | null;
  jlptLevel: string | null;
  relatedEntityIds: string[] | null;
  lastUpdated: string | null;
}

export interface LearningPreferences {
  targetJlptLevel: string;
  dailyStudyGoalMinutes: number;
  preferredStudyTime: string | null;
  preferredTopics: string[];
  learningPace: string | null;
  preferredFormality: string | null;
  conversationStyle: string | null;
  streakReminderEnabled: boolean;
  reminderTime: string | null;
  weakPoints: SkillPoint[];
  strongPoints: SkillPoint[];
  skillScores: unknown[];
}

export interface EnrolledClass {
  classId: string;
  className: string;
  classCode: string | null;
  courseId: string;
  courseName: string;
  jlptLevel: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  role: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  fullName: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  role: string;
  status: string;
  authProvider: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  learningPreferences: LearningPreferences | null;
  enrolledClasses: EnrolledClass[];
}
