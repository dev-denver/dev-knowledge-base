import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

const TEMPLATE_PATH = path.join(repoRoot, "templates", "session-template.md");
const SESSIONS_DIR = path.join(repoRoot, "sessions");

function printUsage(): void {
  console.error(
    [
      "Usage:",
      '  npm run new:session -- <category> "<topic>"',
      '  npm run new:session -- <category> "<topic>" --date YYYY-MM-DD',
    ].join("\n")
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function localDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseArgs(argv: string[]): {
  category: string;
  topic: string;
  date: string;
} | null {
  const positional: string[] = [];
  let date: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--date") {
      date = argv[i + 1];
      i++;
    } else {
      positional.push(arg);
    }
  }

  const [category, topic] = positional;
  if (!category || !topic) {
    return null;
  }

  if (date !== undefined && !isValidDate(date)) {
    console.error(`Error: "${date}" is not a valid date in YYYY-MM-DD format.`);
    return null;
  }

  return { category, topic, date: date ?? localDateString() };
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed) {
    printUsage();
    process.exit(1);
  }

  const { category, topic, date } = parsed;

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Error: template not found at ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const categorySlug = slugify(category);
  const topicSlug = slugify(topic);

  if (!categorySlug || !topicSlug) {
    console.error("Error: category and topic must contain at least one alphanumeric character.");
    process.exit(1);
  }

  const fileName = `${date}-${categorySlug}-${topicSlug}.md`;
  const filePath = path.join(SESSIONS_DIR, fileName);

  if (fs.existsSync(filePath)) {
    console.error(
      `Error: session file already exists: sessions/${fileName}\n` +
        "Refusing to overwrite. Open the existing file and continue it instead."
    );
    process.exit(1);
  }

  fs.mkdirSync(SESSIONS_DIR, { recursive: true });

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const content = template
    .replaceAll("{{TOPIC}}", topic)
    .replaceAll("{{DATE}}", date)
    .replaceAll("{{CATEGORY}}", category);

  fs.writeFileSync(filePath, content, "utf-8");

  const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
  console.log(`Created ${relativePath}`);
}

main();
