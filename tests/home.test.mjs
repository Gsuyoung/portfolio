import { test } from "node:test";
import assert from "node:assert/strict";
import { readDist } from "./helpers.mjs";

test("첫 화면: 사이트 제목은 두 줄 도트 캔버스 + 읽히는 대체 텍스트", async () => {
  const html = await readDist("index.html");
  assert.match(html, /<canvas[^>]*aria-hidden="true"[^>]*data-dot-text="SUYOUNG(&#39;|')S\nPORTFOLIO"/);
  assert.match(html, /class="sr-only"[^>]*>Suyoung(&#39;|')s Portfolio</);
  assert.match(html, /<noscript>[\s\S]*Suyoung(&#39;|')s Portfolio[\s\S]*<\/noscript>/);
});

test("브라우저 탭 제목은 Suyoung's Portfolio", async () => {
  const html = await readDist("index.html");
  assert.match(html, /<title>Suyoung(&#39;|')s Portfolio · Backend Developer<\/title>/);
  const spec = await readDist("projects/ca2sa/index.html");
  assert.match(spec, /<title>CA2SA \| Suyoung(&#39;|')s Portfolio<\/title>/);
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

test("첫 화면: GSY 네임택은 없다", async () => {
  const html = await readDist("index.html");
  assert.doesNotMatch(html, /data-dot-text="GSY"/);
  assert.doesNotMatch(html, /class="tag"/);
});

test("비즈 캐릭터는 종이 없이 입체 구슬로, 서신의 서명 칸 위에 걸쳐 있다", async () => {
  const html = await readDist("index.html");
  const letter = html.slice(html.indexOf('aria-label="자기소개 서신"'), html.indexOf("</article>", html.indexOf('aria-label="자기소개 서신"')));
  const sig = letter.slice(letter.indexOf("Signature"));
  const start = sig.indexOf('<div class="charm"');
  assert.ok(start >= 0, "서명 칸 안에 charm 이 있어야 함");
  const charm = sig.slice(start, sig.indexOf("</svg>", start));
  assert.match(charm, /aria-hidden="true"/);
  assert.ok((charm.match(/<circle/g) ?? []).length > 400, "구슬 색 점");
  assert.ok((charm.match(/<use/g) ?? []).length > 400, "구슬마다 하이라이트·구멍(입체) 겹침");
  assert.doesNotMatch(charm, /class="(paper|tape)"/);
});

test("경력에 자격증 표가 붙어 있고 TODO 는 없다", async () => {
  const html = await readDist("index.html");
  for (const t of ["정보처리기사", "SQL 개발자 (SQLD)", "코코에이치"]) assert.ok(html.includes(t), t);
  assert.doesNotMatch(html, /\bTODO\b/);
});
