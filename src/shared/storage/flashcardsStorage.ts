export type Flashcard = {
  id: string;
  projectId: number;
  front: string;
  back: string;
  createdAt: string;
};

const STORAGE_KEY = "flashcards.v1";

function isValidFlashcard(item: unknown): item is Flashcard {
  if (!item || typeof item !== "object") return false;
  const card = item as Record<string, unknown>;
  return (
    typeof card.id === "string" &&
    typeof card.projectId === "number" &&
    typeof card.front === "string" &&
    typeof card.back === "string" &&
    typeof card.createdAt === "string"
  );
}

export function loadFlashcards(): Flashcard[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      const valid = parsed.filter(isValidFlashcard);
      return valid;
    }
  } catch {
    console.warn("Failed to load flashcards from localStorage");
  }
  return [];
}

export function saveFlashcards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    console.warn("Failed to save flashcards to localStorage");
  }
}

export function upsertFlashcard(card: Flashcard): void {
  const cards = loadFlashcards();
  const index = cards.findIndex((c) => c.id === card.id);
  if (index !== -1) {
    cards[index] = card;
  } else {
    cards.push(card);
  }
  saveFlashcards(cards);
}

export function deleteFlashcard(id: string): void {
  const cards = loadFlashcards();
  const filtered = cards.filter((c) => c.id !== id);
  saveFlashcards(filtered);
}
