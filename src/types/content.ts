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

/** A number worth leading with, shown in the expanded profile. */
export type TeamHighlight = {
  value: string;
  label: string;
};

export type TeamRole = {
  role: string;
  org: string;
  period: string;
  detail: string;
};

export type TeamEducation = {
  program: string;
  school: string;
  period: string;
  /** Marks a credential worth calling out visually. */
  featured?: boolean;
};

export type TeamMember = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  /** One line on what this person is for, shown under the role. */
  focus: string;
  /** Live-status line rendered in the portrait HUD on hover. */
  status: string;
  description: string;
  technologies: string[];
  /** What this engineer is distinctly good at — not a duplicate of the tech list. */
  strengths: string[];
  highlights: TeamHighlight[];
  experience: TeamRole[];
  education: TeamEducation[];
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
