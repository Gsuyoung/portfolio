import { readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");

// "index.html", "404.html", "projects/ca2sa/index.html" 처럼 dist 기준 경로로 빌드 결과를 읽습니다.
export function readDist(route) {
  return readFile(path.join(dist, route), "utf8");
}
