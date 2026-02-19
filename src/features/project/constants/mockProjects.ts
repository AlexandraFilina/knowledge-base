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
  },
  {
    id: 2,
    title: "Cellular Biology Fundamentals",
    description:
      "Deep dive into cell structure, organelles, and the process of mitosis and meiosis for the upcoming finals.",
    image: projectJPG,
    tags: ["biology", "science", "exam-prep"],
    progress: 30,
  },
  {
    id: 3,
    title: "Macroeconomics: GDP & Inflation",
    description:
      "Analyzing the relationship between national output and price levels. Includes calculation methods and fiscal policy impacts.",
    image: projectJPG,
    tags: ["economics", "university", "theory"],
    progress: 50,
  },
  {
    id: 4,
    title: "Introduction to AI Ethics",
    description:
      "Exploring the moral implications of artificial intelligence, bias in algorithms, and the future of automation in society.",
    image: projectJPG,
    tags: ["technology", "philosophy", "essay-project"],
    progress: 10,
  },
];
