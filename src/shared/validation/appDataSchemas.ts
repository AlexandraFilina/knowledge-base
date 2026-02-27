import { z } from "zod";

const ISubGoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean(),
});

const IKnowledgeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().optional(),
  type: z.enum(["article", "video", "note"]),
});

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  tags: z.array(z.string()),
  progress: z.number(),
  goal: z.string().optional(),
  subGoals: z.array(ISubGoalSchema).optional(),
  knowledge: z.array(IKnowledgeItemSchema).optional(),
});

export const QuizSchema = z.object({
  id: z.string(),
  projectId: z.number(),
  title: z.string(),
  question: z.string(),
  options: z.array(z.string()).min(2),
  correctIndex: z.number(),
});

export const AppDataSchema = z.object({
  projects: z.array(ProjectSchema),
  quizzes: z.array(QuizSchema),
});

export type AppData = z.infer<typeof AppDataSchema>;
