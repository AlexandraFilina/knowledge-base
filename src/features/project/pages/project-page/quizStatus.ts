export function getQuizStatus(lastScore: number | null): {
  label: string;
  className: string;
} {
  if (lastScore === null) {
    return {
      label: "Not started",
      className: "bg-stone-200 text-stone-600",
    };
  }
  if (lastScore >= 70) {
    return {
      label: "Passed",
      className: "bg-green-100 text-green-700",
    };
  }
  return {
    label: "Attempted",
    className: "bg-amber-100 text-amber-700",
  };
}
