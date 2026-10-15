# 서류철 스타일 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 네이비 사이드바 디자인을 승인된 서류철 스타일(책상 콜라주 + 이력 기록부 + 기술 명세서)로 교체하고, Vercel 미리보기 배포 후 기준을 넘으면 `main` 으로 공개한다.

**Architecture:** Astro 정적 사이트. 내용은 `src/data/profile.ts` 와 `src/content/projects/*.md` 에만 두고, 화면은 작은 Astro 컴포넌트로 나눈다. 정렬·번호·도장 같은 규칙은 `src/lib/projects.ts` 의 순수 함수로 모아 단위 테스트하고, 화면은 빌드 결과(`dist/`) HTML을 읽는 통합 테스트로 검증한다.

**Tech Stack:** Astro 7, Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript, Node 24 내장 `node:test` (테스트 의존성 추가 없음), Vercel.

**Spec:** `docs/superpowers/specs/2026-10-15-document-style-redesign-design.md`
**승인 시안:** https://claude.ai/artifact/WKRNbm1APmXhGYLVdxS7Lt (원본 HTML: `docs/superpowers/specs/2026-10-15-document-style-mockup.html` — 색·간격·SVG 도면·`dotText()` 알고리즘은 이 파일을 기준으로 옮긴다)

## Global Constraints

- 색 토큰 값은 스펙 4장 표 그대로: `desk #161616`, `paper #f3f1ec`, `paper-2 #e9e6df`, `kraft #c8a575`, `kraft-ink #3b2c18`, `ink #141414`, `ink-soft #55524c`, `hair #c9c5bc`, `lime #c8f53d`, `stamp #b8352a`.
- 라임은 성과 수치, 트러블슈팅 결과 칸, 스티커에만 쓴다. 라임 위 글자는 항상 `ink`.
- 글꼴은 IBM Plex Sans KR(본문), IBM Plex Mono(라벨·숫자·서신)만. Google Fonts로 로드.
- 서명은 이미지 없이 `profile.nameSign`(= `"Suyoung Gu"`)을 고정폭 이탤릭으로 표시한다.
- 레퍼런스 앨범의 사진·일러스트·로고는 쓰지 않는다.
- 사이트 주소는 무료 `*.vercel.app`. 실제 값이 정해지기 전까지 `site` 는 설정하지 않는다(Task 8에서 설정).
- 프로젝트 내용은 커밋·코드로 확인된 사실만. 수치·트러블슈팅을 지어내지 않는다.
- 테스트 의존성을 추가하지 않는다. `node --test` 와 `node:assert` 만 쓴다.
- 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **선택 필드가 빠진 프로젝트** (`team`, `highlight`, `repo`, `troubleshooting` 없음 — 실제로 `ca2sa.md` 가 그렇다): 빈 칸이나 `undefined` 글자 없이 해당 줄만 사라져야 한다. → Task 5, Task 6 테스트.
2. **프로젝트 0개 / 전부 draft**: §04 에 빈 양식 문구가 보이고 빌드가 깨지지 않아야 한다. → Task 5 테스트.
3. **JavaScript 꺼짐·글꼴 로딩 실패**: 도트 이름 캔버스가 비어도 이름 "구수영" 이 읽혀야 한다. → Task 4 테스트(`noscript` 대체 텍스트).
4. **긴 한국어 제목·긴 이메일**: 카드·명세서 머리·연락처 칸이 375px에서 가로로 넘치지 않아야 한다. → Task 7 스크린샷 점검 항목 + `min-width: 0`/`overflow-wrap:anywhere`.
5. **공개 대상에 TODO 잔존**: `draft: true` 파일의 TODO는 무시하고, 공개 파일과 `profile.ts` 의 TODO만 잡아야 한다. → Task 1 테스트.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `scripts/check-content.mjs` | 공개 대상 TODO 검사 (CLI + `findTodos` export) |
| `src/lib/projects.ts` | 공개 프로젝트 정렬, 파일 번호, 도장 여부 |
| `src/styles/global.css` | 색·글꼴 토큰, 명세서 본문(`.spec-prose`) 스타일 |
| `src/layouts/Layout.astro` | 공통 `<head>`, 책상 배경 |
| `src/components/DotText.astro` | 도트 매트릭스 글자 |
| `src/components/desk/*.astro` | 첫 화면 콜라주 (Cover, Letter, Blueprint, Tag, Sticker, Desk) |
| `src/components/record/*.astro` | 이력 기록부 (RecordHead, FormRow, ProjectFileCard, ContactGrid) |
| `src/components/spec/*.astro` | 명세서 (SpecHeader, TroubleshootingForm) |
| `src/pages/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/404.astro` | 페이지 조립 |
| `tests/*.test.mjs` | 단위·통합 테스트 |

