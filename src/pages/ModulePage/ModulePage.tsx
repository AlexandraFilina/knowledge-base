import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  IProject,
  IModule,
  IModuleKnowledgeItem,
  ISubGoal,
} from "../../features/project/interfaces/IProject";
import {
  loadProjects,
  saveProjects,
} from "../../shared/storage/projectsStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";
import { generateId } from "../../shared/utils/id";
import {
  IQuiz,
  loadQuizzes,
  upsertQuiz,
  deleteQuiz,
} from "../../shared/storage/quizzesStorage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

type KnowledgeType = "article" | "video" | "note";

export default function ModulePage() {
  const { projectId, moduleId } = useParams<{
    projectId: string;
    moduleId: string;
  }>();
  const parsedProjectId = Number.parseInt(projectId ?? "", 10);
  const projectIdNum = Number.isNaN(parsedProjectId) ? null : parsedProjectId;

  const [projects, setProjects] = useState<IProject[]>(() =>
    loadProjects(mockProjects)
  );

  const project = useMemo(
    () => projects.find((p) => p.id === projectIdNum),
    [projects, projectIdNum]
  );

  const module = useMemo(() => {
    if (!project) return null;
    return project.modules?.find((m) => m.id === moduleId) || null;
  }, [project, moduleId]);

  useEffect(() => {
    const loaded = loadProjects(mockProjects);
    setProjects(loaded);
  }, [projectId]);

  const handleUpdateModule = (updatedModule: IModule) => {
    if (!project) return;
    const updatedModules = project.modules?.map((m) =>
      m.id === updatedModule.id ? updatedModule : m
    );
    const updatedProject = { ...project, modules: updatedModules };
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      saveProjects(updated);
      return updated;
    });
  };

  const handleToggleGoal = (goalId: string) => {
    if (!module) return;
    const updatedGoals = module.goals.map((g) =>
      g.id === goalId ? { ...g, done: !g.done } : g
    );
    handleUpdateModule({ ...module, goals: updatedGoals });
  };

  const handleAddGoal = (title: string) => {
    if (!module) return;
    const newGoal: ISubGoal = { id: generateId(), title, done: false };
    handleUpdateModule({ ...module, goals: [...module.goals, newGoal] });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!module) return;
    const updatedGoals = module.goals.filter((g) => g.id !== goalId);
    handleUpdateModule({ ...module, goals: updatedGoals });
  };

  const handleAddKnowledge = (
    title: string,
    type: KnowledgeType,
    url?: string,
    content?: string
  ) => {
    if (!module) return;
    const knowledge = module.knowledge || [];
    const newItem: IModuleKnowledgeItem = {
      id: generateId(),
      title,
      type,
      url,
      content,
      createdAt: new Date().toISOString(),
    };
    handleUpdateModule({ ...module, knowledge: [...knowledge, newItem] });
  };

  const handleDeleteKnowledge = (knowledgeId: string) => {
    if (!module) return;
    const knowledge = (module.knowledge || []).filter(
      (k) => k.id !== knowledgeId
    );
    handleUpdateModule({ ...module, knowledge });
  };

  const [quizzes, setQuizzes] = useState<IQuiz[]>(() => loadQuizzes());
  const [showQuizForm, setShowQuizForm] = useState(false);

  useEffect(() => {
    setQuizzes(loadQuizzes());
  }, [projectId, moduleId]);

  const handleCreateQuiz = (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => {
    if (!projectIdNum || !moduleId) return;
    const newQuiz: IQuiz = {
      id: generateId(),
      projectId: projectIdNum,
      moduleId,
      title,
      question,
      options,
      correctIndex,
    };
    upsertQuiz(newQuiz);
    setQuizzes(loadQuizzes());
    setShowQuizForm(false);
  };

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz(quizId);
    setQuizzes(loadQuizzes());
  };

  const moduleQuizzes = quizzes.filter(
    (q) => q.projectId === projectIdNum && q.moduleId === moduleId
  );

  if (!projectIdNum || !moduleId || !project || !module) {
    return <NotFoundPage />;
  }

  const knowledge = module.knowledge || [];

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-rose-700 hover:text-rose-800 mb-6 font-medium transition"
      >
        ← Back to Project
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">
            {module.title}
          </h1>
          {module.description && (
            <p className="text-stone-600 mb-8 text-lg">{module.description}</p>
          )}

          <GoalsSection
            goals={module.goals}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />

          <KnowledgeSection
            knowledge={knowledge}
            onAddKnowledge={handleAddKnowledge}
            onDeleteKnowledge={handleDeleteKnowledge}
          />

          <ModulePracticeSection
            quizzes={moduleQuizzes}
            showQuizForm={showQuizForm}
            onToggleQuizForm={() => setShowQuizForm(!showQuizForm)}
            onCreateQuiz={handleCreateQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        </div>
      </div>
    </div>
  );
}

