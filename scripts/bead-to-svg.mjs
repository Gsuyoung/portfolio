// 비즈 그림(PNG)을 구슬 하나당 점 하나로 다시 찍어 SVG 로 만듭니다.
// 사용법: node scripts/bead-to-svg.mjs  →  src/assets/bead-charm.svg
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "src/assets/bead-charm.png";
const OUT = "src/assets/bead-charm.svg";
const BG = [247, 246, 242]; // 원본 배경색
const PITCH = 14; // 구슬 간격(px)
const MARGIN = 0; // 종이 없이 모양만 쓰므로 둘레 여백 없음

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => {
  const i = (Math.round(y) * W + Math.round(x)) * 3;
  return [data[i], data[i + 1], data[i + 2]];
};
const isBg = ([r, g, b]) => Math.abs(r - BG[0]) + Math.abs(g - BG[1]) + Math.abs(b - BG[2]) < 40;

// 캐릭터가 차지하는 영역
let minX = W, maxX = 0, minY = H, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (isBg(at(x, y))) continue;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
}
const cols = Math.round((maxX - minX + 1) / PITCH);
const rows = Math.round((maxY - minY + 1) / PITCH);
const px = (maxX - minX + 1) / cols;
const py = (maxY - minY + 1) / rows;

// 구슬 가운데 주변 3x3 의 평균 색. 고리 무늬(밝은 원)를 피하려고 중심 가까이만 봅니다.
function beadColor(cx, cy) {
  let r = 0, g = 0, b = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const c = at(cx + dx, cy + dy);
      r += c[0]; g += c[1]; b += c[2];
    }
  }
  return [r / 9, g / 9, b / 9].map(Math.round);
}
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");

// 흰 구슬은 배경과 색이 비슷하지만 회색 고리 무늬가 있어 칸 안의 밝기 차이가 큽니다. 배경은 평평합니다.
function hasRing(cx, cy) {
  let lo = 255 * 3, hi = 0;
  const half = Math.floor(Math.min(px, py) / 2) - 1;
  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const s = at(cx + dx, cy + dy).reduce((a, b) => a + b);
      lo = Math.min(lo, s); hi = Math.max(hi, s);
    }
  }
  return hi - lo > 60;
}

const dots = [];
for (let j = 0; j < rows; j++) {
  for (let i = 0; i < cols; i++) {
    const cx = minX + (i + 0.5) * px;
    const cy = minY + (j + 0.5) * py;
    const c = beadColor(cx, cy);
    // 배경과 비슷한 색은 배경보다 더 밝고(흰 구슬) 고리 무늬가 있을 때만 구슬로 칩니다.
    const white = Math.min(...c) >= 249 && hasRing(cx, cy);
    if (isBg(c) && !white) continue;
    const x = i + MARGIN + 0.5;
    const y = j + MARGIN + 0.5;
    const stroke = white ? ` stroke="#c9c5bc" stroke-width="0.06"` : "";
    // 구슬 색 위에 공통 입체 효과(#b: 음영·빛 반사·구멍)를 겹칩니다.
    dots.push(`<circle cx="${x}" cy="${y}" r="0.44" fill="${hex(c)}"${stroke}/><use href="#b" x="${x}" y="${y}"/>`);
  }
}

const vw = cols + MARGIN * 2;
const vh = rows + MARGIN * 2;
// 퓨즈 비즈 한 알의 입체 효과: 가장자리는 어둡게, 왼쪽 위에 빛 반사, 가운데에 구멍.
const defs = [
  `<radialGradient id="s" cx="0.38" cy="0.32" r="0.7">`,
  `<stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/>`,
  `</radialGradient>`,
  `<g id="b">`,
  `<circle r="0.44" fill="url(#s)"/>`,
  `<ellipse cx="-0.15" cy="-0.19" rx="0.15" ry="0.09" transform="rotate(-30 -0.15 -0.19)" fill="#fff" fill-opacity="0.55"/>`,
  `<circle r="0.11" fill="#000" fill-opacity="0.28"/>`,
  `</g>`,
].join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw * 6}" height="${vh * 6}"><defs>${defs}</defs>${dots.join("")}</svg>\n`;
await writeFile(OUT, svg);
console.log(`${cols}x${rows} 구슬, 점 ${dots.length}개 → ${OUT}`);
