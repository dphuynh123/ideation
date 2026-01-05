
export interface UserInput {
  interests: string;
  skills: string;
  marketTrends: string;
}

export interface BusinessIdea {
  title: string;
  description: string;
  id: string;
  tasks?: TaskMindMap;
}

export interface Problem {
  problemTitle: string;
  businessIdeas: BusinessIdea[];
}

export interface MindMapData {
  centralTopic: string;
  problems: Problem[];
}

export interface Point {
  x: number;
  y: number;
}

export interface TaskMindMap {
  projectId: string;
  project_name: string;
  estimated_total_duration: string;
  development_phases: DevelopmentPhase[];
}

export interface DevelopmentPhase {
  phase: string;
  duration: string;
  tasks: Task[];
}

export interface Task {
  task: string;
  duration: string;
}
