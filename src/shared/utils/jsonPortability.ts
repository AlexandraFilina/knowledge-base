import { IProject } from "../../features/project/interfaces/IProject";
import { IQuiz } from "../storage/quizzesStorage";
import { loadProjects } from "../storage/projectsStorage";
import { loadQuizzes } from "../storage/quizzesStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";

export interface AppData {
  projects: IProject[];
  quizzes: IQuiz[];
}

export function exportAppData(): AppData {
  const projects = loadProjects<IProject[]>(mockProjects);
  const quizzes = loadQuizzes();
  return { projects, quizzes };
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
  const data = JSON.parse(text);

  if (!data || typeof data !== "object") {
    throw new Error("Invalid file format: expected an object");
  }

  if (!Array.isArray(data.projects)) {
    throw new Error("Invalid file format: 'projects' must be an array");
  }

  if (!Array.isArray(data.quizzes)) {
    throw new Error("Invalid file format: 'quizzes' must be an array");
  }

  return {
    projects: data.projects,
    quizzes: data.quizzes,
  };
}
