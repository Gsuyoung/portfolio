import { test } from "node:test";
import assert from "node:assert/strict";
import { readDist } from "./helpers.mjs";

test("명세서 머리: 파일 번호, 결재란, 꼬리 문서 번호", async () => {
  const html = await readDist("projects/ca2sa/index.html");
  assert.match(html, /Technical Specification · FILE 0\d/);
  assert.match(html, /YOU\?/);
  assert.match(html, /GSY-2026-001-F0\d/);
});

// 현재 ca2sa.md 는 team·troubleshooting 이 없다. Task 9에서 채우면 대상 파일을 그 상태인 다른 프로젝트로 바꾼다.
test("트러블슈팅이 없으면 양식 표를 그리지 않고, team 없으면 팀 칸이 없다", async () => {
  const html = await readDist("projects/ca2sa/index.html");
  assert.doesNotMatch(html, /트러블슈팅 ·/);
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
