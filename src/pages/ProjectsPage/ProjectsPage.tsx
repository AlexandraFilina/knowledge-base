import "./ProjectsPage.css";
import ProjectCardComponent from "../../features/project/components/ProjectCardComponent/ProjectCardComponent";
import { useState } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import { IProjectFormValues } from "../../features/project/interfaces/IProjectFormValues";
import ProjectDialog from "../../features/project/dialogs/ProjectDialog/ProjectDialog";
import { mockProjects } from "../../features/project/constants/mockProjects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>(mockProjects);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [currentProject, setCurrentProject] = useState<
    IProjectFormValues | undefined
  >(undefined);

  const handleSaveNewProject = (data: IProjectFormValues) => {
    const newProject: IProject = {
      id: Date.now(),
      ...data,
      tags: data.tags,
      image: mockProjects[0]?.image || "",
    };
    setIsOpen(false);
    setProjects([newProject, ...projects]);
    setCurrentProject(undefined);
  };

  const handleEditProject = (data: IProjectFormValues) => {
    setProjects(
      projects.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: data.title,
              description: data.description,
              tags: data.tags,
            }
          : p
      )
    );
    setIsOpen(false);
    setCurrentProject(undefined);
    setEditingId(null);
  };

  const projectDelete = (id: number) => {
    if (window.confirm("Delete this card?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const onClickEdit = (project: IProject) => {
    setEditingId(project.id);
    setCurrentProject({
      title: project.title,
      description: project.description,
      tags: project.tags,
    });
    setIsOpen(true);
  };

  const onClickAdd = () => {
    setCurrentProject(undefined);
    setIsOpen(true);
  };

  return (
    <div className="p-10 relative">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => onClickAdd()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg"
        >
          + Create theme
        </button>
      </div>

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
              title={item.title}
              description={item.description}
              image={item.image}
              tags={item.tags}
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
