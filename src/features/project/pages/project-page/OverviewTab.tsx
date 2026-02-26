import { IProject } from "../../interfaces/IProject";

interface OverviewTabProps {
  project: IProject;
}

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

      <p className="text-gray-700 text-lg mb-6">{project.description}</p>

      {project.goal && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-800 mb-1">Goal</h3>
          <p className="text-gray-700">{project.goal}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
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
  );
}
