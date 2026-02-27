import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import {
  loadProjects,
  saveProjects,
} from "../../shared/storage/projectsStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";
import {
  IQuiz,
  loadQuizzes,
  saveQuizzes,
} from "../../shared/storage/quizzesStorage";
import { TabType } from "../../features/project/pages/project-page/types";
import { ProjectTabs } from "../../features/project/pages/project-page/ProjectTabs";
import { OverviewTab } from "../../features/project/pages/project-page/OverviewTab";
import { GoalsTab } from "../../features/project/pages/project-page/GoalsTab";
import { KnowledgeTab } from "../../features/project/pages/project-page/KnowledgeTab";
import { PracticeTab } from "../../features/project/pages/project-page/PracticeTab";
import { generateId } from "../../shared/utils/id";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const parsed = Number.parseInt(id ?? "", 10);
  const projectId = Number.isNaN(parsed) ? null : parsed;

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [projects, setProjects] = useState<IProject[]>(() =>
    loadProjects(mockProjects)
  );
  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );
  const [quizzes, setQuizzes] = useState<IQuiz[]>(() => loadQuizzes());

  useEffect(() => {
    const loaded = loadProjects(mockProjects);
    setProjects(loaded);
  }, [projectId]);

  const handleUpdateProject = (updatedProject: IProject) => {
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      saveProjects(updated);
      return updated;
    });
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
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-2xl font-medium transition shadow-sm inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-stone-600 mb-4">
          Project not found
        </h1>
        <Link
          to="/projects"
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-2xl font-medium transition shadow-sm inline-block"
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
        className="inline-flex items-center gap-2 text-rose-700 hover:text-rose-800 mb-6 font-medium transition"
      >
        ← Back to Projects
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <img
          className="w-full h-64 object-cover"
          src={project.image}
          alt={project.title}
        />

        <div className="border-b border-stone-200">
          <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="p-8">
          {activeTab === "overview" && (
            <OverviewTab
              project={project}
              projectId={projectId}
              quizzes={quizzes}
            />
          )}

          {activeTab === "goals" && (
            <GoalsTab
              project={project}
              quizzes={quizzes}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeTab
              project={project}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "practice" && (
            <PracticeTab
              project={project}
              quizzes={quizzes}
              onCreateQuiz={handleAddQuiz}
              onUpdateProject={handleUpdateProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
