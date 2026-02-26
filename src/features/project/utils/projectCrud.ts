import type { IProject } from "../interfaces/IProject";

export function createProject(projects: IProject[], newProject: IProject): IProject[] {
  return [newProject, ...projects];
}

export function updateProject(projects: IProject[], updated: IProject): IProject[] {
  return projects.map((p) => (p.id === updated.id ? updated : p));
}

export function deleteProject(projects: IProject[], id: number): IProject[] {
  return projects.filter((p) => p.id !== id);
}

export function nextProjectId(projects: IProject[]): number {
  const maxId = projects.reduce((max, p) => (p.id > max ? p.id : max), 0);
  return maxId + 1;
}

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}
