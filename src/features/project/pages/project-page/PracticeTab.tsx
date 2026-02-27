import { useState } from "react";
import { IProject } from "../../interfaces/IProject";
import { IQuiz, deleteQuiz } from "../../../../shared/storage/quizzesStorage";
import {
  loadQuizAttempts,
  saveQuizAttempts,
  deleteAttemptsForQuiz,
  QuizAttempt,
} from "../../../../shared/storage/quizAttemptsStorage";
import {
  computeGoalsProgress,
  computePracticeProgress,
  computeOverallProgress,
} from "../../utils/progress";
import { AddQuizForm } from "./AddQuizForm";
import { QuizPlayingView } from "./QuizPlayingView";
import { getQuizStatus } from "./quizStatus";

interface PracticeTabProps {
  project: IProject;
  quizzes: IQuiz[];
  onCreateQuiz: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onUpdateProject: (updatedProject: IProject) => void;
  onDeleteQuiz: (quizId: string) => void;
}

export function PracticeTab({
  project,
  quizzes,
  onCreateQuiz,
  onUpdateProject,
  onDeleteQuiz,
}: PracticeTabProps) {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    loadQuizAttempts()
  );

  const projectQuizzes = quizzes.filter((q) => q.projectId === project.id);

  if (activeQuizId) {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    if (quiz) {
      return (
        <QuizPlayingView
          quiz={quiz}
          projectId={project.id}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          showResult={showResult}
          setShowResult={setShowResult}
          onBack={() => {
            setActiveQuizId(null);
            setSelectedOption(null);
            setShowResult(false);
          }}
          onSaveAttempt={(attempt) => {
            setAttempts((prev) => {
              const next = [...prev, attempt];
              saveQuizAttempts(next);
              const goalsProgress = computeGoalsProgress(project.subGoals);
              const practiceProgress = computePracticeProgress(
                project.id,
                quizzes,
                next
              );
              const overallProgress = computeOverallProgress(
                goalsProgress,
                practiceProgress
              );
              onUpdateProject({ ...project, progress: overallProgress });
              return next;
            });
          }}
        />
      );
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Practice</h2>

      {!showQuizForm ? (
        <button
          onClick={() => setShowQuizForm(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition mb-4"
        >
          Create Quiz
        </button>
      ) : (
        <AddQuizForm
          onAdd={(title, question, options, correctIndex) => {
            onCreateQuiz(title, question, options, correctIndex);
            setShowQuizForm(false);
          }}
          onCancel={() => setShowQuizForm(false)}
        />
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
                className="p-3 bg-stone-50 rounded-lg text-stone-700 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{quiz.title}</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  {lastAttempt && (
                    <p className="text-xs text-stone-500 mt-1">
                      Last score: {lastAttempt.score}% •{" "}
                      {new Date(lastAttempt.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
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
    </div>
  );
}
