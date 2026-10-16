// 사이트 전체에서 쓰는 기본 정보. 노션 내용이 정리되면 여기를 채우세요.
export const profile = {
  name: "구수영",
  // 표지·브라우저 탭·링크 미리보기에 쓰는 사이트 이름
  siteTitle: "Suyoung's Portfolio",
  nameEn: "GU SUYOUNG",
  // 서명 칸에 고정폭 이탤릭으로 표시됩니다.
  nameSign: "Suyoung Gu",
  role: "Backend Developer",
  // 이력 기록부와 기술 명세서에 찍히는 문서 번호
  docNo: "GSY-2026-001",
  // 이력 기록부 §01 소개. 문단마다 한 줄씩.
  about: [
    "기능 구현을 넘어 데이터 정합성, 서비스 안정성, 유지보수성까지 함께 고민하는 백엔드 개발자입니다.",
    "Spring Boot · JPA · MariaDB 기반의 REST API 개발과 Redis 세션 인증을 주로 다뤄 왔습니다.",
  ],
  // 첫 화면 서신에 쓰는 문단. 비워 두면 about 을 그대로 씁니다.
  letter: [
    "산업경영공학을 전공하며 데이터와 프로세스에 관심을 가졌고, 지금은 백엔드 개발자로 API 개발부터 인증 · 세션 관리, 서버 배포까지 경험하고 있습니다.",
    "기능이 동작하는 데서 끝내지 않으려 합니다. 로그아웃한 쿠키가 재로그인 뒤 다시 유효해지는 문제를 찾아 로그인마다 고유한 세션 ID를 발급하도록 바꾼 것처럼, 원인을 찾아 반복되지 않게 만드는 일을 중요하게 생각합니다.",
    "프론트엔드와 API 명세를 함께 맞춰 가고, 처음 맡는 기술도 배우며 해결하는, 함께 일하기 편한 개발자가 되고 싶습니다.",
  ] as string[],
  github: "https://github.com/Gsuyoung",
  email: "suyoung606123@gmail.com",
  // 이력서 버튼. public/resume.pdf 파일이 있거나, 노션·구글 드라이브 공유 링크(https://...)를 넣으면 보입니다.
  // 파일이 없으면 버튼은 자동으로 숨겨집니다. 레포가 공개라 PDF에는 개인정보를 빼고 넣으세요.
  resume: "/resume.pdf",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Language", items: ["Java", "SQL"] },
  { group: "Framework", items: ["Spring Boot", "Spring Data JPA", "MyBatis"] },
  { group: "Data", items: ["MariaDB", "MySQL", "Redis"] },
  { group: "API · Auth", items: ["REST API", "OAuth", "Swagger UI"] },
  { group: "Tool", items: ["Docker", "Git · GitHub", "Postman", "IntelliJ IDEA"] },
];

// 경력. 최신순.
export const experience: { period: string; title: string; items: string[] }[] = [
  {
    period: "2026.05 – 현재",
    title: "코코에이치 · 백엔드 개발",
    items: [
      "Spring Boot · JPA 기반 REST API 개발",
      "Redis 세션 기반 관리자 인증 개선",
      "외부 실행 파일과 연동하는 결제 모듈 개발",
      "프론트엔드와 API 명세 · 요청 · 응답 구조 조율",
      "Nginx 설정을 포함한 서버 배포 · 로그 확인",
    ],
  },
];

// 자격증. 최신순.
export const certificates: { date: string; name: string; issuer: string }[] = [
  { date: "2026.09", name: "정보처리기사", issuer: "한국산업인력공단" },
  { date: "2025.12", name: "SQL 개발자 (SQLD)", issuer: "한국데이터베이스진흥센터" },
];
