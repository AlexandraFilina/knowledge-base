import { useState } from "react";
import { IProject, ISubGoal } from "../../interfaces/IProject";

interface GoalsTabProps {
  project: IProject;
  onUpdateProject: (updatedProject: IProject) => void;
}

export function GoalsTab({ project, onUpdateProject }: GoalsTabProps) {
  const handleToggleSubGoal = (subGoalId: string) => {
    const subGoals =
      project.subGoals?.map((sg) =>
        sg.id === subGoalId ? { ...sg, done: !sg.done } : sg
      ) || [];
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    const updatedProject = { ...project, subGoals, progress: newProgress };
    onUpdateProject(updatedProject);
  };

  const handleAddSubGoal = (title: string) => {
    const newSubGoal: ISubGoal = { id: generateId(), title, done: false };
    const subGoals = [...(project.subGoals || []), newSubGoal];
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    const updatedProject = { ...project, subGoals, progress: newProgress };
    onUpdateProject(updatedProject);
  };

  const handleDeleteSubGoal = (subGoalId: string) => {
    const subGoals = (project.subGoals || []).filter(
      (sg) => sg.id !== subGoalId
    );
    const doneCount = subGoals.filter((sg) => sg.done).length;
    const newProgress =
      subGoals.length > 0
        ? Math.round((doneCount / subGoals.length) * 100)
        : project.progress;
    const updatedProject = { ...project, subGoals, progress: newProgress };
    onUpdateProject(updatedProject);
  };

  return (
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
                  subGoal.done ? "line-through text-gray-400" : "text-gray-700"
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
  );
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
