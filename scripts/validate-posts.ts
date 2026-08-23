import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");
const POSTS_DIR = path.join(repoRoot, "posts");

interface ValidationError {
  file: string;
  message: string;
}

function findMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
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

function splitFrontmatter(content: string): { frontmatter: string; body: string } | null {
  if (!content.startsWith("---")) {
    return null;
  }
  const lines = content.split(/\r?\n/);
  if (lines[0].trim() !== "---") {
    return null;
  }
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) {
    return null;
  }
  const frontmatter = lines.slice(1, endIndex).join("\n");
  const body = lines.slice(endIndex + 1).join("\n");
  return { frontmatter, body };
}

type FrontmatterValue = string | string[] | boolean | undefined;

function parseFrontmatter(frontmatter: string): Record<string, FrontmatterValue> {
  const result: Record<string, FrontmatterValue> = {};
  const lines = frontmatter.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      if (inner === "") {
        result[key] = [];
      } else {
        result[key] = inner
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""))
          .filter((item) => item.length > 0);
      }
      continue;
    }

    if (value === "true" || value === "false") {
      result[key] = value === "true";
      continue;
    }

    value = value.replace(/^["']|["']$/g, "");
    result[key] = value;
  }

  return result;
}

function validatePost(filePath: string): ValidationError[] {
  const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
  const errors: ValidationError[] = [];
  const content = fs.readFileSync(filePath, "utf-8");

  const split = splitFrontmatter(content);
  if (!split) {
    errors.push({
      file: relativePath,
      message: "frontmatter가 없습니다. 파일이 '---'로 시작하고 닫는 '---'로 끝나야 합니다.",
    });
    return errors;
  }

  const { frontmatter, body } = split;
  const data = parseFrontmatter(frontmatter);

  const title = data.title;
  if (typeof title !== "string" || title.trim() === "") {
    errors.push({ file: relativePath, message: "title이 없거나 비어 있습니다." });
  }

  const date = data.date;
  if (typeof date !== "string" || date.trim() === "") {
    errors.push({ file: relativePath, message: "date가 없습니다." });
  } else if (!isValidDate(date)) {
    errors.push({
      file: relativePath,
      message: `date "${date}"가 YYYY-MM-DD 형식의 실제 날짜가 아닙니다.`,
    });
  }

  const description = data.description;
  if (typeof description !== "string" || description.trim() === "") {
    errors.push({ file: relativePath, message: "description이 없거나 비어 있습니다." });
  }

  const tags = data.tags;
  if (!Array.isArray(tags)) {
    errors.push({ file: relativePath, message: "tags가 없거나 배열 형식이 아닙니다. (예: [\"tag-a\", \"tag-b\"])" });
  } else if (tags.length === 0 || tags.some((tag) => typeof tag !== "string" || tag.trim() === "")) {
    errors.push({
      file: relativePath,
      message: "tags는 비어 있지 않은 문자열로 최소 1개 이상 포함해야 합니다.",
    });
  }

  const draft = data.draft;
  if (typeof draft !== "boolean") {
    errors.push({ file: relativePath, message: "draft가 없거나 boolean(true/false) 형식이 아닙니다." });
  }

  const learningSectionMatch = body.match(/##\s*학습\s*자료([\s\S]*?)(?:\n##\s|$)/);
  if (!learningSectionMatch) {
    errors.push({
      file: relativePath,
      message: "본문에 '## 학습 자료' 섹션이 없습니다.",
    });
  } else {
    const sectionContent = learningSectionMatch[1];
    const linkPattern = /(?:^|[(`\s])\.*\/?(?:notes|sessions)\/[^\s`)]+\.mdx?(?:$|[`)\s])/;
    if (!linkPattern.test(sectionContent)) {
      errors.push({
        file: relativePath,
        message: "'## 학습 자료' 섹션에 note 또는 session 상대 링크가 없습니다.",
      });
    }
  }

  return errors;
}

function main(): void {
  const files = findMdxFiles(POSTS_DIR);

  if (files.length === 0) {
    console.log("posts/에 검증할 .mdx 파일이 없습니다. (초기 상태, 정상)");
    process.exit(0);
  }

  const allErrors: ValidationError[] = [];
  for (const file of files) {
    allErrors.push(...validatePost(file));
  }

  if (allErrors.length === 0) {
    console.log(`${files.length}개의 post 검증을 통과했습니다.`);
    process.exit(0);
  }

  console.error(`${allErrors.length}개의 문제가 발견되었습니다:\n`);
  for (const error of allErrors) {
    console.error(`- [${error.file}] ${error.message}`);
  }
  process.exit(1);
}

main();
