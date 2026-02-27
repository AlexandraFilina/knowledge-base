import { useState } from "react";

interface AddQuizFormProps {
  onAdd: (
    title: string,
    question: string,
    options: string[],
    correctIndex: number
  ) => void;
  onCancel: () => void;
}

export function AddQuizForm({ onAdd, onCancel }: AddQuizFormProps) {
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