삭제: `src/components/SectionTitle.astro`, `src/components/SkillTags.astro` (Task 5에서 대체 후).

---

### Task 1: 내용 점검 스크립트

**Files:**
- Create: `scripts/check-content.mjs`, `tests/check-content.test.mjs`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `findTodos({ profilePath: string, projectsDir: string }): Promise<{ file: string, line: number, text: string }[]>`; CLI `npm run check:content` (TODO 있으면 목록 출력 후 exit 1, 없으면 "OK" exit 0); `npm test` = `node --test tests/`.

- [ ] **Step 1: 실패하는 테스트 작성** — 임시 폴더(`fs.mkdtemp`)에 픽스처를 만들어 검증.

```js
test("공개 프로젝트와 profile의 TODO만 찾는다", async () => {
  // profile.ts: 'about: ["TODO 소개"]'
  // public.md: frontmatter draft 없음, 본문 'TODO 역할'
  // hidden.md: frontmatter 'draft: true', 본문 'TODO 무시'
  const hits = await findTodos({ profilePath, projectsDir });
  assert.deepEqual(hits.map((h) => path.basename(h.file)).sort(), ["profile.ts", "public.md"]);
  assert.equal(hits.find((h) => h.file.endsWith("public.md")).line, 5);
});
test("TODO가 없으면 빈 배열", async () => { /* 깨끗한 픽스처 */ assert.deepEqual(hits, []); });
test("profile.ts의 주석 줄(// ...TODO)은 무시한다", async () => { /* '// TODO: 안내' 만 있는 profile */ assert.deepEqual(hits, []); });
```

- [ ] **Step 2: 실패 확인** — Run: `node --test tests/check-content.test.mjs` / Expected: FAIL (`Cannot find module '../scripts/check-content.mjs'`)
- [ ] **Step 3: `findTodos` 구현** — draft 판정은 frontmatter(첫 `---` 블록) 안의 `/^draft:\s*true\s*$/m`. 대소문자 구분 `TODO` 단어. `//` 로 시작하는 줄과 `#` YAML 주석 줄은 제외. 파일을 직접 실행하면(`import.meta.url === pathToFileURL(process.argv[1]).href`) 기본 경로(`src/data/profile.ts`, `src/content/projects`)로 검사.
- [ ] **Step 4: `package.json` 에 `"test": "node --test tests/"`, `"check:content": "node scripts/check-content.mjs"` 추가**
- [ ] **Step 5: 통과 확인** — Run: `npm test` / Expected: 3 pass. Run: `npm run check:content` / Expected: exit 1, 현재 `profile.ts` 의 TODO 줄 목록 출력(아직 내용 미완성이므로 정상).
- [ ] **Step 6: Commit** — `feat: 공개 대상 TODO 검사 스크립트 추가`

---

### Task 2: 디자인 토큰, 레이아웃, 404

**Files:**
- Modify: `src/styles/global.css` (네이비 토큰 전부 교체), `src/layouts/Layout.astro`
- Create: `src/pages/404.astro`, `tests/build.test.mjs`, `tests/helpers.mjs`

**Interfaces:**
- Produces: Tailwind 토큰 클래스 `bg-desk`, `bg-paper`, `bg-paper-2`, `bg-kraft`, `text-kraft-ink`, `text-ink`, `text-ink-soft`, `border-hair`, `bg-lime`, `text-stamp`, `font-sans`, `font-mono`; 유틸 클래스 `.label`(mono 10.5px, 0.14em, uppercase), `.sr-only`(Tailwind 기본). `Layout` props: `{ title?: string; description?: string }`(기존과 동일).
- Produces (테스트 헬퍼): `tests/helpers.mjs` 의 `readDist(route: string): Promise<string>` — `dist/` 기준 경로의 `index.html`(또는 `404.html`)을 읽는다. 통합 테스트는 모두 `npm run build` 후 실행.

- [ ] **Step 1: 실패하는 테스트**

```js
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
```

