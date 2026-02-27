export interface QuizAttempt {
  id: string;
  quizId: string;
  projectId: number;
  score: number;
  createdAt: string;
}

const STORAGE_KEY = "quizAttempts.v1";

export function loadQuizAttempts(): QuizAttempt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveQuizAttempts(attempts: QuizAttempt[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}
