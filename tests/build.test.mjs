import { test } from "node:test";
import assert from "node:assert/strict";
import { readDist } from "./helpers.mjs";

test("404 페이지가 있고 메인으로 가는 링크가 있다", async () => {
  const html = await readDist("404.html");
  assert.match(html, /요청하신 문서를 찾을 수 없습니다/);
  assert.match(html, /href="\/"/);
});

test("공통 레이아웃: 한국어, IBM Plex 글꼴, 책상 배경", async () => {
  const html = await readDist("404.html");
  assert.match(html, /<html lang="ko"/);
  assert.match(html, /IBM\+Plex\+Sans\+KR/);
  assert.match(html, /class="[^"]*bg-desk/);
});

test("파비콘은 크래프트 도트 G, 기본 ico 없음", async () => {
  const svg = await readDist("favicon.svg");
  assert.match(svg, /#c8a575/);
  assert.ok((svg.match(/<circle/g) ?? []).length >= 10);
  await assert.rejects(readDist("favicon.ico"));
});

test("링크 미리보기 이미지 파일이 있다", async () => {
  const { stat } = await import("node:fs/promises");
  const s = await stat("dist/og.png");
  assert.ok(s.size > 10_000);
});

test("OG 이미지와 canonical이 정식 주소 기준 절대 주소", async () => {
  const html = await readDist("index.html");
  assert.match(html, /property="og:image" content="https:\/\/portfolio-wine-mu-78\.vercel\.app\/og\.png"/);
  assert.match(html, /property="og:url" content="https:\/\/portfolio-wine-mu-78\.vercel\.app\/"/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio-wine-mu-78\.vercel\.app\/"/);
  const spec = await readDist("projects/ca2sa/index.html");
  assert.match(spec, /rel="canonical" href="https:\/\/portfolio-wine-mu-78\.vercel\.app\/projects\/ca2sa\/"/);
});
