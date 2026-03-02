import { IProject } from "../../features/project/interfaces/IProject";
import { IQuiz } from "../storage/quizzesStorage";
import { loadProjects } from "../storage/projectsStorage";
import { loadQuizzes } from "../storage/quizzesStorage";
import { loadFlashcards } from "../storage/flashcardsStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";
import { AppDataSchema, AppData } from "../validation/appDataSchemas";

export function exportAppData(): AppData {
  const projects = loadProjects<IProject[]>(mockProjects);
  const quizzes = loadQuizzes();
  const flashcards = loadFlashcards();
  return { projects, quizzes, flashcards };
}

export function downloadJson(filename: string, data: unknown): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importAppData(file: File): Promise<AppData> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  const result = AppDataSchema.safeParse(parsed);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return `${path}: ${issue.message}`;
      })
      .join("; ");
    throw new Error(`Invalid app data: ${errors}`);
  }

  return result.data;
}
