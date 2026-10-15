---
title: CA2SA
summary: 카페 메뉴 관리와 주문 기능을 제공하는 팀 프로젝트에서 메뉴 및 메뉴 옵션 관리 기능을 담당했습니다.
period: "2024.12 ~ 2025.01"
role: "백엔드 · 메뉴 CUD / 메뉴 옵션 CRUD 담당"
stack: [Java 17, Spring Boot 3.3.6, MyBatis, MariaDB, springdoc OpenAPI, Gradle]
highlight: "메뉴 등록·수정·삭제와 이미지 파일 관리, 메뉴 옵션 중복 검증"
repo: https://github.com/2024-GREEN-1st-PROJECT/CA2SA
order: 2
draft: false
---

## 프로젝트 소개

CA2SA는 카페 정보, 메뉴 및 옵션, 주문 등의 기능을 제공하는 팀 프로젝트입니다. 프로젝트 전체에는 회원·이메일 인증·카페·주문 관련 기능도 포함되지만, **직접 담당한 영역은 메뉴 등록·수정·삭제(CUD) 및 메뉴 옵션 관리**입니다.

## 시스템 구성

```text
클라이언트
   │
   ▼
MenuController / MenuOptionController
   │
   ▼
MenuService / MenuOptionService
   │
   ▼
MenuMapper / MenuOptionMapper (MyBatis)
   │
   ▼
MariaDB

메뉴 이미지: MenuService → MyFileUtils → 서버 파일 저장소
```

## 담당 업무

### 메뉴 관리 — CUD

- 카페별 메뉴 등록, 수정, 삭제를 처리하는 API 구현
- 메뉴 등록·수정 시 선택적인 이미지 첨부 처리
- 메뉴별 이미지 저장 경로 구성 및 기존 이미지 파일 관리
- MyBatis Mapper를 사용한 메뉴 데이터 등록·수정·삭제

### 메뉴 옵션 관리

- 메뉴에 연결되는 옵션(옵션명, 추가 금액 등) 데이터 관리
- 옵션 등록 및 수정 API, 같은 메뉴 내 옵션명 중복 검증

## 구현 포인트

### 1. 메뉴 생성과 이미지 업로드

`MenuService.postMenuInfo()`는 이미지 유무에 따라 처리 흐름이 달라집니다. 이미지가 있으면 파일 이름을 생성하고 메뉴 데이터를 등록한 뒤 카페 ID·메뉴 ID에 대응하는 디렉터리에 이미지를 저장합니다.

### 2. 메뉴 수정·삭제 시 이미지 처리

`MenuService.updateMenuInfo()`는 새 이미지가 전달되면 기존 이미지 디렉터리를 정리하고 새 파일을 저장합니다. `deleteMenuInfo()`는 이미지 디렉터리를 정리한 후 메뉴 삭제 Mapper를 실행합니다.

### 3. 메뉴 옵션 중복 등록 방지

`MenuOptionService.postMenuOptionInfo()`에서 메뉴 ID와 옵션명을 기준으로 기존 옵션 존재 여부를 조회하고, 중복이면 예외를 발생시킵니다. 옵션 수정 시에는 MyBatis 동적 SQL을 사용해 전달된 필드를 갱신합니다.

## 회고 · 다시 만든다면

지금의 코드를 다시 읽으며 정리한 개선 검토 사항입니다.

- 메뉴 등록 시 이미지가 없는 분기에서는 메뉴명 중복 검사를 거치지 않으므로 검증 로직을 공통화할 여지가 있습니다.
- 이미지 저장 실패를 로그로만 처리하면 DB 데이터와 실제 파일 상태가 달라질 수 있으므로 실패 정책과 정리 절차를 검토할 필요가 있습니다.
- 메뉴 이미지 파일 삭제와 DB 변경은 하나의 DB 트랜잭션만으로 원자성을 보장할 수 없으므로 작업 순서를 신중히 설계해야 합니다.

## 원본 소스

[CA2SA GitHub 저장소](https://github.com/2024-GREEN-1st-PROJECT/CA2SA)
