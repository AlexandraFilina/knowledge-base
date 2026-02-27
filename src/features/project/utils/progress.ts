import { IQuiz } from "../../../shared/storage/quizzesStorage";
import { QuizAttempt } from "../../../shared/storage/quizAttemptsStorage";

export function computeGoalsProgress(subGoals?: Array<{ done: boolean }>): number {
  if (!subGoals || subGoals.length === 0) {
    return 0;
  }
  const doneCount = subGoals.filter((sg) => sg.done).length;
  return Math.round((doneCount / subGoals.length) * 100);
}

export function computePracticeProgress(
  projectId: number,
  quizzes: IQuiz[],
  attempts: QuizAttempt[]
): number {
  const projectQuizzes = quizzes.filter((q) => q.projectId === projectId);
  if (projectQuizzes.length === 0) {
    return 0;
  }

  const latestScores: number[] = [];
  for (const quiz of projectQuizzes) {
    const quizAttempts = attempts.filter((a) => a.quizId === quiz.id);
    if (quizAttempts.length === 0) {
      continue;
    }
    const latestAttempt = quizAttempts.reduce((latest, a) =>
      new Date(a.createdAt) > new Date(latest.createdAt) ? a : latest
    );
    latestScores.push(latestAttempt.score);
  }

  if (latestScores.length === 0) {
    return 0;
  }

  const avgScore = latestScores.reduce((sum, score) => sum + score, 0) / latestScores.length;
  return Math.round(avgScore);
}

export function computeOverallProgress(
  goalsProgress: number,
  practiceProgress: number
): number {
  const result = goalsProgress * 0.7 + practiceProgress * 0.3;
  return Math.max(0, Math.min(100, Math.round(result)));
}
