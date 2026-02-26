import "./ProjectsPage.css";
import ProjectCardComponent from "../../features/project/components/ProjectCardComponent/ProjectCardComponent";
import { useState, useEffect, useRef } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import { IProjectFormValues } from "../../features/project/interfaces/IProjectFormValues";
import ProjectDialog from "../../features/project/dialogs/ProjectDialog/ProjectDialog";
import { mockProjects } from "../../features/project/constants/mockProjects";
import {
  loadProjects,
  saveProjects,
} from "../../shared/storage/projectsStorage";
import { saveQuizzes } from "../../shared/storage/quizzesStorage";
import {
  createProject,
  updateProject,
  deleteProject,
  nextProjectId,
  clampProgress,
} from "../../features/project/utils/projectCrud";
import {
  exportAppData,
  downloadJson,
  importAppData,
} from "../../shared/utils/jsonPortability";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>(() =>
    loadProjects(mockProjects)
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [currentProject, setCurrentProject] = useState<
    IProjectFormValues | undefined
  >(undefined);

  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const handleReset = () => {
    if (
      window.confirm("Reset all projects to defaults? This cannot be undone.")
    ) {
      localStorage.removeItem("projects.v1");
      setProjects(mockProjects);
    }
  };

  const handleSaveNewProject = (data: IProjectFormValues) => {
    const newProject: IProject = {
      id: nextProjectId(projects),
      ...data,
      tags: data.tags,
      image: mockProjects[0]?.image || "",
      progress: clampProgress(data.progress),
    };
    setIsOpen(false);
    setProjects((prev) => createProject(prev, newProject));
    setCurrentProject(undefined);
  };

  const handleEditProject = (data: IProjectFormValues) => {
    const existing = projects.find((p) => p.id === editingId);
    if (existing) {
      const updated: IProject = {
        ...existing,
        title: data.title,
        description: data.description,
        tags: data.tags,
        progress: clampProgress(data.progress),
      };
      setProjects((prev) => updateProject(prev, updated));
    }
    setIsOpen(false);
    setCurrentProject(undefined);
    setEditingId(null);
  };

  const projectDelete = (id: number) => {
    if (window.confirm("Delete this card?")) {
      setProjects((prev) => deleteProject(prev, id));
    }
  };

  const onClickEdit = (project: IProject) => {
    setEditingId(project.id);
    setCurrentProject({
      title: project.title,
      description: project.description,
      tags: project.tags,
      progress: project.progress,
    });
    setIsOpen(true);
  };

  const onClickAdd = () => {
    setCurrentProject(undefined);
    setIsOpen(true);
  };

  const handleExport = () => {
    const data = exportAppData();
    downloadJson("knowledge-base-export.json", data);
    setMessage("Data exported successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importAppData(file);
      saveProjects(data.projects);
      saveQuizzes(data.quizzes);
      setProjects(data.projects);
      setMessage("Data imported successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to import data"
      );
    }
    setTimeout(() => setMessage(""), 3000);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-10 relative">
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => onClickAdd()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg"
        >
          + Create theme
        </button>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition shadow-lg text-sm"
        >
          Export data
        </button>
        <button
          onClick={handleImportClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition shadow-lg text-sm"
        >
          Import data
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-medium transition shadow-lg text-sm"
        >
          Reset to defaults
        </button>
      </div>

      {message && (
        <div className="flex justify-center mb-4">
          <span
            className={`px-4 py-2 rounded-full text-sm ${
              message.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap justify-center gap-6">
        {projects.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onClickEdit(item)}
                className="bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-blue-100"
              >
                ✏️
              </button>
              <button
                onClick={() => projectDelete(item.id)}
                className="bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-100"
              >
                🗑️
              </button>
            </div>

            <ProjectCardComponent
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              tags={item.tags}
              progress={item.progress}
            />
          </div>
        ))}
      </div>
      <ProjectDialog
        title={currentProject ? "Edit Project" : "Create Project"}
        onSave={currentProject ? handleEditProject : handleSaveNewProject}
        defaultValues={currentProject || undefined}
        buttonText={currentProject ? "Save Changes" : "Create"}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingId(null);
        }}
      />
    </div>
  );
}
