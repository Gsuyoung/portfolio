---
title: "AcaMatch (StudyBridge) · 2차 개발 / 3차 고도화"
summary: "학원과 수강생을 연결하는 교육 서비스의 운영·학습 관리 백엔드 개발"
period: "2025.01 ~ 2025.03"
role: "백엔드 · 강좌 · 시험 · 성적 관리와 엑셀 일괄 처리(2차), 출석 · 공지사항 · 팝업 · 엑셀 고도화(3차)"
team: "백엔드 5명 · 프론트엔드 3명(2차) → 2명(3차)"
stack: ["Java 17", "Spring Boot 3.4", "Spring Security", "JPA", "MyBatis", "MariaDB", "Apache POI"]
highlight: "엑셀 성적 일괄 등록 · 수정을 제안해 구현, 강좌 · 시험 · 성적 관리와 출석부 API 개발"
repo: "https://github.com/Gsuyoung/studyBridge"
order: 4
draft: false
troubleshooting:
  - title: "처음 다뤄 본 엑셀 일괄 처리 — 보여 줄 컬럼과 반영할 컬럼"
    problem: "엑셀을 처음 다뤄 봐서 라이브러리도, 시트를 어떻게 구성해야 하는지도 몰랐습니다. 구현 중에는 수강생이 알아볼 수 있게 표시해야 하는 컬럼과 실제로 DB에 반영해야 하는 컬럼이 달라 애를 먹었습니다."
    cause: "다운로드 파일은 사람이 읽는 용도(수강생 이름 등)와 다시 올려 DB를 갱신하는 용도(점수 등)를 동시에 가져야 했습니다. 두 역할이 한 시트에 섞이면서 어떤 셀을 읽어 어디에 반영할지 정리하기 어려웠습니다."
    solution: "AI 도구와 지인들의 도움으로 Apache POI 사용법을 조금씩 익혔습니다. 화면에 보여 줄 컬럼과 반영 대상 컬럼을 나눠, 업로드할 때는 반영 대상만 읽어 갱신하도록 정리했습니다."
    result: "내려받은 양식에 점수를 채워 올리면 여러 수강생의 성적이 한 번에 반영되는 기능을 완성했고, 3차 발표의 핵심 기능으로 시연했습니다."
  - title: "Docker 배포 환경에서 수정 사항이 보이지 않던 문제"
    problem: "Docker 환경을 처음 접해 수정한 내용을 배포해야만 확인할 수 있었습니다. 게다가 다시 배포해도 기존에 Docker에 저장된 내용만 계속 나왔습니다."
    cause: "당시에는 Docker 이미지와 컨테이너가 어떻게 갱신되는지 이해하지 못해 원인을 찾지 못했습니다."
    solution: "발표 일정에 맞추기 위해 접속 주소를 로컬로 바꿔, 시연은 로컬 환경에서 진행했습니다."
    result: "시연은 마쳤지만 근본 원인은 해결하지 못했습니다. 이 경험 이후 배포 환경의 동작 방식을 이해하는 것을 중요하게 여기게 되었고, 지금은 실무에서 Docker 환경과 서버 배포를 경험하고 있습니다."
lesson: "처음 보는 기술도 자료와 주변의 도움으로 익혀 끝까지 완성할 수 있다는 것을 배웠고, 기능 구현만큼 배포 환경의 동작을 이해하는 일이 중요하다는 점을 깨달았습니다."
---

## 프로젝트 소개

**AcaMatch**는 학원과 수강생을 연결하고, 학원 운영에 필요한 정보를 관리하는 교육 서비스 팀 프로젝트입니다. GitHub 저장소 이름은 `studyBridge`입니다.

2차 과정에서 초기 서비스를 개발하고, 3차 과정에서 같은 프로젝트를 이어서 고도화했습니다. 초기 개발과 기능 개선을 하나의 프로젝트 이력으로 소개합니다.

## 시스템 구성

```text
웹 클라이언트
   │ REST API
   ▼
Spring Boot
   ├── Controller / Service
   ├── JPA Repository · MyBatis Mapper
   ├── 출석 · 성적 · 수강 · 리뷰 관리
   └── Apache POI (Excel Export / Import)
                │
                ▼
             MariaDB
```

