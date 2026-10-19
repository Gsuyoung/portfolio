import { test } from "node:test";
import assert from "node:assert/strict";
import { readDist } from "./helpers.mjs";

test("명세서 머리: 파일 번호, 결재란, 꼬리 문서 번호", async () => {
  const html = await readDist("projects/ca2sa/index.html");
  assert.match(html, /Technical Specification · FILE 0\d/);
  assert.match(html, /YOU\?/);
  assert.match(html, /GSY-2026-001-F0\d/);
});

// 공개된 프로젝트는 모두 트러블슈팅이 있다. ca2sa.md 는 team 이 없어 팀 칸이 빠지는지도 함께 본다.
test("트러블슈팅은 양식 표로 그리고, team 없으면 팀 칸이 없다", async () => {
  const html = await readDist("projects/ca2sa/index.html");
  assert.match(html, /트러블슈팅 ·/);
  assert.doesNotMatch(html, />팀</);
  assert.doesNotMatch(html, />\s*undefined\s*</);
});

test("본문 코드 블록은 도면 스타일 대상", async () => {
  const html = await readDist("projects/studybridge/index.html");
  assert.match(html, /class="spec-prose[\s\S]*<pre/);
});

test("상세의 파일 번호는 목록과 같다", async () => {
  const home = await readDist("index.html");
  const cards = home.split('<article class="card"').slice(1);
  const card = cards.find((c) => c.includes('href="/projects/ca2sa/"'));
  const fileNo = card.match(/FILE (\d\d)/)[1];
  const spec = await readDist("projects/ca2sa/index.html");
  assert.match(spec, new RegExp(`Technical Specification · FILE ${fileNo}`));
});
