import fs from "fs";
import path from "path";

export interface ContentNode {
  name: string;
  path: string;
  slug: string;
  slugPath: string;
  type: "file" | "folder";
  children?: ContentNode[];
  extension?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const EXCLUDED_FILES = ["CLAUDE.md"];
const SUPPORTED_EXTENSIONS = [".md", ".pdf"];

function shouldExcludeFile(fileName: string): boolean {
  return EXCLUDED_FILES.includes(fileName);
}

function isSupportedFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

// 폴더/파일명에서 URL-safe slug 추출
// 1) "1-사전가이드" → "1", "1-1-스킬이란" → "1-1"
// 2) 숫자 prefix 없으면 한글만 제거하고 영문/숫자/하이픈만
function extractSlug(name: string): string {
  const noExt = name.replace(/\.(md|pdf)$/i, "");
  const numMatch = noExt.match(/^(\d+(?:-\d+)*)/);
  if (numMatch) return numMatch[1];
  const cleaned = noExt
    .replace(/[ㄱ-힝]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned || noExt.toLowerCase();
}

function sortFoldersFirstThenIndexFirst(a: ContentNode, b: ContentNode): number {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }

  if (a.type === "file") {
    const aIsIndex = a.name.toLowerCase() === "index.md";
    const bIsIndex = b.name.toLowerCase() === "index.md";
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;
  }

  return a.name.localeCompare(b.name, "ko");
}

export function getContentTree(
  dir: string = CONTENT_DIR,
  parentSlugPath: string = ""
): ContentNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: ContentNode[] = [];

  for (const entry of entries) {
    if (shouldExcludeFile(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(CONTENT_DIR, fullPath);
    const slug = extractSlug(entry.name);
    const slugPath = parentSlugPath ? `${parentSlugPath}/${slug}` : slug;

    if (entry.isDirectory()) {
      const children = getContentTree(fullPath, slugPath);
      nodes.push({
        name: entry.name,
        path: relativePath,
        slug,
        slugPath,
        type: "folder",
        children,
      });
    } else if (entry.isFile() && isSupportedFile(entry.name)) {
      const extension = path.extname(entry.name);
      nodes.push({
        name: entry.name,
        path: relativePath,
        slug,
        slugPath,
        type: "file",
        extension,
      });
    }
  }

  return nodes.sort(sortFoldersFirstThenIndexFirst);
}

function findNodeBySlugPath(
  nodes: ContentNode[],
  target: string
): ContentNode | null {
  for (const node of nodes) {
    if (node.slugPath === target) return node;
    if (node.children) {
      const found = findNodeBySlugPath(node.children, target);
      if (found) return found;
    }
  }
  return null;
}

function tryFindFile(basePath: string, fileName: string): string | null {
  const fullPath = path.join(basePath, fileName);
  return fs.existsSync(fullPath) ? fullPath : null;
}

export function getDocBySlug(slug: string[]): { filePath: string; exists: boolean; isPdf: boolean } {
  const target = slug.map((s) => decodeURIComponent(s)).join("/");
  const tree = getContentTree();
  const node = findNodeBySlugPath(tree, target);

  if (!node) return { filePath: "", exists: false, isPdf: false };

  if (node.type === "file") {
    const filePath = path.join(CONTENT_DIR, node.path);
    return { filePath, exists: true, isPdf: filePath.toLowerCase().endsWith(".pdf") };
  }

  // 폴더면 그 안에서 README.md / index.md 찾기
  const basePath = path.join(CONTENT_DIR, node.path);
  const readmePath = tryFindFile(basePath, "README.md");
  if (readmePath) return { filePath: readmePath, exists: true, isPdf: false };
  const indexPath = tryFindFile(basePath, "index.md");
  if (indexPath) return { filePath: indexPath, exists: true, isPdf: false };

  return { filePath: "", exists: false, isPdf: false };
}

export function getDocContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export interface FlatDoc {
  name: string;
  slug: string;
}

function flattenTree(nodes: ContentNode[]): FlatDoc[] {
  const docs: FlatDoc[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      if (node.name.toLowerCase() === "index.md") continue;
      const nameWithoutExt = node.name.replace(/\.(md|pdf)$/, "");
      docs.push({ name: nameWithoutExt, slug: node.slugPath });
    } else if (node.type === "folder" && node.children) {
      docs.push(...flattenTree(node.children));
    }
  }

  return docs;
}

export function getPrevNextDocs(currentSlug: string[]): { prev: FlatDoc | null; next: FlatDoc | null } {
  const tree = getContentTree();
  const allDocs = flattenTree(tree);
  const currentTarget = currentSlug.map((s) => decodeURIComponent(s)).join("/");

  const currentIndex = allDocs.findIndex((doc) => doc.slug === currentTarget);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  };
}
