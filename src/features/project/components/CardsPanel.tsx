import { useState, useEffect } from "react";
import {
  loadFlashcards,
  saveFlashcards,
  deleteFlashcard,
  Flashcard,
} from "../../../shared/storage/flashcardsStorage";
import { generateId } from "../../../shared/utils/id";
import { FlipCard } from "./FlipCard";

interface CardsPanelProps {
  projectId: number;
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  projectCards: Flashcard[];
}

export function CardsPanel({
  projectId,
  flashcards,
  setFlashcards,
  projectCards,
}: CardsPanelProps) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);

  useEffect(() => {
    saveFlashcards(flashcards);
  }, [flashcards]);

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
          <FlipCard front={currentCard.front} back={currentCard.back} />
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => {
                if (studyIndex < projectCards.length - 1) {
                  setStudyIndex((i) => i + 1);
                } else {
                  setStudyMode(false);
                  setStudyIndex(0);
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
                }}
                className="px-6 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-lg font-medium transition"
              >
                Previous
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
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
                    projectId: projectId,
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
                <p className="text-sm text-stone-500 truncate">{card.back}</p>
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
  );
}