## 개발 단계

### 2차 — 초기 개발

"학원이 너무 많아 어디를 등록해야 할지 모르겠다"는 고민에서 출발해, 학원과 강좌를 한눈에 비교하고 찾는 중개 서비스를 만들었습니다. 백엔드 5명이 검색 · 회원 · 학원 · 강좌와 성적 · 리뷰와 채팅으로 나눠 맡았고, 저는 **학원 관계자 화면의 강좌 · 시험 · 성적 관리**를 담당했습니다.

```text
강좌 목록  ──▶  테스트 목록  ──▶  수강생 성적 목록
등록·수정·삭제    테스트 등록        성적 등록 · 수정
                 처리 상태 · 채점    엑셀 다운로드 ─┐
                                   엑셀 일괄 등록 ◀┘ (내려받은 양식에 점수를 채워 업로드)
```

- **강좌 등록 · 수정 · 삭제**: 학원 정보 담당 팀원과 함께 작업했습니다.
- **테스트 등록**: 강좌별 테스트를 등록하고 처리 상태와 채점 여부를 관리합니다.
- **성적 등록 · 수정**: 수강생별 채점일과 점수를 등록하고 수정합니다.
- **엑셀 다운로드**: 수강생 목록과 성적을 엑셀 파일(`studentGrade.xlsx`)로 내려받습니다.
- **성적 일괄 수정**: 내려받은 파일에 점수를 채워 올리면 Apache POI로 읽어 여러 수강생의 성적을 한 번에 DB에 반영합니다. 내려받은 양식 그대로 올려야 반영되는 구조입니다.

관리자가 성적을 한 명씩 입력해야 하는 불편함을 보고 **엑셀 일괄 등록 · 수정을 직접 제안해 구현**했습니다.

코드: `grade/GradeController.java`, `excel/StudentGradeController.java`, `excel/StudentGradeService.java`

### 3차 — 기존 서비스 고도화

2차 피드백(공지사항 노출, 포토 후기, 1:1 채팅 등)을 반영해 서비스를 고도화하고, 학원 관리자 · 사이트 관리자 화면을 새로 만들었습니다. 3차에서는 프론트엔드 인원이 줄어 백엔드 5명이 맡는 기능이 크게 늘었고, 저는 아래 기능을 담당했습니다.

**출석 관리** (학원 관리자)

- 달력에서 날짜별 출석 상태(출석 · 지각 · 결석 · 조퇴)를 확인합니다.
- 학원 · 강좌를 고른 뒤 수강생을 여러 명 선택해 **출석 상태를 일괄 저장**합니다.
- 출석부 등록 · 조회 · 수정 · 삭제와 출석률 조회 API

코드: `attendance/AttendanceController.java`, `attendance/AttendanceService.java`

**엑셀 성적 일괄 처리 고도화**

- 학원 · 강좌 · 테스트를 선택해 해당 수강생 목록을 엑셀로 내려받고, 결과를 일괄 등록합니다.
- 미응시 수강생은 등록 대기로 표시하고, 업로드 후 채점일과 점수가 한 번에 반영됩니다.
- 3차 발표의 핵심 기능 시연 항목(성적 일괄 처리)으로 소개했습니다.

**공지사항 · 팝업** (사이트 관리자)

- 공지사항 등록 · 관리와 사이트 팝업 관리 API

**수강 정보 · 리뷰 등록 · 대시보드**

- 수강 정보 · 수강생 목록 관련 조회 및 수정
- 수강생 리뷰 등록 (텍스트 리뷰와 포토 후기)
- 사이트 관리자 대시보드 일부를 팀원과 함께 작업

코드: `joinClass/`, `review/ReviewController.java`, `review/ReviewService.java`

## 코드 및 기록

- [원본 GitHub 저장소](https://github.com/Gsuyoung/studyBridge)
- [출석 관리 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/attendance)
- [성적 관리 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/grade)
- [엑셀 관련 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/excel)
- [리뷰 관련 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/review)
