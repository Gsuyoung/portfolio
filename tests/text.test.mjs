import { test } from "node:test";
import assert from "node:assert/strict";
import { inline } from "../src/lib/text.ts";

test("**강조**는 라임 mark, HTML은 이스케이프", () => {
  assert.equal(inline("응답 **820ms → 140ms** <b>"), '응답 <mark class="bg-lime text-ink px-1">820ms → 140ms</mark> &lt;b&gt;');
});
