---
title: "AcaMatch (StudyBridge) · 2차 개발 / 3차 고도화"
summary: "학원과 수강생을 연결하는 교육 서비스의 운영·학습 관리 백엔드 개발"
period: "2025.01 ~ 2025.03"
role: "백엔드 · 강좌 · 시험 · 성적 관리와 엑셀 일괄 처리(2차), 출석 · 리뷰 기능(3차)"
team: "2차 기준 백엔드 5명 · 프론트엔드 3명"
stack: ["Java 17", "Spring Boot 3.4", "Spring Security", "JPA", "MyBatis", "MariaDB", "Apache POI"]
highlight: "엑셀 성적 일괄 등록 · 수정을 제안해 구현, 강좌 · 시험 · 성적 관리와 출석부 API 개발"
repo: "https://github.com/Gsuyoung/studyBridge"
order: 2
draft: false
troubleshooting: []
lesson: "팀 프로젝트에서 학습·수강 데이터를 다루는 API와 엑셀 파일 입출력을 개발하고, 기능 간 데이터 흐름 및 연동 방식을 경험했습니다."
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

2차에서 만든 서비스를 이어받아 기능을 확장하고 개선했습니다.

**출석부 관리**

- 출석부 등록 · 조회 · 수정 · 삭제 API
- 출석 상태(출석 · 지각 · 결석 · 조퇴) 관리 및 출석률 조회
- 강사 · 학원 관점의 출석 정보와 수강생 목록 조회

코드: `attendance/AttendanceController.java`, `attendance/AttendanceService.java`

**성적 조회 보완**

- 시험 상세와 처리 상태 조회, 보호자 · 수강생 목록 연계 조회

**수강 정보 및 리뷰 기능**

- 수강 정보·수강생 목록 관련 조회 및 수정
- 리뷰 등록·조회·수정·삭제와 선택적 이미지 첨부 처리
- 리뷰 등록 및 예외 메시지 수정

코드: `joinClass/`, `review/ReviewController.java`, `review/ReviewService.java`

## 코드 및 기록

- [원본 GitHub 저장소](https://github.com/Gsuyoung/studyBridge)
- [출석 관리 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/attendance)
- [성적 관리 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/grade)
- [엑셀 관련 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/excel)
- [리뷰 관련 코드](https://github.com/Gsuyoung/studyBridge/tree/master/src/main/java/com/green/acamatch/review)
