import { IProject } from "../../features/project/interfaces/IProject";
import { mockProjects } from "../../features/project/constants/mockProjects";

export const PROJECTS_KEY = "projects.v1";

export function loadProjects<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveProjects<T>(data: T): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(data));
}

export function upsertProject(project: IProject): void {
  const projects = loadProjects<IProject[]>(mockProjects);
  const index = projects.findIndex((p) => p.id === project.id);
  if (index !== -1) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }
  saveProjects(projects);
}

export function deleteProject(id: number): void {
  const projects = loadProjects<IProject[]>(mockProjects);
  const filtered = projects.filter((p) => p.id !== id);
  saveProjects(filtered);
}