interface GoalsSectionProps {
  goals: ISubGoal[];
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (title: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

function GoalsSection({
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}: GoalsSectionProps) {
  const [newGoalTitle, setNewGoalTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      onAddGoal(newGoalTitle.trim());
      setNewGoalTitle("");
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-stone-900 mb-4">Goals</h2>

      {goals.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={goal.done}
                onChange={() => onToggleGoal(goal.id)}
                className="w-5 h-5 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
              />
              <span
                className={`flex-1 ${
                  goal.done ? "line-through text-stone-400" : "text-stone-700"
                }`}
              >
                {goal.title}
              </span>
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="text-stone-400 hover:text-rose-600 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-stone-500">No goals yet.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          placeholder="Add a new goal..."
          className="flex-1 px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newGoalTitle.trim()}
          className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
}

interface KnowledgeSectionProps {
  knowledge: IModuleKnowledgeItem[];
  onAddKnowledge: (
    title: string,
    type: KnowledgeType,
    url?: string,
    content?: string
  ) => void;
  onDeleteKnowledge: (knowledgeId: string) => void;
}

function KnowledgeSection({
  knowledge,
  onAddKnowledge,
  onDeleteKnowledge,
}: KnowledgeSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<KnowledgeType>("article");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddKnowledge(title.trim(), type, url || undefined, content || undefined);
    setTitle("");
    setType("article");
    setUrl("");
    setContent("");
    setShowForm(false);
  };

  const typeColors = {
    article: "bg-stone-200 text-stone-700",
    video: "bg-rose-100 text-rose-700",
    note: "bg-amber-100 text-amber-700",
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Knowledge</h2>

      {knowledge.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {knowledge.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg"
            >
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  typeColors[item.type]
                }`}
              >
                {item.type}
              </span>
              <span className="flex-1 text-stone-700">{item.title}</span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-800 text-sm"
                >
                  Link
                </a>
              )}
              <span className="text-stone-400 text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => onDeleteKnowledge(item.id)}
                className="text-stone-400 hover:text-rose-600 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-stone-500">No knowledge items yet.</p>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition font-medium"
        >
          Add Knowledge
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-stone-50 border border-stone-200 rounded-lg p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as KnowledgeType)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                URL (optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Content (optional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface ModulePracticeSectionProps {
  quizzes: IQuiz[];
  showQuizForm: boolean;
  onToggleQuizForm: () => void;
  onCreateQuiz: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onDeleteQuiz: (quizId: string) => void;
}

function ModulePracticeSection({
  quizzes,
  showQuizForm,
  onToggleQuizForm,
  onCreateQuiz,
  onDeleteQuiz,
}: ModulePracticeSectionProps) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && question.trim() && options.every((opt) => opt.trim())) {
      onCreateQuiz(
        title.trim(),
        question.trim(),
        options.map((o) => o.trim()),
        correctIndex
      );
      setTitle("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-stone-900 mb-4">Module Practice</h2>

      {showQuizForm ? (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-stone-50 rounded-lg space-y-3 mb-4"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz title (required)"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            autoFocus
          />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question (required)"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-600">Options:</p>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctIndex"
                  checked={correctIndex === index}
                  onChange={() => setCorrectIndex(index)}
                  className="w-4 h-4 text-rose-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1} (required)`}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-500">
            Select the correct answer using the radio button
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
            >
              Save Quiz
            </button>
            <button
              type="button"
              onClick={onToggleQuizForm}
              className="px-4 py-2 bg-stone-300 hover:bg-stone-400 text-stone-700 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={onToggleQuizForm}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition mb-4"
        >
          Create Quiz
        </button>
      )}

      {quizzes.length === 0 ? (
        <p className="text-stone-500">No module quizzes yet</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="p-3 bg-stone-50 rounded-lg text-stone-700 flex justify-between items-center"
            >
              <span className="font-medium">{quiz.title}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDeleteQuiz(quiz.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete quiz"
                >
                  ✕
                </button>
                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition">
                  Start
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
