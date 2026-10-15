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

test("이력 기록부 섹션 §01~§05와 탭 앵커", async () => {
  const html = await readDist("index.html");
  for (const id of ["profile", "skills", "experience", "projects", "contact"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="#projects"[^>]*>02 PROJECTS/);
  assert.match(html, /GSY-2026-001/);
  assert.match(html, /개발자 이력 기록부/);
});

test("도장은 reviewed 카드에만, undefined 노출 없음", async () => {
  const html = await readDist("index.html");
  const cards = html.split('<article class="card"').slice(1);
  assert.ok(cards.length > 0);
  for (const c of cards) {
    const body = c.slice(0, c.indexOf("</article>"));
    assert.equal(body.includes('class="stamp'), body.startsWith(' data-reviewed="true"'));
  }
  assert.doesNotMatch(html, />\s*undefined\s*</);
  assert.match(html, /FILE 01/);
});

test("예전 네이비 사이드바는 사라졌다", async () => {
  const html = await readDist("index.html");
  assert.doesNotMatch(html, /navy-/);
});
