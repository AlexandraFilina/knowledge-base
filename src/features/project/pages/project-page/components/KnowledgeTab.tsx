import { useState } from "react";
import { IProject, IKnowledgeItem } from "../../../interfaces/IProject";

interface KnowledgeTabProps {
  project: IProject;
  onUpdateProject: (updatedProject: IProject) => void;
}

export function KnowledgeTab({ project, onUpdateProject }: KnowledgeTabProps) {
  const handleAddKnowledge = (
    title: string,
    type: "article" | "video" | "note",
    url?: string
  ) => {
    const newKnowledge: IKnowledgeItem = { id: generateId(), title, type, url };
    const knowledge = [...(project.knowledge || []), newKnowledge];
    const updatedProject = { ...project, knowledge };
    onUpdateProject(updatedProject);
  };

  const handleDeleteKnowledge = (knowledgeId: string) => {
    const knowledge = (project.knowledge || []).filter(
      (k) => k.id !== knowledgeId
    );
    const updatedProject = { ...project, knowledge };
    onUpdateProject(updatedProject);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Knowledge</h2>

      {project.knowledge && project.knowledge.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {project.knowledge.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
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
              <span className="flex-1 text-stone-700">{item.title}</span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-700 hover:text-rose-800 text-sm"
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
        <p className="text-stone-500 mb-6">
          No knowledge items yet. Add your first one below.
        </p>
      )}

      <AddKnowledgeForm onAdd={handleAddKnowledge} />
    </div>
  );
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
        className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
      >
        + Add knowledge item
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-stone-50 rounded-lg space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (required)"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        autoFocus
      />
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as "article" | "video" | "note")
        }
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            setUrl("");
          }}
          className="px-4 py-2 bg-stone-300 hover:bg-stone-400 text-stone-700 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
