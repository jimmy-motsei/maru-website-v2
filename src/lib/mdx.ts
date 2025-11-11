/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import { PageFrontmatter, type PageMeta } from "@/lib/types/page";

const PAGES_DIR = path.join(process.cwd(), "content/pages");

export async function getMdxBySlug(slug: string[]) {
  const file = path.join(PAGES_DIR, `${slug.join("/")}.mdx`);
  const raw = await fs.readFile(file, "utf8");
  const { content, data } = matter(raw);

  // Validate front-matter (non-blocking; logs if invalid and still proceeds)
  const parsed = PageFrontmatter.safeParse(data);
  if (!parsed.success) {
    console.warn(`[frontmatter] Invalid data in ${file}`, parsed.error.flatten());
  }

  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    },
    parseFrontmatter: false,
  });

  return { mdx, meta: (parsed.success ? parsed.data : (data as PageMeta)) };
}

// Note: next-mdx-remote wants the default export name:
function rehypeAutolinkHeadings(...args: any[]) {
  // Workaround for ESM/CJS default import differences on some setups
  return (rehypeAutolink as any)?.default?.(...args) ?? (rehypeAutolink as any)(...args);
}

export async function listPageSlugs(): Promise<string[][]> {
  async function walk(dir: string, prefix: string[] = []) {
    const out: string[][] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        out.push(...(await walk(path.join(dir, ent.name), [...prefix, ent.name])));
      } else if (ent.name.endsWith(".mdx")) {
        out.push([...prefix, ent.name.replace(/\.mdx$/, "")]);
      }
    }
    return out;
  }
  try { return await walk(PAGES_DIR); } catch { return []; }
}
