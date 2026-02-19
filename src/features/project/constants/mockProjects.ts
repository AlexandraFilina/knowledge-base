import { IProject } from "../interfaces/IProject";
import projectJPG from "../../../../src/card.jpg";

export const mockProjects: IProject[] = [
  {
    id: 1,
    title: "The Industrial Revolution",
    description:
      "Study of the transition to new manufacturing processes in Europe and the US, focusing on social and economic impacts.",
    image: projectJPG,
    tags: ["history", "midterm", "social-science"],
    progress: 75,
    goal: "Complete comprehensive study of Industrial Revolution with final presentation",
    subGoals: [
      { id: "1-1", title: "Research economic impacts", done: true },
      { id: "1-2", title: "Write essay on social changes", done: true },
      { id: "1-3", title: "Create presentation slides", done: false },
      { id: "1-4", title: "Practice presentation", done: false },
    ],
    knowledge: [
      { id: "k1-1", title: "Wikipedia: Industrial Revolution", type: "article", url: "https://en.wikipedia.org/wiki/Industrial_Revolution" },
      { id: "k1-2", title: "CrashCourse History: Industrial Revolution", type: "video", url: "https://youtube.com" },
      { id: "k1-3", title: "My notes: Key inventions", type: "note" },
    ],
  },
  {
    id: 2,
    title: "Cellular Biology Fundamentals",
    description:
      "Deep dive into cell structure, organelles, and the process of mitosis and meiosis for the upcoming finals.",
    image: projectJPG,
    tags: ["biology", "science", "exam-prep"],
    progress: 30,
    goal: "Master cell biology concepts for finals exam",
    subGoals: [
      { id: "2-1", title: "Study cell structure", done: true },
      { id: "2-2", title: "Learn organelles functions", done: false },
      { id: "2-3", title: "Understand mitosis process", done: false },
    ],
    knowledge: [
      { id: "k2-1", title: "Khan Academy: Cell Biology", type: "video" },
      { id: "k2-2", title: "Biology textbook chapter 5", type: "note" },
    ],
  },
  {
    id: 3,
    title: "Macroeconomics: GDP & Inflation",
    description:
      "Analyzing the relationship between national output and price levels. Includes calculation methods and fiscal policy impacts.",
    image: projectJPG,
    tags: ["economics", "university", "theory"],
    progress: 50,
    goal: "Complete macroeconomic analysis project",
    subGoals: [
      { id: "3-1", title: "Review GDP calculation methods", done: true },
      { id: "3-2", title: "Analyze inflation data", done: true },
      { id: "3-3", title: "Write policy impact section", done: false },
    ],
    knowledge: [
      { id: "k3-1", title: "Federal Reserve Economic Data", type: "article", url: "https://fred.stlouisfed.org/" },
      { id: "k3-2", title: "Lecture notes: Fiscal Policy", type: "note" },
      { id: "k3-3", title: "GDP Explained", type: "video" },
    ],
  },
  {
    id: 4,
    title: "Introduction to AI Ethics",
    description:
      "Exploring the moral implications of artificial intelligence, bias in algorithms, and the future of automation in society.",
    image: projectJPG,
    tags: ["technology", "philosophy", "essay-project"],
    progress: 10,
    goal: "Write comprehensive essay on AI ethics",
    subGoals: [
      { id: "4-1", title: "Research AI bias cases", done: false },
      { id: "4-2", title: "Review philosophical frameworks", done: false },
      { id: "4-3", title: "Outline essay structure", done: true },
      { id: "4-4", title: "Write first draft", done: false },
    ],
    knowledge: [
      { id: "k4-1", title: "Stanford AI Ethics Handbook", type: "article" },
    ],
  },
];
