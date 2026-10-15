---
title: "AcaMatch (StudyBridge) · 2차 개발 / 3차 고도화"
summary: "학원과 수강생을 연결하는 교육 서비스의 운영·학습 관리 백엔드 개발"
period: "2025.01 ~ 2025.03"
role: "백엔드 개발 · 출석·성적·수강 관리, 엑셀 처리 및 리뷰 기능"
stack: ["Java 17", "Spring Boot 3.4", "Spring Security", "JPA", "MyBatis", "MariaDB", "Apache POI"]
highlight: "출석부 CRUD, 성적 관리 및 엑셀 입출력, 수강생 조회·리뷰 관련 API 구현 및 개선"
repo: "https://github.com/Gsuyoung/studyBridge"
order: 1
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

- AcaMatch 교육 서비스의 초기 백엔드 기능 개발
- 학원·수강생 관리 서비스를 위한 API와 데이터 접근 계층 구성

### 3차 — 기존 서비스 고도화

- 2차에서 구축한 서비스를 이어받아 기능을 확장하고 개선
- 출석부 CRUD, 성적·엑셀 처리, 수강 정보 및 리뷰 관련 기능 작업

## 담당 기능

### 1. 출석부 관리

- 출석부 등록·조회·수정·삭제 API
- 출석 상태(출석·지각·결석·조퇴) 관리 및 출석률 조회
- 강사·학원 관점의 출석 정보와 수강생 목록 조회

코드: `attendance/AttendanceController.java`, `attendance/AttendanceService.java`

### 2. 성적 관리 및 Excel 입출력

- 시험 성적 등록·조회·수정, 상세 및 처리 상태 조회 API
- 보호자·수강생 목록 연계 조회
- Apache POI 기반 성적 파일 내보내기와 업로드 후 DB 업데이트 흐름

코드: `grade/GradeController.java`, `excel/StudentGradeController.java`, `excel/StudentGradeService.java`

### 3. 수강 정보 및 리뷰 기능

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