- [ ] **Step 2: 실패 확인** — Run: `npm run build && node --test tests/build.test.mjs` / Expected: FAIL (404.html 없음)
- [ ] **Step 3: 구현** — `global.css` 의 `@theme` 를 Global Constraints 색으로 교체하고 `body` 에 시안의 책상 그라데이션(`radial-gradient` 2개 + `--color-desk`). `.prose-project` 는 Task 6에서 `.spec-prose` 로 대체하므로 이 태스크에선 삭제. 404는 찢어진 서류 한 장(종이 + 아래쪽 `clip-path` 톱니), 문구 "요청하신 문서를 찾을 수 없습니다", 링크 "← 서류철로 돌아가기"(`/`). `global.css` 에 `:focus-visible { outline: 2px solid var(--color-lime); outline-offset: 2px }`.
- [ ] **Step 4: 통과 확인** — Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `feat: 서류철 디자인 토큰과 404 페이지`

> 이 시점에 기존 메인·상세는 네이비 클래스가 사라져 모양이 깨진다. Task 5·6 에서 교체되므로 정상이다. 빌드는 깨지지 않아야 한다.

---

### Task 3: 프로필 필드와 프로젝트 규칙

**Files:**
- Modify: `src/data/profile.ts`
- Create: `src/lib/projects.ts`, `tests/projects.test.mjs`

**Interfaces:**
- Produces (`profile`): 기존 필드 + `nameEn: "GU SUYOUNG"`, `nameSign: "Suyoung Gu"`, `docNo: "GSY-2026-001"`, `letter: string[]`(비면 `about` 사용). 기존 `initial`, `photo`, `tagline` 은 삭제(새 화면에서 안 씀).
- Produces (`src/lib/projects.ts`):
  - `type ProjectLike = { id: string; data: { order: number; draft: boolean; troubleshooting: unknown[] } }`
  - `numberProjects<T extends ProjectLike>(entries: T[]): (T & { fileNo: string; reviewed: boolean })[]` — draft 제외, `order` 오름차순(같으면 `id` 오름차순), `fileNo` 는 `"01"` 부터 두 자리, `reviewed = troubleshooting.length > 0`.
  - `getPublishedProjects(): Promise<PublishedProject[]>` — `getCollection("projects")` 결과를 `numberProjects` 에 넣어 반환(Astro 전용, 테스트 대상 아님). `export type PublishedProject = CollectionEntry<"projects"> & { fileNo: string; reviewed: boolean }`.
  - `letterParagraphs(profile): string[]` — `letter` 가 비어 있으면 `about`.

- [ ] **Step 1: 실패하는 테스트** — 순수 규칙(`numberProjects`, `letterParagraphs`, Task 5의 `emptyMessage`)은 Astro·TS 의존 없이 `node --test` 로 돌도록 `src/lib/project-rules.mjs` 에 두고, `src/lib/projects.ts` 는 이를 재export + `getPublishedProjects` 만 정의한다. 테스트는 `project-rules.mjs` 를 import 한다.

```js
test("draft 제외, order 순 정렬, 01부터 번호", () => {
  const out = numberProjects([
    { id: "b", data: { order: 2, draft: false, troubleshooting: [] } },
    { id: "x", data: { order: 1, draft: true, troubleshooting: [] } },
    { id: "a", data: { order: 2, draft: false, troubleshooting: [{}] } },
  ]);
  assert.deepEqual(out.map((p) => [p.id, p.fileNo, p.reviewed]), [["a", "01", true], ["b", "02", false]]);
});
test("letter가 비면 about을 쓴다", () => {
  assert.deepEqual(letterParagraphs({ letter: [], about: ["소개"] }), ["소개"]);
});
```

- [ ] **Step 2: 실패 확인** — Run: `node --test tests/projects.test.mjs` / Expected: FAIL (모듈 없음)
- [ ] **Step 3: 구현** — `src/lib/project-rules.mjs`(순수 함수 2개), `src/lib/projects.ts`(재export + `getPublishedProjects`), `profile.ts` 필드 추가.
- [ ] **Step 4: 통과 확인** — Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `feat: 프로젝트 파일 번호·검토 도장 규칙과 프로필 필드`

---

### Task 4: 도트 글자와 책상 콜라주

**Files:**
- Create: `src/components/DotText.astro`, `src/components/desk/{Desk,Cover,Letter,Blueprint,Tag,Sticker}.astro`, `tests/home.test.mjs`
- Modify: `src/pages/index.astro` (상단에 `<Desk />` 배치)

