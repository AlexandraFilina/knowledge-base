import { useState } from "react";
import { IQuiz } from "../../../../shared/storage/quizzesStorage";
import {
  loadQuizAttempts,
  saveQuizAttempts,
  QuizAttempt,
} from "../../../../shared/storage/quizAttemptsStorage";
import { generateId } from "../../../../shared/utils/id";

interface PracticeTabProps {
  projectId: number;
  quizzes: IQuiz[];
  onCreateQuiz: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
}

export function PracticeTab({
  projectId,
  quizzes,
  onCreateQuiz,
}: PracticeTabProps) {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    loadQuizAttempts()
  );

  const projectQuizzes = quizzes.filter((q) => q.projectId === projectId);

  if (activeQuizId) {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    if (quiz) {
      return (
        <QuizPlayingView
          quiz={quiz}
          projectId={projectId}
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
          onAdd={onCreateQuiz}
          onCancel={() => setShowQuizForm(false)}
        />
      )}

      {projectQuizzes.length === 0 ? (
        <p className="text-stone-500">No quizzes yet</p>
      ) : (
        <ul className="space-y-2">
          {projectQuizzes.map((quiz) => {
            const quizAttempts = attempts.filter((a) => a.quizId === quiz.id);
            const lastAttempt =
              quizAttempts.length > 0
                ? quizAttempts.reduce((latest, a) =>
                    new Date(a.createdAt) > new Date(latest.createdAt)
                      ? a
                      : latest
                  )
                : null;
            return (
              <li
                key={quiz.id}
                className="p-3 bg-stone-50 rounded-lg text-stone-700 flex justify-between items-center"
              >
                <div>
                  <span>{quiz.title}</span>
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

function AddQuizForm({
  onAdd,
  onCancel,
}: {
  onAdd: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && question.trim() && options.every((opt) => opt.trim())) {
      onAdd(
        title.trim(),
        question.trim(),
        options.map((o) => o.trim()),
        correctIndex
      );
      setTitle("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-stone-50 rounded-lg space-y-3 mb-4"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title (required)"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        autoFocus
      />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question (required)"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-600">Options:</p>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="correctIndex"
              checked={correctIndex === index}
              onChange={() => setCorrectIndex(index)}
              className="w-4 h-4 text-rose-600"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1} (required)`}
              className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        ))}
      </div>
      <p className="text-sm text-stone-500">
        Select the correct answer using the radio button
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
        >
          Save Quiz
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-stone-300 hover:bg-stone-400 text-stone-700 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function QuizPlayingView({
  quiz,
  projectId,
  selectedOption,
  setSelectedOption,
  showResult,
  setShowResult,
  onBack,
  onSaveAttempt,
}: {
  quiz: IQuiz;
  projectId: number;
  selectedOption: number | null;
  setSelectedOption: (option: number | null) => void;
  showResult: boolean;
  setShowResult: (show: boolean) => void;
  onBack: () => void;
  onSaveAttempt: (attempt: QuizAttempt) => void;
}) {
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
