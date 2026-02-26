import { IProject } from "../../interfaces/IProject";

interface OverviewTabProps {
  project: IProject;
}

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-4">
        {project.title}
      </h1>

      <p className="text-stone-700 text-lg mb-6">{project.description}</p>

      {project.goal && (
        <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-100">
          <h3 className="text-sm font-semibold text-rose-800 mb-1">Goal</h3>
          <p className="text-stone-700">{project.goal}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-stone-600">Progress</span>
          <span className="text-sm font-medium text-stone-600">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-3">
          <div
            className="bg-rose-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                 bg-stone-100 text-stone-600 border border-stone-200 
                 cursor-default select-none"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
