import "./ProjectsPage.css";
import ProjectCardComponent from "../../features/project/components/ProjectCardComponent/ProjectCardComponent";
import projectJPG from "../../../src/card.jpg";
import { useState } from "react";
import { IProject } from "../../features/project/interfaces/IProject";
import { IProjectFormValues } from "../../features/project/interfaces/IProjectFormValues";
import ProjectDialog from "../../features/project/dialogs/ProjectDialog/ProjectDialog";

const initialData: IProject[] = [
  {
    id: 1,
    title: "The Industrial Revolution",
    description:
      "Study of the transition to new manufacturing processes in Europe and the US, focusing on social and economic impacts.",
    image: projectJPG,
    tags: ["history", "midterm", "social-science"],
  },
  {
    id: 2,
    title: "Cellular Biology Fundamentals",
    description:
      "Deep dive into cell structure, organelles, and the process of mitosis and meiosis for the upcoming finals.",
    image: projectJPG,
    tags: ["biology", "science", "exam-prep"],
  },
  {
    id: 3,
    title: "Macroeconomics: GDP & Inflation",
    description:
      "Analyzing the relationship between national output and price levels. Includes calculation methods and fiscal policy impacts.",
    image: projectJPG,
    tags: ["economics", "university", "theory"],
  },
  {
    id: 4,
    title: "Introduction to AI Ethics",
    description:
      "Exploring the moral implications of artificial intelligence, bias in algorithms, and the future of automation in society.",
    image: projectJPG,
    tags: ["technology", "philosophy", "essay-project"],
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [currentProject, setCurrentProject] = useState<
    IProjectFormValues | undefined
  >(undefined);

  const handleSaveNewProject = (data: IProjectFormValues) => {
    const tagsArray = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t: string) => t !== "");
    const newProject = {
      id: Date.now(),
      ...data,
      tags: tagsArray,
      image: projectJPG,
    };
    setIsOpen(false);
    setProjects([newProject, ...projects]);
    setCurrentProject(undefined);
  };

  const handleEditProject = (data: IProjectFormValues) => {
    const tagsArray = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t: string) => t !== "");
    setProjects(
      projects.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: data.title,
              description: data.description,
              tags: tagsArray,
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
      tags: project.tags.join(", "),
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
