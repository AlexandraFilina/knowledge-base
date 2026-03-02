import { useState } from "react";
import { IProject } from "../../../interfaces/IProject";
import { IQuiz } from "../../../../../shared/storage/quizzesStorage";
import {
  loadQuizAttempts,
  QuizAttempt,
} from "../../../../../shared/storage/quizAttemptsStorage";

interface OverviewTabProps {
  project: IProject;
  projectId: number;
  quizzes: IQuiz[];
}

export function OverviewTab({ project, projectId, quizzes }: OverviewTabProps) {
  const [attempts] = useState<QuizAttempt[]>(() => loadQuizAttempts());

  const projectQuizzes = quizzes.filter((q) => q.projectId === projectId);
  const projectAttempts = attempts.filter((a) => a.projectId === projectId);

  const totalQuizzes = projectQuizzes.length;
  const totalAttempts = projectAttempts.length;
  const scores = projectAttempts.map((a) => a.score);
  const avgScore =
    totalAttempts > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / totalAttempts)
      : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...scores) : 0;
  const sortedByDate = [...projectAttempts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const lastAttempt = sortedByDate[0] || null;
  const lastScore = lastAttempt ? lastAttempt.score : null;

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

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Practice</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
              Quizzes
            </p>
            <p className="font-serif text-2xl text-stone-900">{totalQuizzes}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
              Attempts
            </p>
            <p className="font-serif text-2xl text-stone-900">
              {totalAttempts}
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
              Average
            </p>
            <p className="font-serif text-2xl text-stone-900">{avgScore}%</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
              Best
            </p>
            <p className="font-serif text-2xl text-stone-900">{bestScore}%</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 col-span-2">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
              Last
            </p>
            <p className="font-serif text-2xl text-stone-900">
              {lastScore !== null ? `${lastScore}%` : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
