export type Service = {
  slug: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
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
  /** What you actually get at the end of this step. */
  deliverable: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};
