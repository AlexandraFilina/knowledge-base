import "./ProjectCardComponent.css";

interface IProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export default function ProjectCardComponent({
  title,
  description,
  image,
  tags,
}: IProjectProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 px-6 py-4 justify-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium 
                 bg-slate-100 text-slate-600 border border-slate-200 
                 cursor-default select-none transition-colors hover:bg-slate-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
