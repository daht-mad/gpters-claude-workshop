import { getContentTree } from "@/lib/content";
import { redirect } from "next/navigation";

export default function DocsIndexPage() {
  const tree = getContentTree();

  function findFirstDoc(nodes: typeof tree): string | null {
    for (const node of nodes) {
      if (node.type === "file") {
        return `/docs/${node.slugPath}`;
      }
      if (node.type === "folder" && node.children) {
        const found = findFirstDoc(node.children);
        if (found) return found;
      }
    }
    return null;
  }

  const firstDocPath = findFirstDoc(tree);
  if (firstDocPath) {
    redirect(firstDocPath);
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-bold">🚢 다혜의 방주</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        왼쪽 사이드바에서 문서를 선택하세요.
      </p>
    </div>
  );
}
