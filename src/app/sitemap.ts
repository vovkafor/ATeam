import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/work", "/process", "/about", "/book", "/privacy"];
  return [
    ...routes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: `${siteConfig.siteUrl}/work/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
