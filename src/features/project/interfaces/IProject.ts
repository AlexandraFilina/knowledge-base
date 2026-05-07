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

export interface IModuleKnowledgeItem {
  id: string;
  title: string;
  type: "article" | "video" | "note";
  url?: string;
  content?: string;
  createdAt: string;
}

export interface IModule {
  id: string;
  title: string;
  description?: string;
  goals: ISubGoal[];
  knowledge?: IModuleKnowledgeItem[];
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