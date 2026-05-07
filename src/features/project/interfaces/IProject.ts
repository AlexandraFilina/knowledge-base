export interface ISubGoal {
  id: string;
  title: string;
  done: boolean;
}

export interface IKnowledgeItem {
  id: string;
  title: string;
  url?: string;
  type: "article" | "video" | "note";
}

export interface IModule {
  id: string;
  title: string;
  description?: string;
  goals: ISubGoal[];
}

export interface IProject {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  progress: number;
  goal?: string;
  subGoals?: ISubGoal[];
  knowledge?: IKnowledgeItem[];
  modules?: IModule[];
}