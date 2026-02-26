import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import {
  loadProjects,
  saveProjects,
} from "../../features/project/utils/projectsStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";
import {
  IQuiz,
  loadQuizzes,
  saveQuizzes,
} from "../../features/project/utils/quizzesStorage";
import { TabType } from "../../features/project/pages/project-page/types";
import { ProjectTabs } from "../../features/project/pages/project-page/ProjectTabs";
import { OverviewTab } from "../../features/project/pages/project-page/OverviewTab";
import { GoalsTab } from "../../features/project/pages/project-page/GoalsTab";
import { KnowledgeTab } from "../../features/project/pages/project-page/KnowledgeTab";
import { PracticeTab } from "../../features/project/pages/project-page/PracticeTab";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = useMemo(() => {
    const parsed = parseInt(id || "", 10);
    return isNaN(parsed) ? null : parsed;
  }, [id]);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [projects, setProjects] = useState<IProject[]>(() =>
    loadProjects(mockProjects)
  );
  const [project, setProject] = useState<IProject | undefined>(() =>
    projects.find((p) => p.id === projectId)
  );
  const [quizzes, setQuizzes] = useState<IQuiz[]>(() => loadQuizzes());

  useEffect(() => {
    const loaded = loadProjects(mockProjects);
    setProjects(loaded);
    setProject(loaded.find((p) => p.id === projectId));
  }, [projectId]);

  useEffect(() => {
    if (project) {
      const updated = projects.map((p) => (p.id === project.id ? project : p));
      const existingIndex = projects.findIndex((p) => p.id === project.id);
      if (existingIndex === -1) {
        setProjects([project, ...projects]);
      } else {
        saveProjects(updated);
      }
    }
  }, [project]);

  const handleUpdateProject = (updatedProject: IProject) => {
    setProject(updatedProject);
    const updated = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updated);
    saveProjects(updated);
  };

  const handleAddQuiz = (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => {
    if (!projectId) return;
    const newQuiz: IQuiz = {
      id: generateId(),
      projectId,
      title,
      question,
      options,
      correctIndex,
    };
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
  };

  if (!projectId) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Invalid Project ID
        </h1>
        <Link
          to="/projects"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Project not found
        </h1>
        <Link
          to="/projects"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition"
      >
        ← Back to Projects
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover"
          src={project.image}
          alt={project.title}
        />

        <div className="border-b border-gray-200">
          <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="p-8">
          {activeTab === "overview" && <OverviewTab project={project} />}

          {activeTab === "goals" && (
            <GoalsTab project={project} onUpdateProject={handleUpdateProject} />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeTab
              project={project}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "practice" && (
            <PracticeTab
              projectId={projectId}
              quizzes={quizzes}
              onCreateQuiz={handleAddQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
}
