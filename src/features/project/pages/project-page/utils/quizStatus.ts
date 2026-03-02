export function getQuizStatus(lastScore: number | null): {
  label: string;
  className: string;
} {
  if (lastScore === null) {
    return {
      label: "Not started",
      className:
        "inline-flex items-center rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-700",
    };
  }
  if (lastScore >= 70) {
    return {
      label: "Passed",
      className:
        "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800",
    };
  }
  return {
    label: "Attempted",
    className:
      "inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800",
  };
}