**Interfaces:**
- Consumes: `profile` (Task 3), `letterParagraphs` (Task 3).
- Produces: `DotText` props `{ text: string; color: string; font: "sans" | "mono"; density: number; align?: "left" | "center"; class?: string }`. 렌더 결과: `<span class="dot-text ...">` 안에 `<canvas aria-hidden="true" data-dot-text={text} ...>` + `<span class="sr-only">{text}</span>` + `<noscript><span class="dot-text-fallback">{text}</span></noscript>`.
- 클라이언트 스크립트(한 번만 번들): 모든 `canvas[data-dot-text]` 를 시안의 `dotText()` 알고리즘으로 그림. `document.fonts.ready` 후 다시 그림, `resize` 120ms 디바운스, `prefers-reduced-motion` 이 아니면 왼쪽→오른쪽 0.6초 찍힘 연출(연출 전에도 레이아웃 공간 유지).
- `Desk` 내용: Cover(DotText "구수영" kraft-ink density 26, 직무 `BACKEND DEVELOPER`, 기술 한 줄은 `skills` 앞 4개, 바코드), Letter(From `nameEn`+email / To `HIRING TEAM`+github, `letterParagraphs`, 날짜는 빌드 날짜 `YYYY. MM. DD`, 서명 `nameSign`), Blueprint(시안 SVG 그대로 + 도면 칸 `SYSTEM OVERVIEW / 1 : 1 / A-01`), Tag(DotText "GSY" mono density 14 center), Sticker(`PORTFOLIO 2026`, 연도는 빌드 연도).
- 배치·기울기·반응형은 시안 CSS의 `.desk`/`.cover`/`.letter`/`.blueprint`/`.tag`/`.sticker` 와 900px 미디어쿼리를 그대로 옮긴다(수정된 위치: tag `right:1%; top:470px`, sticker `left:6%; top:500px`).

- [ ] **Step 1: 실패하는 테스트**

```js
test("첫 화면: 도트 이름은 캔버스 + 읽히는 대체 텍스트", async () => {
  const html = await readDist("index.html");
  assert.match(html, /<canvas[^>]*aria-hidden="true"[^>]*data-dot-text="구수영"/);
  assert.match(html, /class="sr-only">구수영</);
  assert.match(html, /<noscript>[\s\S]*구수영[\s\S]*<\/noscript>/);
});
test("서신: 영문 이름, HIRING TEAM, 서명", async () => {
  const html = await readDist("index.html");
  for (const t of ["GU SUYOUNG", "HIRING TEAM", "Suyoung Gu", "PORTFOLIO 2026"]) assert.ok(html.includes(t), t);
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm run build && node --test tests/home.test.mjs` / Expected: FAIL
- [ ] **Step 3: 구현** (위 Interfaces 대로)
- [ ] **Step 4: 통과 확인** — Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `feat: 첫 화면 책상 콜라주와 도트 매트릭스 글자`

---

### Task 5: 개발자 이력 기록부 (메인 본문)

**Files:**
- Create: `src/components/record/{RecordHead,FormRow,ProjectFileCard,ContactGrid}.astro`
- Modify: `src/pages/index.astro`, `tests/home.test.mjs`
- Delete: `src/components/SectionTitle.astro`, `src/components/SkillTags.astro`

**Interfaces:**
- Consumes: `getPublishedProjects()` (Task 3), `profile`, `skills`, `experience`.
- Produces: `FormRow` props `{ no: string; title: string; label: string; id: string }` + slot. `ProjectFileCard` props `{ project: PublishedProject }` — 루트는 `<article class="card" data-reviewed={String(project.reviewed)}>`, 링크 `/projects/{id}/`, 머리 `FILE {fileNo}` + 기간, 제목, `summary`, `highlight` 있으면 `inline()` 으로 렌더, 기술 칩, "명세서 열기 →", `reviewed` 일 때만 `<div class="stamp">검토<br>완료</div>`.
- `src/lib/text.ts` 의 `inline(text: string): string` 은 시그니처 유지, `**강조**` 출력만 네이비 파랑 `<b>` 에서 `<mark class="bg-lime text-ink px-1">` 로 바꾼다(라임은 성과 수치용이라는 규칙과 일치).
- 서류철 탭 3개는 `<a href="#profile">01 PROFILE</a>`, `#projects`, `#contact` 앵커.
- 섹션 id: `profile`(§01 소개), `skills`(§02), `experience`(§03), `projects`(§04), `contact`(§05). 문서 머리: "개발자 이력 기록부", `name / nameEn`, `role`, `docNo`.
- 빈 상태 문구: "프로젝트 기록을 준비하고 있습니다."
- 이력서 칸: 기존 `hasResume` 로직(파일 존재 또는 `https://`) 유지, 없으면 연락처 칸에서 이력서 칸 자체를 뺀다.

