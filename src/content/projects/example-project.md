---
title: 예시 프로젝트 · 작성 견본
summary: 이 파일은 작성 견본입니다. 복사해서 새 프로젝트 파일을 만드세요.
period: TODO 2025.01 – 2025.03
role: TODO 백엔드 · 리뷰/댓글, 인증
team: TODO 백엔드 3 · 프론트 2
stack: [Java, Spring Boot, JPA, MySQL]
# 목록 카드에 보이는 핵심 성과 한 줄. **굵게** 쓴 부분이 파란색으로 강조됩니다.
highlight: TODO 예) N+1 쿼리 개선으로 리뷰 목록 응답 **820ms → 140ms**
# repo: https://github.com/Gsuyoung/저장소이름
order: 1
# draft: true 이면 사이트에 보이지 않습니다. 실제 프로젝트 파일에서는 이 줄을 지우세요.
draft: true
# 트러블슈팅: 여러 개 넣을 수 있고, 문제 → 원인 → 해결 → 결과 표로 보입니다.
troubleshooting:
  - title: TODO 리뷰 목록 조회가 느린 문제
    problem: TODO 어떤 증상이 있었는지 (예. 리뷰 20개 조회 API가 평균 800ms 이상)
    cause: TODO 원인을 어떻게 찾았고 무엇이었는지 (예. 리뷰마다 작성자를 따로 조회하는 N+1 쿼리)
    solution: TODO 어떻게 해결했는지 (예. `fetch join` 과 `@BatchSize` 적용, 복합 인덱스 추가)
    result: TODO 결과를 가능하면 수치로 (예. 쿼리 41번 → 2번, 응답 **820ms → 140ms**)
lesson: TODO 이 프로젝트를 통해 배운 점을 2~3문장으로 적어 주세요.
---

> 이 파일을 복사해 `src/content/projects/영문-프로젝트명.md` 로 만들고 노션에 정리한 내용으로 바꿔 주세요. 파일 이름이 상세 페이지 주소가 됩니다.

## 시스템 구조

요청이 어떤 흐름으로 처리되는지 그림이나 텍스트 다이어그램으로 보여줍니다. 이미지를 쓰려면 `public/images/` 에 넣고 `![구조도](/images/프로젝트이름.png)` 로 연결하세요.

```text
Client (React)
   │  HTTPS · Bearer JWT
   ▼
Spring Boot API
   ├─ JwtAuthenticationFilter      // 토큰 검증
   ├─ ReviewController ─▶ ReviewService ─▶ ReviewRepository (JPA)
   └─ CommentController ─▶ CommentService
   │
   └─▶ MySQL   review · comment · member
```

## 담당 역할

- TODO 리뷰·댓글 REST API 설계 및 구현
- TODO JWT 기반 로그인, 토큰 재발급
- TODO 리뷰 목록 조회 성능 개선

## API 예시

```http
GET /api/cafes/{cafeId}/reviews?page=0&size=20
Authorization: Bearer eyJhbGciOi...

200 OK
{
  "content": [{ "reviewId": 31, "rating": 4.5, "writer": "suyoung" }],
  "page": 0,
  "totalElements": 128
}
```
