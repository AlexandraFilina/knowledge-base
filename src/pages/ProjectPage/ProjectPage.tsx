import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import {
  IProject,
  ISubGoal,
  IKnowledgeItem,
} from "../../features/project/interfaces/IProject";
import {
  loadProjects,
  saveProjects,
} from "../../features/project/utils/projectsStorage";

type TabType = "overview" | "goals" | "knowledge";

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
  const [projects, setProjects] = useState<IProject[]>(() => loadProjects());
  const [project, setProject] = useState<IProject | undefined>(() =>
    projects.find((p) => p.id === projectId)
  );

  useEffect(() => {
    const loaded = loadProjects();
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

  const handleToggleSubGoal = (subGoalId: string) => {
    if (!project) return;
    const subGoals =
      project.subGoals?.map((sg) =>
        sg.id === subGoalId ? { ...sg, done: !sg.done } : sg
      ) || [];
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    setProject({ ...project, subGoals, progress: newProgress });
  };

  const handleAddSubGoal = (title: string) => {
    if (!project) return;
    const newSubGoal: ISubGoal = { id: generateId(), title, done: false };
    const subGoals = [...(project.subGoals || []), newSubGoal];
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    setProject({ ...project, subGoals, progress: newProgress });
  };

  const handleDeleteSubGoal = (subGoalId: string) => {
    if (!project) return;
    const subGoals = (project.subGoals || []).filter(
      (sg) => sg.id !== subGoalId
    );
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    setProject({ ...project, subGoals, progress: newProgress });
  };

  const handleAddKnowledge = (
    title: string,
    type: "article" | "video" | "note",
    url?: string
  ) => {
    if (!project) return;
    const newKnowledge: IKnowledgeItem = { id: generateId(), title, type, url };
    const knowledge = [...(project.knowledge || []), newKnowledge];
    setProject({ ...project, knowledge });
  };

  const handleDeleteKnowledge = (knowledgeId: string) => {
    if (!project) return;
    const knowledge = (project.knowledge || []).filter(
      (k) => k.id !== knowledgeId
    );
    setProject({ ...project, knowledge });
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

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "goals", label: "Goals" },
    { key: "knowledge", label: "Knowledge" },
  ];

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
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === "overview" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>

              <p className="text-gray-700 text-lg mb-6">
                {project.description}
              </p>

              {project.goal && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-sm font-semibold text-indigo-800 mb-1">
                    Goal
                  </h3>
                  <p className="text-gray-700">{project.goal}</p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                         bg-slate-100 text-slate-600 border border-slate-200 
                         cursor-default select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Goals</h2>

              {project.subGoals && project.subGoals.length > 0 ? (
                <ul className="space-y-3 mb-6">
                  {project.subGoals.map((subGoal) => (
                    <li
                      key={subGoal.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={subGoal.done}
                        onChange={() => handleToggleSubGoal(subGoal.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`flex-1 ${
                          subGoal.done
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {subGoal.title}
                      </span>
                      <button
                        onClick={() => handleDeleteSubGoal(subGoal.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mb-6">
                  No goals yet. Add your first goal below.
                </p>
              )}

              <AddSubGoalForm onAdd={handleAddSubGoal} />
            </div>
          )}

          {activeTab === "knowledge" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Knowledge
              </h2>

              {project.knowledge && project.knowledge.length > 0 ? (
                <ul className="space-y-3 mb-6">
                  {project.knowledge.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          item.type === "article"
                            ? "bg-blue-100 text-blue-700"
                            : item.type === "video"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="flex-1 text-gray-700">{item.title}</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Link
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteKnowledge(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mb-6">
                  No knowledge items yet. Add your first one below.
                </p>
              )}

              <AddKnowledgeForm onAdd={handleAddKnowledge} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddSubGoalForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
      >
        + Add sub-goal
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter goal title..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddKnowledgeForm({
  onAdd,
}: {
  onAdd: (
    title: string,
    type: "article" | "video" | "note",
    url?: string
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"article" | "video" | "note">("article");
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), type, url.trim() || undefined);
      setTitle("");
      setType("article");
      setUrl("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
      >
        + Add knowledge item
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-50 rounded-lg space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (required)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoFocus
      />
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as "article" | "video" | "note")
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="article">Article</option>
        <option value="video">Video</option>
        <option value="note">Note</option>
      </select>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (optional)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setUrl("");
          }}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
