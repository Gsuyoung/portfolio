# portfolio

백엔드 개발자 구수영의 포트폴리오 사이트입니다. Astro + Tailwind CSS로 만들고 Vercel에 배포합니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 파일 생성
```

## 내용 수정

화면 코드는 건드리지 않고 아래 파일만 고치면 됩니다.

| 파일 | 내용 |
|---|---|
| `src/data/profile.ts` | 이름, 한 줄 소개, About, 기술 스택, 경력, 연락처 |
| `src/content/projects/*.md` | 프로젝트 하나당 파일 하나. 파일 이름이 `/projects/파일이름/` 주소가 됩니다 |
| `public/resume.pdf` | 이력서 PDF |
| `public/profile.jpg` | 프로필 사진 (쓰려면 `profile.ts` 의 `photo` 를 `"/profile.jpg"` 로) |

### 프로젝트 추가

1. `src/content/projects/example-project.md` 를 복사해 `영문-프로젝트명.md` 로 저장
2. 맨 위 설정(기간, 역할, 기술, 핵심 성과, 트러블슈팅, 배운 점)과 본문(구조도, 담당 역할, API 예시)을 채우기
3. `draft: true` 줄을 지우면 사이트에 보입니다

## 구조

```text
src/
├─ data/profile.ts          기본 정보
├─ content/projects/        프로젝트 Markdown
├─ content.config.ts        프로젝트 항목 형식 정의
├─ layouts/Layout.astro     공통 <head>
├─ components/              기술 태그, 섹션 제목
├─ pages/index.astro        메인 (사이드바 + 소개/경력/프로젝트)
└─ pages/projects/[slug].astro  프로젝트 상세
```

## 배포

- `feature/initial-setting` 등 작업 브랜치에 push하면 Vercel 미리보기가, `main` 에 병합하면 정식 주소가 배포됩니다.
- 공개 전 점검: `npm run check:content` (공개 대상에 TODO가 없어야 함), `npm run build && npm test`
- 링크 미리보기 이미지(`public/og.png`)는 `scripts/og-template.html` 을 1200×630 으로 캡처해 만듭니다.
  예: `msedge --headless=new --window-size=1200,630 --virtual-time-budget=8000 --screenshot=public/og.png scripts/og-template.html`
