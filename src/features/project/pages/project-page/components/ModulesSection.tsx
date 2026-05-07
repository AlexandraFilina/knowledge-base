import { useState } from "react";
import { IProject, IModule, ISubGoal } from "../../../interfaces/IProject";
import { generateId } from "../../../../../shared/utils/id";

interface ModulesSectionProps {
  project: IProject;
  onUpdateProject: (updatedProject: IProject) => void;
}

export function ModulesSection({
  project,
  onUpdateProject,
}: ModulesSectionProps) {
  const modules = project.modules || [];

  const handleAddModule = (title: string, description?: string) => {
    const newModule: IModule = {
      id: generateId(),
      title,
      description,
      goals: [],
      knowledge: [],
    };
    const updatedModules = [...modules, newModule];
    const updatedProject = { ...project, modules: updatedModules };
    onUpdateProject(updatedProject);
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = modules.filter((m) => m.id !== moduleId);
    const updatedProject = { ...project, modules: updatedModules };
    onUpdateProject(updatedProject);
  };

  const handleUpdateModule = (updatedModule: IModule) => {
    const updatedModules = modules.map((m) =>
      m.id === updatedModule.id ? updatedModule : m
    );
    const updatedProject = { ...project, modules: updatedModules };
    onUpdateProject(updatedProject);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Modules</h2>

      {modules.length > 0 ? (
        <div className="space-y-4 mb-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              projectId={String(project.id)}
              onUpdate={handleUpdateModule}
              onDelete={() => handleDeleteModule(module.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 mb-6 text-center">
          <p className="text-stone-500">
            No modules yet. Add your first module below.
          </p>
        </div>
      )}

      <AddModuleForm onAdd={handleAddModule} />
    </div>
  );
}

interface ModuleCardProps {
  module: IModule;
  projectId: string;
  onUpdate: (updatedModule: IModule) => void;
  onDelete: () => void;
}

function ModuleCard({
  module,
  projectId,
  onUpdate,
  onDelete,
}: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const doneCount = module.goals.filter((g) => g.done).length;
  const totalCount = module.goals.length;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = module.goals.map((g) =>
      g.id === goalId ? { ...g, done: !g.done } : g
    );
    onUpdate({ ...module, goals: updatedGoals });
  };

  const handleAddGoal = (title: string) => {
    const newGoal: ISubGoal = { id: generateId(), title, done: false };
    const updatedGoals = [...module.goals, newGoal];
    onUpdate({ ...module, goals: updatedGoals });
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = module.goals.filter((g) => g.id !== goalId);
    onUpdate({ ...module, goals: updatedGoals });
  };

  return (
    <div className="group bg-stone-50 rounded-lg p-4 border border-stone-200 hover:border-rose-300 hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="font-semibold text-stone-800 text-left hover:text-rose-700 transition"
          >
            {module.title}
          </button>
          {module.description && (
            <p className="text-sm text-stone-600 mt-1">{module.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <a
            href={`/projects/${projectId}/modules/${module.id}`}
            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-medium rounded transition"
          >
            Open module
          </a>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-stone-500 hover:text-rose-600 text-sm transition"
          >
            {isExpanded ? "Hide goals" : "Show goals"}
          </button>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-stone-500">Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-stone-600">
            {doneCount}/{totalCount} ({progress}%)
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stone-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-medium text-stone-700 mb-3">Goals</h4>
          {module.goals.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {module.goals.map((goal) => (
                <li key={goal.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => handleToggleGoal(goal.id)}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      goal.done
                        ? "line-through text-stone-400"
                        : "text-stone-700"
                    }`}
                  >
                    {goal.title}
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400 italic mb-3">
              No goals yet. Add your first goal below.
            </p>
          )}
          <AddGoalForm onAdd={handleAddGoal} />
        </div>
      )}
    </div>
  );
}

interface AddModuleFormProps {
  onAdd: (title: string, description?: string) => void;
}

function AddModuleForm({ onAdd }: AddModuleFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
      >
        + Add module
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-stone-50 rounded-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Module title (required)"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-3"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-3 resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setDescription("");
          }}
          className="px-4 py-2 bg-stone-300 hover:bg-stone-400 text-stone-700 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface AddGoalFormProps {
  onAdd: (title: string) => void;
}

function AddGoalForm({ onAdd }: AddGoalFormProps) {
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
        className="text-sm text-rose-600 hover:text-rose-700 font-medium"
      >
        + Add goal
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title..."
        className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
        autoFocus
      />
      <button
        type="submit"
        className="px-2 py-1 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          setTitle("");
        }}
        className="px-2 py-1 text-sm bg-stone-300 hover:bg-stone-400 text-stone-700 rounded"
      >
        Cancel
      </button>
    </form>
  );
}
