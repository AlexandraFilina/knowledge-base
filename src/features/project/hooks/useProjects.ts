import { useState, useEffect, useCallback } from "react";
import { IProject } from "../interfaces/IProject";
import { IProjectFormValues } from "../interfaces/IProjectFormValues";
import { mockProjects } from "../constants/mockProjects";
import { loadProjects, saveProjects } from "../../../shared/storage/projectsStorage";
import {
  createProject as createProjectHelper,
  updateProject as updateProjectHelper,
  deleteProject as deleteProjectHelper,
  nextProjectId,
  clampProgress,
} from "../utils/projectCrud";

export function useProjects() {
  const [projects, setProjects] = useState<IProject[]>(() =>
    loadProjects(mockProjects)
  );

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const createProject = useCallback(
    (data: IProjectFormValues) => {
      const newProject: IProject = {
        id: nextProjectId(projects),
        ...data,
        tags: data.tags,
        image: mockProjects[0]?.image || "",
        progress: clampProgress(data.progress),
      };
      setProjects((prev) => createProjectHelper(prev, newProject));
    },
    [projects]
  );

  const updateProject = useCallback(
    (id: number, data: IProjectFormValues) => {
      setProjects((prev) => {
        const existing = prev.find((p) => p.id === id);
        if (!existing) return prev;
        const updated: IProject = {
          ...existing,
          title: data.title,
          description: data.description,
          tags: data.tags,
          progress: clampProgress(data.progress),
        };
        return updateProjectHelper(prev, updated);
      });
    },
    []
  );

  const deleteProject = useCallback((id: number) => {
    setProjects((prev) => deleteProjectHelper(prev, id));
  }, []);

  const refreshProjects = useCallback(() => {
    setProjects(loadProjects(mockProjects));
  }, []);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
}
