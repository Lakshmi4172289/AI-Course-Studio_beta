export interface ExternalLink {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  videoId_1: string; // YouTube ID
  videoId_2: string; // YouTube ID
  content_md: string;
  external_links: ExternalLink[];
  quiz: QuizQuestion[];
  isCompleted: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  totalChapters: number;
  completedChapters: number;
  chapters: Chapter[];
  createdAt: Date;
}

export interface UserReview {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}
