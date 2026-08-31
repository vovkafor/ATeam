export type Service = {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  outcome: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  clientType: string;
  summary: string;
  challenge: string;
  before: string;
  approach: string[];
  implementation: string[];
  technologies: string[];
  metrics: ProjectMetric[];
  result: string;
  lessons: string[];
  isDemonstration: true;
};

export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  description: string;
  technologies: string[];
  image?: string;
  linkedin?: string;
  github?: string;
};

export type ProcessStage = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  inputs: string;
  deliverable: string;
  outcome: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};
