import { useState } from "react";
import { IProject } from "../interfaces/IProject";
import {
  IQuiz,
  deleteQuiz,
  upsertQuiz,
  saveQuizzes,
} from "../../../shared/storage/quizzesStorage";
import {
  deleteAttemptsForQuiz,
  QuizAttempt,
} from "../../../shared/storage/quizAttemptsStorage";
import { AddQuizForm } from "./AddQuizForm";
import { getQuizStatus } from "../utils/quizStatus";

interface QuizzesPanelProps {
  project: IProject;
  quizzes: IQuiz[];
  attempts: QuizAttempt[];
  setAttempts: React.Dispatch<React.SetStateAction<QuizAttempt[]>>;
  onCreateQuiz: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onUpdateQuiz: (updatedQuiz: IQuiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onUpdateProject: (updatedProject: IProject) => void;
  setActiveQuizId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<number | null>>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QuizzesPanel({
  project,
  quizzes,
  attempts,
  setAttempts,
  onCreateQuiz,
  onUpdateQuiz,
  onDeleteQuiz,
  onUpdateProject,
  setActiveQuizId,
  setSelectedOption,
  setShowResult,
}: QuizzesPanelProps) {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  const projectQuizzes = quizzes.filter((q) => q.projectId === project.id);

  return (
    <>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Practice</h2>

      {showQuizForm || editingQuizId ? (
        <AddQuizForm
          initialValues={
            editingQuizId
              ? projectQuizzes.find((q) => q.id === editingQuizId)
              : undefined
          }
          submitLabel={editingQuizId ? "Update Quiz" : "Save Quiz"}
          onAdd={(title, question, options, correctIndex) => {
            if (editingQuizId) {
              const existingQuiz = projectQuizzes.find(
                (q) => q.id === editingQuizId
              );
              if (existingQuiz) {
                const updatedQuiz: IQuiz = {
                  ...existingQuiz,
                  title,
                  question,
                  options,
                  correctIndex,
                };
                upsertQuiz(updatedQuiz);
                const updatedQuizzes = quizzes.map((q) =>
                  q.id === editingQuizId ? updatedQuiz : q
                );
                saveQuizzes(updatedQuizzes);
                onUpdateQuiz(updatedQuiz);
              }
              setEditingQuizId(null);
            } else {
              onCreateQuiz(title, question, options, correctIndex);
            }
            setShowQuizForm(false);
            setEditingQuizId(null);
          }}
          onCancel={() => {
            setShowQuizForm(false);
            setEditingQuizId(null);
          }}
        />
      ) : (
        <button
          onClick={() => setShowQuizForm(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition mb-4"
        >
          Create Quiz
        </button>
      )}

      {projectQuizzes.length === 0 ? (
        <p className="text-stone-500">No quizzes yet</p>
      ) : (
        <ul className="space-y-2">
          {projectQuizzes.map((quiz) => {
            const quizAttempts = attempts.filter((a) => a.quizId === quiz.id);
            const hasAttempts = quizAttempts.length > 0;
            const lastAttempt = hasAttempts
              ? quizAttempts.reduce((latest, a) =>
                  new Date(a.createdAt) > new Date(latest.createdAt)
                    ? a
                    : latest
                )
              : null;
            const lastScore = lastAttempt?.score ?? null;
            const status = getQuizStatus(lastScore);
            return (
              <li
                key={quiz.id}
                className="p-3 bg-stone-50 rounded-lg text-stone-700 flex justify-between items-start"
              >
                <div>
                  <span className="font-medium">{quiz.title}</span>
                  <div className="mt-1">
                    <span className={status.className}>{status.label}</span>
                  </div>
                  {lastAttempt && (
                    <p className="text-xs text-stone-500 mt-1">
                      Last score: {lastAttempt.score}% •{" "}
                      {new Date(lastAttempt.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setEditingQuizId(quiz.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Edit quiz"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Delete this quiz? This will also remove its history."
                        )
                      ) {
                        deleteQuiz(quiz.id);
                        deleteAttemptsForQuiz(quiz.id);
                        onDeleteQuiz(quiz.id);
                        setAttempts((prev) =>
                          prev.filter((a) => a.quizId !== quiz.id)
                        );
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete quiz"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuizId(quiz.id);
                      setSelectedOption(null);
                      setShowResult(false);
                    }}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition"
                  >
                    Start
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
