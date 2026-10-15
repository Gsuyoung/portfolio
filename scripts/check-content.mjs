// 공개될 내용에 TODO가 남아 있는지 검사합니다.
// 사용법: npm run check:content  (TODO가 있으면 목록을 출력하고 exit 1)
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TODO = /\bTODO\b/;

function scanLines(file, lines, { skip }) {
  const hits = [];
  lines.forEach((text, i) => {
    if (TODO.test(text) && !skip(text, i)) hits.push({ file, line: i + 1, text: text.trim() });
  });
  return hits;
}

// 첫 줄이 --- 이면 다음 --- 까지를 frontmatter로 봅니다. 반환값은 닫는 줄의 index (없으면 -1).
function frontmatterEnd(lines) {
  if (lines[0]?.trim() !== "---") return -1;
  return lines.findIndex((l, i) => i > 0 && l.trim() === "---");
}

export async function findTodos({ profilePath, projectsDir }) {
  const hits = [];

  const profileLines = (await readFile(profilePath, "utf8")).split(/\r?\n/);
  hits.push(...scanLines(profilePath, profileLines, { skip: (t) => t.trim().startsWith("//") }));

  const files = (await readdir(projectsDir)).filter((f) => f.endsWith(".md")).sort();
  for (const name of files) {
    const file = path.join(projectsDir, name);
    const lines = (await readFile(file, "utf8")).split(/\r?\n/);
    const end = frontmatterEnd(lines);
    const frontmatter = end > 0 ? lines.slice(1, end).join("\n") : "";
    if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
    hits.push(...scanLines(file, lines, { skip: (t, i) => i < end && t.trim().startsWith("#") }));
  }
  return hits;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const hits = await findTodos({
    profilePath: path.resolve("src/data/profile.ts"),
    projectsDir: path.resolve("src/content/projects"),
  });
  if (hits.length === 0) {
    console.log("OK: 공개 대상에 TODO가 없습니다.");
  } else {
    console.log(`공개 대상에 TODO ${hits.length}개가 남아 있습니다.`);
    for (const h of hits) console.log(`  ${path.relative(process.cwd(), h.file)}:${h.line}  ${h.text}`);
    process.exitCode = 1;
  }
}
