import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-transition flex flex-1 flex-col">{children}</div>;
}