- [ ] **Step 1: 실패하는 테스트** (`tests/home.test.mjs` 에 추가)

```js
test("이력 기록부 섹션 §01~§05와 탭 앵커", async () => {
  const html = await readDist("index.html");
  for (const id of ["profile", "skills", "experience", "projects", "contact"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="#projects"[^>]*>02 PROJECTS/);
  assert.match(html, /GSY-2026-001/);
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
```

빈 상태는 픽스처 빌드 대신 컴포넌트 분기 단위로 확인한다: `src/lib/project-rules.mjs` 에 `emptyMessage = "프로젝트 기록을 준비하고 있습니다."` 를 export 하고 `tests/projects.test.mjs` 에서 `numberProjects([])` 가 `[]` 인지 + 메시지 상수를 assert, `index.astro` 는 길이 0일 때 이 상수를 렌더한다.

- [ ] **Step 2: 실패 확인** — Run: `npm run build && node --test tests/home.test.mjs` / Expected: FAIL
- [ ] **Step 3: 구현** (시안의 `.file`, `.form-head`, `.row`, `.checks`, `.ledger`, `.cards`, `.card`, `.stamp`, `.contact-grid` 스타일을 Tailwind 유틸 또는 컴포넌트 `<style>` 로)
- [ ] **Step 4: 통과 확인** — Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `feat: 메인 본문을 개발자 이력 기록부 양식으로 교체`

---

### Task 6: 기술 명세서 (프로젝트 상세)

**Files:**
- Create: `src/components/spec/{SpecHeader,TroubleshootingForm}.astro`, `tests/spec.test.mjs`
- Modify: `src/pages/projects/[slug].astro`, `src/styles/global.css` (`.spec-prose`)

**Interfaces:**
- Consumes: `getPublishedProjects()` → `PublishedProject` (fileNo), `profile.nameSign`, `profile.docNo`, `inline()`. `getStaticPaths` 도 `getPublishedProjects()` 를 써서 상세와 목록의 파일 번호가 항상 같게 한다.
- Produces: `SpecHeader` props `{ project }` — `Technical Specification · FILE {fileNo}`, 제목, summary, 결재란(작성·검토 = `nameSign` 의 이니셜 형태 `S. Gu`, 승인 = 빈칸 `YOU?`), 메타 4칸(기간·역할·팀·기술; `team` 없으면 3칸), `repo`/`demo` 링크. `TroubleshootingForm` props `{ item: { title, problem, cause, solution, result } }` — 결과 칸 라벨 배경 라임.
- 조항 번호: `.spec-prose` 에 `counter-reset: clause`, 각 `h2::before { content: "제" counter(clause) "조" }`. 트러블슈팅·배운 점 섹션 제목도 같은 카운터를 이어 쓰도록 `.spec-clause h2` 로 동일 규칙 적용(본문 article과 같은 부모 안에 둔다).
- 도면: `.spec-prose pre` 에 모눈 배경(`paper-2` 20px 격자), 테두리 1.5px `ink`, 글자 `ink`(Shiki 다크 배경 무시: `!important` 로 배경·색 재정의), 가로 스크롤. `img` 도 같은 테두리.
- 꼬리: "Terms & Conditions · 본 명세서의 수치는 측정 환경에 따라 달라질 수 있습니다." + `{docNo}-F{fileNo}`.

- [ ] **Step 1: 실패하는 테스트**

```js
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
```

- [ ] **Step 2: 실패 확인** — Run: `npm run build && node --test tests/spec.test.mjs` / Expected: FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `feat: 프로젝트 상세를 기술 명세서 양식으로 교체`

---

### Task 7: 프로젝트 파일 정리와 화면 점검

**Files:**
- Modify: `src/content/projects/ca2sa.md`, `src/content/projects/studybridge.md`(커밋되지 않은 파일 → 이번에 추가)
- Modify: `src/content/projects/example-project.md` (새 양식 안내로)

**Interfaces:**
- Consumes: 스키마(변경 없음).

