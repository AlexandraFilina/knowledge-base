import "./ProjectsPage.css";
import ProjectCardComponent from "../../features/project/components/ProjectCardComponent/ProjectCardComponent";
import { useState, useRef } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import { IProjectFormValues } from "../../features/project/interfaces/IProjectFormValues";
import ProjectDialog from "../../features/project/dialogs/ProjectDialog/ProjectDialog";
import { useProjects } from "../../features/project/hooks/useProjects";
import { saveQuizzes } from "../../shared/storage/quizzesStorage";
import { saveProjects } from "../../shared/storage/projectsStorage";
import { mockProjects } from "../../features/project/constants/mockProjects";
import {
  exportAppData,
  downloadJson,
  importAppData,
} from "../../shared/utils/jsonPortability";

export default function ProjectsPage() {
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  } = useProjects();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formValues, setFormValues] = useState<IProjectFormValues | undefined>(
    undefined
  );

  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (
      window.confirm("Reset all projects to defaults? This cannot be undone.")
    ) {
      saveProjects(mockProjects);
      saveQuizzes([]);
      refreshProjects();
      setMessage("Projects reset to defaults!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveNewProject = (data: IProjectFormValues) => {
    createProject(data);
    setIsOpen(false);
    setFormValues(undefined);
    setEditingId(null);
  };

  const handleEditProject = (data: IProjectFormValues) => {
    if (editingId !== null) {
      updateProject(editingId, data);
    }
    setIsOpen(false);
    setFormValues(undefined);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this card?")) {
      deleteProject(id);
    }
  };

  const onClickEdit = (project: IProject) => {
    setEditingId(project.id);
    setFormValues({
      title: project.title,
      description: project.description,
      tags: project.tags,
      progress: project.progress,
    });
    setIsOpen(true);
  };

  const onClickAdd = () => {
    setEditingId(null);
    setFormValues(undefined);
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
      refreshProjects();
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
          onClick={onClickAdd}
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
                onClick={() => handleDelete(item.id)}
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
        title={editingId !== null ? "Edit Project" : "Create Project"}
        onSave={editingId !== null ? handleEditProject : handleSaveNewProject}
        defaultValues={formValues}
        buttonText={editingId !== null ? "Save Changes" : "Create"}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingId(null);
          setFormValues(undefined);
        }}
      />
    </div>
  );
}
