import { rm, cp } from "node:fs/promises";

console.log("Syncing legacy assets...");

const targets = [
  { src: "legacy/img", dest: "public/images" },
  { src: "legacy/assets", dest: "public/assets" },
  { src: "legacy/js", dest: "public/legacy/js" },
];

try {
    for (const { src, dest } of targets) {
        console.log(`- Removing old ${dest}`);
        await rm(dest, { recursive: true, force: true });
        console.log(`- Copying ${src} to ${dest}`);
        await cp(src, dest, { recursive: true });
    }
    console.log("✓ Legacy assets synced");
} catch (error) {
    console.error("✗ Error syncing legacy assets:", error);
    process.exit(1);
}
