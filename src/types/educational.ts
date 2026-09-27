export type SafetyCategory = 'BEFORE' | 'DURING' | 'AFTER';

export interface SafetyArticle {
  id: string;
  category: SafetyCategory;
  title: string;
  summary: string;
  whatToDo: string[];
  whatNotToDo: string[];
  important: string;
  sources: string[];
}

export interface RadiationLesson {
  id: string;
  title: string;
  keyPrinciple: string;
  content: string;
  practicalRule: string;
  diagramSvgKey?: string;
}

export interface ReactorBarrier {
  level: number;
  name: string;
  description: string;
  failureThreshold: string;
}

export interface MythFactEntry {
  id: string;
  myth: string;
  fact: string;
  scientificExplanation: string;
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL' | 'LOW';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}
