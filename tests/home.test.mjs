import { test } from "node:test";
import assert from "node:assert/strict";
import { readDist } from "./helpers.mjs";

test("첫 화면: 도트 이름은 캔버스 + 읽히는 대체 텍스트", async () => {
  const html = await readDist("index.html");
  assert.match(html, /<canvas[^>]*aria-hidden="true"[^>]*data-dot-text="구수영"/);
  assert.match(html, /class="sr-only"[^>]*>구수영</);
  assert.match(html, /<noscript>[\s\S]*구수영[\s\S]*<\/noscript>/);
});

test("서신: 영문 이름, HIRING TEAM, 서명", async () => {
  const html = await readDist("index.html");
  for (const t of ["GU SUYOUNG", "HIRING TEAM", "Suyoung Gu", "PORTFOLIO 2026"]) assert.ok(html.includes(t), t);
});
