
import fs from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";
const SRC = path.join(process.cwd(), "legacy");
const OUT = path.join(process.cwd(), "content/pages");
const EXCLUDE = new Set(["404.html","robots.txt","sitemap.xml","sitemap-index.xml"]);
const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
async function htmlToMdx(file) {
  const html = await fs.readFile(file, "utf8");
  const dom = new JSDOM(html);
  const main = dom.window.document.querySelector("main, .main, #main, body");
  const title = dom.window.document.querySelector("title")?.textContent?.trim();
  const md = td.turndown(main?.innerHTML || dom.window.document.body.innerHTML);
  const fm = `---\ntitle: ${JSON.stringify(title ?? "")}\n---\n\n`;
  return fm + md;
}
async function run() {
  await fs.mkdir(OUT, { recursive: true });
  for (const name of await fs.readdir(SRC)) {
    if (!name.endsWith(".html") || EXCLUDE.has(name)) continue;
    const slug = name.replace(/\.html$/, "");
    const mdx = await htmlToMdx(path.join(SRC, name));
    const dest = path.join(OUT, `${slug}.mdx`);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, mdx, "utf8");
    console.log("✓", slug);
  }
}
run().catch((e) => (console.error(e), process.exit(1)));
