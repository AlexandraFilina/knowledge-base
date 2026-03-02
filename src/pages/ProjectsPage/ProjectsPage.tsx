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
import toast from "react-hot-toast";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (
      window.confirm("Reset all projects to defaults? This cannot be undone.")
    ) {
      saveProjects(mockProjects);
      saveQuizzes([]);
      refreshProjects();
      toast.success("Projects reset to defaults!");
    }
  };

  const handleSaveNewProject = (data: IProjectFormValues) => {
    createProject(data);
    toast.success("Project created successfully!");
    setIsOpen(false);
    setFormValues(undefined);
    setEditingId(null);
  };

  const handleEditProject = (data: IProjectFormValues) => {
    if (editingId !== null) {
      updateProject(editingId, data);
      toast.success("Project updated successfully!");
    }
    setIsOpen(false);
    setFormValues(undefined);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this card?")) {
      deleteProject(id);
      toast.success("Project deleted!");
    }
  };

  const onClickEdit = (project: IProject) => {
    setEditingId(project.id);
    setFormValues({
      title: project.title,
      description: project.description,
      tags: project.tags,
      progress: project.progress,
      image: project.image,
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
    toast.success("Data exported successfully!");
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
      toast.success("Data imported successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import data"
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Projects</h1>
          <p className="mt-1 text-sm text-stone-500">Your learning themes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm hover:bg-stone-50 active:scale-[0.99] transition"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm hover:bg-stone-50 active:scale-[0.99] transition"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Import
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-50 active:scale-[0.99] transition"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>
          <button
            onClick={onClickAdd}
            className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-[0.99] transition"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create project
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClickEdit(item);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/90 shadow-sm hover:bg-stone-50"
              >
                <svg
                  className="h-4 w-4 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/90 shadow-sm hover:bg-stone-50"
              >
                <svg
                  className="h-4 w-4 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
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
