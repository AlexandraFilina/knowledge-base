import { useState, useEffect } from "react";
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
import { PracticeMode } from "./types";
import {
  loadFlashcards,
  saveFlashcards,
  deleteFlashcard,
  Flashcard,
} from "../../../../shared/storage/flashcardsStorage";
import { generateId } from "../../../../shared/utils/id";

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
  const [mode, setMode] = useState<PracticeMode>("quizzes");
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    loadQuizAttempts()
  );

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    loadFlashcards()
  );
  const [showCardForm, setShowCardForm] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    saveFlashcards(flashcards);
  }, [flashcards]);

  const projectQuizzes = quizzes.filter((q) => q.projectId === project.id);
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

  if (studyMode && projectCards.length > 0) {
    const currentCard = projectCards[studyIndex];
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Study Mode</h2>
          <button
            onClick={() => {
              setStudyMode(false);
              setStudyIndex(0);
              setShowAnswer(false);
            }}
            className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 transition"
          >
            Back to cards
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <span className="text-sm text-stone-500">
            Card {studyIndex + 1} of {projectCards.length}
          </span>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 min-h-[200px] flex items-center justify-center mb-6">
            <p className="text-lg text-stone-800 text-center">
              {currentCard.front}
            </p>
          </div>
          {showAnswer && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 min-h-[200px] flex items-center justify-center mb-6">
              <p className="text-lg text-stone-800 text-center">
                {currentCard.back}
              </p>
            </div>
          )}
          <div className="flex justify-center gap-3">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
              >
                Show answer
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (studyIndex < projectCards.length - 1) {
                      setStudyIndex((i) => i + 1);
                      setShowAnswer(false);
                    } else {
                      setStudyMode(false);
                      setStudyIndex(0);
                      setShowAnswer(false);
                    }
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  {studyIndex < projectCards.length - 1 ? "Next" : "Finish"}
                </button>
                {studyIndex > 0 && (
                  <button
                    onClick={() => {
                      setStudyIndex((i) => i - 1);
                      setShowAnswer(false);
                    }}
                    className="px-6 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-lg font-medium transition"
                  >
                    Previous
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
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
        <>
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
                const quizAttempts = attempts.filter(
                  (a) => a.quizId === quiz.id
                );
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
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-stone-900 mb-4">Flashcards</h2>

          {!showCardForm ? (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowCardForm(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
              >
                Create Card
              </button>
              {projectCards.length > 0 && (
                <button
                  onClick={() => {
                    setStudyMode(true);
                    setStudyIndex(0);
                    setShowAnswer(false);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Study
                </button>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Front (question)
                </label>
                <input
                  type="text"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter question or prompt"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Back (answer)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter answer"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (newFront.trim() && newBack.trim()) {
                      const newCard: Flashcard = {
                        id: generateId(),
                        projectId: project.id,
                        front: newFront.trim(),
                        back: newBack.trim(),
                        createdAt: new Date().toISOString(),
                      };
                      setFlashcards((prev) => [...prev, newCard]);
                      setNewFront("");
                      setNewBack("");
                      setShowCardForm(false);
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowCardForm(false);
                    setNewFront("");
                    setNewBack("");
                  }}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {projectCards.length === 0 ? (
            <p className="text-stone-500">No cards yet</p>
          ) : (
            <ul className="space-y-2">
              {projectCards.map((card) => (
                <li
                  key={card.id}
                  className="p-3 bg-stone-50 rounded-lg text-stone-700 flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{card.front}</p>
                    <p className="text-sm text-stone-500 truncate">
                      {card.back}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete this card?")) {
                        deleteFlashcard(card.id);
                        setFlashcards((prev) =>
                          prev.filter((c) => c.id !== card.id)
                        );
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-2"
                    title="Delete card"
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
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
