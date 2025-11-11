import { z } from "zod";

export const PageFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),          // ISO yyyy-mm-dd if available
  canonical: z.string().optional(),     // e.g. '/services'
  draft: z.boolean().optional(),        // hide from nav/sitemap if true
  tags: z.array(z.string()).optional(),
});

export type PageMeta = z.infer<typeof PageFrontmatter>;
