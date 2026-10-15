// 사이트 전체에서 쓰는 기본 정보. 노션 내용이 정리되면 여기를 채우세요.
export const profile = {
  name: "구수영",
  initial: "수",
  nameEn: "GU SUYOUNG",
  // 서명 칸에 고정폭 이탤릭으로 표시됩니다.
  nameSign: "Suyoung Gu",
  role: "Backend Developer",
  // 이력 기록부와 기술 명세서에 찍히는 문서 번호
  docNo: "GSY-2026-001",
  tagline: "Java · Spring Boot로 안정적인 서버를 만듭니다.",
  // TODO: 노션의 자기소개로 바꿔 주세요. 문단마다 한 줄씩.
  about: [
    "요청이 들어와서 응답이 나갈 때까지의 흐름을 이해하고, 그 과정을 더 빠르고 안전하게 만드는 일을 좋아하는 백엔드 개발자입니다.",
    "TODO: 주로 다뤄 온 영역(인증·권한, API 설계, 쿼리 성능 등)을 한 줄로 적어 주세요.",
  ],
  // 첫 화면 서신에 쓰는 문단. 비워 두면 about 을 그대로 씁니다.
  letter: [] as string[],
  // 프로필 사진을 쓰려면 public/profile.jpg 를 넣고 "/profile.jpg" 로 바꾸세요.
  photo: null as string | null,
  github: "https://github.com/Gsuyoung",
  email: "suyoung606123@gmail.com",
  // 이력서 버튼. public/resume.pdf 파일이 있거나, 노션·구글 드라이브 공유 링크(https://...)를 넣으면 보입니다.
  // 파일이 없으면 버튼은 자동으로 숨겨집니다. 레포가 공개라 PDF에는 개인정보를 빼고 넣으세요.
  resume: "/resume.pdf",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Language", items: ["Java", "SQL"] },
  { group: "Framework", items: ["Spring Boot", "Spring Security", "JPA", "MyBatis"] },
  { group: "Data", items: ["MySQL", "MariaDB", "Redis"] },
  { group: "Infra · Tool", items: ["Docker", "Git", "JUnit"] },
];

// TODO: 경력·교육 이력을 노션에서 옮겨 주세요. 최신순.
export const experience: { period: string; title: string; items: string[] }[] = [
  {
    period: "20XX.XX – 현재",
    title: "TODO 회사명 · 백엔드 개발",
    items: ["TODO 담당 업무 1", "TODO 담당 업무 2"],
  },
];
