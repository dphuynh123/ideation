
export interface UserInput {
  interests: string;
  skills: string;
  marketTrends: string;
}

export interface BusinessIdea {
  title: string;
  description: string;
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
