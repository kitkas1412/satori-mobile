// API Response types

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
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
  weakPoints: { item: string; type: string }[];
  strongPoints: { item: string; type: string }[];
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
  enrolledClasses: unknown[];
}
