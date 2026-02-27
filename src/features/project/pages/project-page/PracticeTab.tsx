import { useState } from "react";
import { IProject } from "../../interfaces/IProject";
import { IQuiz } from "../../../../shared/storage/quizzesStorage";
import {
  loadQuizAttempts,
  saveQuizAttempts,
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
}

export function PracticeTab({
  project,
  quizzes,
  onCreateQuiz,
  onUpdateProject,
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
