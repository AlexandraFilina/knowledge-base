import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-stone-600 mb-4">404</h1>
      <p className="text-stone-500 mb-6">Page not found</p>
      <Link
        to="/projects"
        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-2xl font-medium transition shadow-sm inline-block"
      >
        Back to Projects
      </Link>
    </div>
  );
}
