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
