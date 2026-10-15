// 프로젝트 목록 규칙. Astro 없이 node --test 로 검사할 수 있도록 순수 함수만 둡니다.

/** draft 를 빼고 order(같으면 id) 순으로 정렬한 뒤, FILE 번호와 검토 도장 여부를 붙입니다. */
export function numberProjects(entries) {
  return entries
    .filter((p) => !p.data.draft)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
    .map((p, i) => ({ ...p, fileNo: String(i + 1).padStart(2, "0"), reviewed: p.data.troubleshooting.length > 0 }));
}

/** 첫 화면 서신 문단. letter 가 비어 있으면 about 을 씁니다. */
export function letterParagraphs(profile) {
  return profile.letter?.length ? profile.letter : profile.about;
}
