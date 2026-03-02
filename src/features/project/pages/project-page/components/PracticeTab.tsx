import { useState, useEffect } from "react";
import { IProject } from "../../../interfaces/IProject";
import { IQuiz } from "../../../../../shared/storage/quizzesStorage";
import {
  loadQuizAttempts,
  saveQuizAttempts,
  QuizAttempt,
} from "../../../../../shared/storage/quizAttemptsStorage";
import {
  computeGoalsProgress,
  computePracticeProgress,
  computeOverallProgress,
} from "../../../utils/progress";
import { QuizPlayingView } from "./QuizPlayingView";
import { PracticeMode } from "../utils/types";
import {
  loadFlashcards,
  saveFlashcards,
  Flashcard,
} from "../../../../../shared/storage/flashcardsStorage";
import { QuizzesPanel } from "./QuizzesPanel";
import { CardsPanel } from "./CardsPanel";

interface PracticeTabProps {
  project: IProject;
  quizzes: IQuiz[];
  onCreateQuiz: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onUpdateQuiz: (updatedQuiz: IQuiz) => void;
  onUpdateProject: (updatedProject: IProject) => void;
  onDeleteQuiz: (quizId: string) => void;
}

export function PracticeTab({
  project,
  quizzes,
  onCreateQuiz,
  onUpdateQuiz,
  onUpdateProject,
  onDeleteQuiz,
}: PracticeTabProps) {
  const [mode, setMode] = useState<PracticeMode>("quizzes");
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    loadQuizAttempts()
  );

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    loadFlashcards()
  );

  useEffect(() => {
    saveFlashcards(flashcards);
  }, [flashcards]);

  const projectCards = flashcards.filter((c) => c.projectId === project.id);

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
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setMode("quizzes")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "quizzes"
              ? "bg-rose-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          Quizzes
        </button>
        <button
          onClick={() => setMode("cards")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "cards"
              ? "bg-rose-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          Cards
        </button>
      </div>

      {mode === "quizzes" ? (
        <QuizzesPanel
          project={project}
          quizzes={quizzes}
          attempts={attempts}
          setAttempts={setAttempts}
          onCreateQuiz={onCreateQuiz}
          onUpdateQuiz={onUpdateQuiz}
          onDeleteQuiz={onDeleteQuiz}
          onUpdateProject={onUpdateProject}
          setActiveQuizId={setActiveQuizId}
          setSelectedOption={setSelectedOption}
          setShowResult={setShowResult}
        />
      ) : (
        <CardsPanel
          projectId={project.id}
          flashcards={flashcards}
          setFlashcards={setFlashcards}
          projectCards={projectCards}
        />
      )}
    </div>
  );
}
