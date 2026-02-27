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
    <div className="max-w-sm rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200">
      {image ? (
        <div className="relative h-44 overflow-hidden rounded-t-2xl">
          <img className="w-full h-full object-cover" src={image} alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
        </div>
      ) : (
        <div className="h-44 bg-stone-100 rounded-t-2xl flex items-center justify-center">
          <span className="text-stone-400 text-sm">No image</span>
        </div>
      )}
      <div className="px-5 py-4">
        <div className="font-serif text-lg font-semibold text-stone-900 mb-2">
          {title}
        </div>
        <p className="text-sm text-stone-600 line-clamp-2">{description}</p>
      </div>
      <div className="px-5 pb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-stone-600">Progress</span>
          <span className="text-xs text-stone-600">{clampedProgress}%</span>
        </div>
        <div className="h-1.5 bg-stone-200 rounded-full">
          <div
            className="h-1.5 bg-rose-600 rounded-full"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-5 py-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="px-5 pb-4">
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