- [ ] **Step 1: 두 프로젝트 파일 손보기** — 원칙: 원문의 사실만 유지, 지어내지 않기.
  - `##` 제목이 곧 조항이 되므로 본문 `##` 를 명세서 순서로 정리: `프로젝트 소개` → `시스템 구성`(기존 ```text 도면) → `담당 업무` → `코드 및 기록`. `개발 기간`처럼 메타와 겹치는 절은 메타로 옮기고 본문에서 제거.
  - `studybridge.md` 의 "추가 확인 및 보완 예정" 절은 공개 페이지에 노출하지 않는다 → 항목을 파일 맨 아래 HTML 주석(`<!-- -->`)으로 옮긴다.
  - `highlight` 는 원문에 있는 문장만 사용(`ca2sa.md` 는 담당 범위 문장을 `highlight` 로, 수치 없음).
  - `order`: AcaMatch 1, CA2SA 2 (규모가 큰 쪽을 FILE 01로) — 사용자 확인 필요 시 Task 9 리뷰 때 묻는다.
- [ ] **Step 2: `npm run build && npm test`** / Expected: PASS
- [ ] **Step 3: 스크린샷 점검** — `npm run preview` 후 Edge 헤드리스로 1366px(메인·`/projects/studybridge/`·`/404`)와 375px(iframe 방식) 캡처. 확인 항목: 콜라주 겹침이 글자를 가리지 않음, 375px 가로 스크롤 없음(경력 표는 표 안에서만), 긴 제목 `AcaMatch (StudyBridge) · 2차 개발 / 3차 고도화` 줄바꿈, 긴 이메일 칸 안 줄바꿈, 도면 블록 가독성. 발견 사항은 해당 컴포넌트에서 고치고 다시 1회 캡처.
- [ ] **Step 4: Commit** — `content: 학원 프로젝트 2건을 명세서 양식에 맞게 정리`

---

### Task 8: 배포 기본값과 Vercel 미리보기

**Files:**
- Create: `public/og.png` (1200×630), `public/favicon.svg` (교체), `scripts/og-template.html`
- Modify: `astro.config.mjs` (`site`), `src/layouts/Layout.astro` (`og:image`, `og:url`, `canonical`)

**Interfaces:**
- Consumes: Vercel 기본 주소(사용자가 Import 후 알려줌).

- [ ] **Step 1: 파비콘** — 크래프트 정사각형 위 `ink` 도트로 찍은 "G" (SVG `circle` 격자, 7×7). Astro 기본 `favicon.ico` 삭제, `Layout` 의 ico 링크 제거.
- [ ] **Step 2: OG 이미지** — `scripts/og-template.html`(책상 배경 + 크래프트 표지 + "구수영 · BACKEND DEVELOPER")을 Edge 헤드리스 `--window-size=1200,630 --screenshot` 로 `public/og.png` 생성. 생성 명령을 README "배포" 절에 한 줄로 기록.
- [ ] **Step 3: (사용자) Vercel 연결** — vercel.com → GitHub 로그인 → `Gsuyoung/portfolio` Import → 기본 설정으로 Deploy. 받은 주소(예: `https://portfolio-xxxx.vercel.app`)를 알려준다.
- [ ] **Step 4: `site` 설정** — `astro.config.mjs` 에 `site: "<받은 주소>"`, `Layout` 에 `og:image = new URL("/og.png", Astro.site)`, `og:url`, `<link rel="canonical">`.
- [ ] **Step 5: 테스트 추가 후 통과 확인** (`tests/build.test.mjs`)

```js
test("OG 이미지와 canonical이 절대 주소", async () => {
  const html = await readDist("index.html");
  assert.match(html, /property="og:image" content="https:\/\/[^"]+\/og\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\//);
});
```

Run: `npm run build && npm test` / Expected: PASS
- [ ] **Step 6: Commit & push** — `feat: 파비콘·OG 이미지·사이트 주소 설정` → `git push` (feature/initial-setting). 미리보기 주소에서 메인·상세·404·링크 4종(레포, GitHub, 이메일, 이력서) 확인.

---

### Task 9: 정식 공개 게이트

**Files:** 없음 (내용은 사용자 제공)

- [ ] **Step 1: 내용 채우기** — 사용자에게서 About, 경력, 대표 프로젝트 1건의 실제 트러블슈팅(문제·원인·해결·결과)을 받아 `profile.ts` 와 해당 `.md` 에 반영. 지어내지 않는다.
- [ ] **Step 2: 게이트 확인** — Run: `npm run check:content` / Expected: `OK` (exit 0). Run: `npm run build && npm test` / Expected: PASS. 스펙 1장 성공 기준 4개를 미리보기 주소에서 하나씩 확인.
- [ ] **Step 3: (사용자 확인 후) `main` 병합** — GitHub에서 `feature/initial-setting` → `main` PR 생성·병합(또는 사용자가 원하면 로컬 병합 후 push). Vercel 정식 주소에서 최종 확인.
