import { IProject } from "../interfaces/IProject";
import { mockProjects } from "../constants/mockProjects";

const STORAGE_KEY = "projects.v1";

function isValidProject(item: unknown): item is IProject {
  if (!item || typeof item !== "object") return false;
  const proj = item as Record<string, unknown>;
  return (
    typeof proj.id === "number" &&
    typeof proj.title === "string" &&
    typeof proj.description === "string"
  );
}

export function loadProjects(): IProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockProjects;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return mockProjects;
    if (!parsed.every(isValidProject)) return mockProjects;
    return parsed;
  } catch {
    return mockProjects;
  }
}

export function saveProjects(projects: IProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    console.warn("Failed to save projects to localStorage");
  }
}

export function updateProject(updated: IProject): void {
  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    projects[index] = updated;
    saveProjects(projects);
  }
}
