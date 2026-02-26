import "./ProjectCardComponent.css";
import { useNavigate } from "react-router-dom";

interface IProjectProps {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  progress?: number;
}

export default function ProjectCardComponent({
  id,
  title,
  description,
  image,
  tags,
  progress = 0,
}: IProjectProps) {
  const navigate = useNavigate();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-sm bg-white border border-stone-200">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-stone-700 text-base">{description}</p>
      </div>
      <div className="px-6 pb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-stone-500">Progress</span>
          <span className="text-xs font-medium text-stone-500">
            {clampedProgress}%
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-1.5">
          <div
            className="bg-rose-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-6 py-2 justify-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium 
                 bg-stone-100 text-stone-600 border border-stone-200 
                 cursor-default select-none transition-colors hover:bg-stone-200"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="px-6 pb-4">
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-2xl transition"
        >
          Open
        </button>
      </div>
    </div>
  );
}
