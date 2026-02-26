export interface IQuiz {
  id: string;
  projectId: number;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const STORAGE_KEY = "quizzes.v1";

function isValidQuiz(item: unknown): item is IQuiz {
  if (!item || typeof item !== "object") return false;
  const quiz = item as Record<string, unknown>;
  return (
    typeof quiz.id === "string" &&
    typeof quiz.projectId === "number" &&
    typeof quiz.title === "string" &&
    typeof quiz.question === "string" &&
    Array.isArray(quiz.options) &&
    typeof quiz.correctIndex === "number"
  );
}

export function loadQuizzes(): IQuiz[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      const valid = parsed.filter(isValidQuiz);
      return valid;
    }
  } catch {
    console.warn("Failed to load quizzes from localStorage");
  }
  return [];
}

export function saveQuizzes(quizzes: IQuiz[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.warn("Failed to save quizzes to localStorage");
  }
}

export function upsertQuiz(quiz: IQuiz): void {
  const quizzes = loadQuizzes();
  const index = quizzes.findIndex((q) => q.id === quiz.id);
  if (index !== -1) {
    quizzes[index] = quiz;
  } else {
    quizzes.push(quiz);
  }
  saveQuizzes(quizzes);
}

export function deleteQuiz(id: string): void {
  const quizzes = loadQuizzes();
  const filtered = quizzes.filter((q) => q.id !== id);
  saveQuizzes(filtered);
}
