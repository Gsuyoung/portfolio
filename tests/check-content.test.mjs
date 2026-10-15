import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { findTodos } from "../scripts/check-content.mjs";

async function fixture({ profile, projects }) {
  const root = await mkdtemp(path.join(tmpdir(), "check-content-"));
  const projectsDir = path.join(root, "projects");
  await mkdir(projectsDir);
  const profilePath = path.join(root, "profile.ts");
  await writeFile(profilePath, profile);
  for (const [name, body] of Object.entries(projects)) {
    await writeFile(path.join(projectsDir, name), body);
  }
  return { profilePath, projectsDir };
}

test("공개 프로젝트와 profile의 TODO만 찾는다", async () => {
  const paths = await fixture({
    profile: 'export const profile = {\n  about: ["TODO 소개"],\n};\n',
    projects: {
      "public.md": "---\ntitle: 공개\n---\n\nTODO 역할\n",
      "hidden.md": "---\ntitle: 숨김\ndraft: true\n---\n\nTODO 무시\n",
    },
  });
  const hits = await findTodos(paths);
  assert.deepEqual(hits.map((h) => path.basename(h.file)).sort(), ["profile.ts", "public.md"]);
  assert.equal(hits.find((h) => h.file.endsWith("public.md")).line, 5);
});

test("TODO가 없으면 빈 배열", async () => {
  const paths = await fixture({
    profile: 'export const profile = { about: ["소개"] };\n',
    projects: { "public.md": "---\ntitle: 공개\n---\n\n본문\n" },
  });
  assert.deepEqual(await findTodos(paths), []);
});

test("profile.ts의 주석 줄(// ...TODO)은 무시한다", async () => {
  const paths = await fixture({
    profile: '// TODO: 안내 주석\nexport const profile = { about: ["소개"] };\n',
    projects: {},
  });
  assert.deepEqual(await findTodos(paths), []);
});

test("frontmatter의 # 주석은 무시하지만 본문 제목의 TODO는 잡는다", async () => {
  const paths = await fixture({
    profile: "export const profile = {};\n",
    projects: { "p.md": "---\n# TODO 안내 주석\ntitle: 공개\n---\n\n## TODO 제목\n" },
  });
  const hits = await findTodos(paths);
  assert.deepEqual(hits.map((h) => h.line), [6]);
});
