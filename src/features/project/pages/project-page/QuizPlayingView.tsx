import { useState } from "react";
import { IQuiz } from "../../../../shared/storage/quizzesStorage";
import { QuizAttempt } from "../../../../shared/storage/quizAttemptsStorage";
import { generateId } from "../../../../shared/utils/id";

interface QuizPlayingViewProps {
  quiz: IQuiz;
  projectId: number;
  selectedOption: number | null;
  setSelectedOption: (option: number | null) => void;
  showResult: boolean;
  setShowResult: (show: boolean) => void;
  onBack: () => void;
  onSaveAttempt: (attempt: QuizAttempt) => void;
}

export function QuizPlayingView({
  quiz,
  projectId,
  selectedOption,
  setSelectedOption,
  showResult,
  setShowResult,
  onBack,
  onSaveAttempt,
}: QuizPlayingViewProps) {
  const isCorrect = selectedOption === quiz.correctIndex;
  const score = isCorrect ? 100 : 0;

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const attempt: QuizAttempt = {
        id: generateId(),
        quizId: quiz.id,
        projectId,
        score,
        createdAt: new Date().toISOString(),
      };
      onSaveAttempt(attempt);
      setShowResult(true);
    }
  };

  return (
    <div className="p-4 bg-stone-50 rounded-lg">
      <h3 className="text-lg font-bold text-stone-900 mb-4">{quiz.title}</h3>

      <p className="text-stone-700 mb-4">{quiz.question}</p>

      {!showResult ? (
        <>
          <div className="space-y-2 mb-4">
            {quiz.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                  selectedOption === index
                    ? "bg-rose-100 border-2 border-rose-500"
                    : "bg-white border-2 border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="text-stone-700">{option}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedOption === null
                ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            Submit answer
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              isCorrect ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p
              className={`text-lg font-bold ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {isCorrect ? "Correct!" : "Wrong"}
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <p className="text-sm font-medium text-stone-600 mb-1">
              Correct answer:
            </p>
            <p className="text-stone-900">{quiz.options[quiz.correctIndex]}</p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <p className="text-sm font-medium text-stone-600 mb-1">Score:</p>
            <p className="text-2xl font-bold text-rose-600">{score}%</p>
          </div>

          <div className="p-2 bg-stone-100 rounded-lg">
            <p className="text-sm text-stone-600">
              Saved to history • {new Date().toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-lg font-medium transition"
          >
            Back to list
          </button>
        </div>
      )}
    </div>
  );
}
