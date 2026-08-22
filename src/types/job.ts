export type JobStatus =
  | 'bookmarked'
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'archived';

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite' | 'Relocation Required';

export type InterviewStageType =
  | 'Technical Screening / OA'
  | 'Live Coding / Practical Assessment'
  | 'Architecture & System Design'
  | 'Cultural / Leadership Fit / HR'
  | string;

export interface InterviewMilestone {
  id: string;
  stage: InterviewStageType;
  date?: string;
  completed: boolean;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  fromStatus?: JobStatus;
  toStatus: JobStatus;
  note?: string;
}

export interface Financials {
  salaryRange?: string;
  baseSalary?: number;
  bonus?: number;
  currency?: string;
}

export interface Referral {
  name?: string;
  contact?: string;
  lastPingedDate?: string;
}

export interface Assets {
  resumeVersion?: string;
  portfolioUrl?: string;
  coverLetterUrl?: string;
  notes?: string;
}

export interface ColdMessageTemplates {
  recruiter?: string;
  hiringManager?: string;
  peer?: string;
}

export interface AiData {
  rawJd?: string;
  parsedCompetencies?: string[];
  requiredExperience?: string;
  generatedQuestions?: string[];
  coldMessages?: ColdMessageTemplates;
  lastAnalyzedAt?: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  url?: string;
  status: JobStatus;
  techStack: string[];
  referral?: Referral;
  assets?: Assets;
  financials?: Financials;
  workMode: WorkMode;
  location?: string;
  timeline: TimelineEvent[];
  interviewPipeline: InterviewMilestone[];
  aiData?: AiData;
  appliedDate: string;
  updatedAt: string;
}

export type AiProvider = 'offline' | 'openai' | 'anthropic' | 'ollama';

export interface AiSettings {
  provider: AiProvider;
  apiKey?: string;
  ollamaUrl?: string; // default e.g. http://localhost:11434
  modelName?: string; // e.g. gpt-4o, claude-3-5-sonnet, llama3
}

export interface BoardColumn {
  id: JobStatus;
  title: string;
  color: string;
  badgeBg: string;
  iconName: string;
}
