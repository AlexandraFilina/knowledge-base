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
import { TabType } from "../../features/project/utils/types";
import { ProjectTabs } from "../../features/project/components/ProjectTabs";
import { OverviewTab } from "../../features/project/components/OverviewTab";
import { GoalsTab } from "../../features/project/components/GoalsTab";
import { KnowledgeTab } from "../../features/project/components/KnowledgeTab";
import { PracticeTab } from "../../features/project/components/PracticeTab";
import { generateId } from "../../shared/utils/id";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

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

  const handleDeleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter((q) => q.id !== quizId);
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
  };

  const handleUpdateQuiz = (updatedQuiz: IQuiz) => {
    const updatedQuizzes = quizzes.map((q) =>
      q.id === updatedQuiz.id ? updatedQuiz : q
    );
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
  };

  if (!projectId || !project) {
    return <NotFoundPage />;
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
              onUpdateQuiz={handleUpdateQuiz}
              onUpdateProject={handleUpdateProject}
              onDeleteQuiz={handleDeleteQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
}
