import { ApiFlow } from "@/components/visuals/api-flow";
import { AuditRadar } from "@/components/visuals/audit-radar";
import { CoverageHeatmap } from "@/components/visuals/coverage-heatmap";
import { LoadProfile } from "@/components/visuals/load-profile";
import { PipelineFlow } from "@/components/visuals/pipeline-flow";

const visuals = {
  "web-ui-automation": CoverageHeatmap,
  "api-automation": ApiFlow,
  "ci-cd-integration": PipelineFlow,
  "performance-testing": LoadProfile,
  "qa-architecture-audit": AuditRadar,
} as const;

/** Picks the infographic that belongs to a service, keyed by its slug. */
export function ServiceVisual({ slug }: { slug: string }) {
  const Visual = visuals[slug as keyof typeof visuals] ?? CoverageHeatmap;
  return <Visual />;
}
