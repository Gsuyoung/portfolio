import { test } from "node:test";
import assert from "node:assert/strict";
import { numberProjects, letterParagraphs } from "../src/lib/project-rules.mjs";

test("draft 제외, order 순 정렬, 01부터 번호", () => {
  const out = numberProjects([
    { id: "b", data: { order: 2, draft: false, troubleshooting: [] } },
    { id: "x", data: { order: 1, draft: true, troubleshooting: [] } },
    { id: "a", data: { order: 2, draft: false, troubleshooting: [{}] } },
  ]);
  assert.deepEqual(out.map((p) => [p.id, p.fileNo, p.reviewed]), [["a", "01", true], ["b", "02", false]]);
});

test("프로젝트가 없으면 빈 배열", () => {
  assert.deepEqual(numberProjects([]), []);
});

test("letter가 비면 about을 쓴다", () => {
  assert.deepEqual(letterParagraphs({ letter: [], about: ["소개"] }), ["소개"]);
  assert.deepEqual(letterParagraphs({ letter: ["편지"], about: ["소개"] }), ["편지"]);
});

test("빈 상태 문구", async () => {
  const { emptyMessage } = await import("../src/lib/project-rules.mjs");
  assert.equal(emptyMessage, "프로젝트 기록을 준비하고 있습니다.");
});
