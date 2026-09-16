# [Antigravity용] 바닐라 JS Todo App 5단계 개발 프롬프트

본 문서는 PRD의 요구사항을 바탕으로 Antigravity AI가 순차적이고 정확하게 구현할 수 있도록 작성된 5개 핵심 단계별 실행 프롬프트입니다.

---

## 📌 1단계: 시맨틱 마크업 및 모던 반응형 UI 구축 (HTML/CSS)

```text
[목표]: 외부 라이브러리나 CDN 없이 순수 HTML5와 CSS3만 사용하여 모던하고 직관적인 Todo App의 UI 레이아웃을 작성해줘.

[대상 파일]:
- index.html
- style.css

[세부 구현 지시사항]:
1. index.html:
   - 시맨틱 태그(<header>, <main>, <section>, <ul> 등)를 활용한 마크업.
   - 상단 헤더: 앱 타이틀("Daily Focus Todo") 및 오늘 날짜 표시 영역.
   - 진행률 영역: 게이지 바 컨테이너(#progress-bar), 진행률 퍼센트 및 완료 카운트 표시 텍스트(#progress-text).
   - 입력 폼 영역: 카테고리 선택 드롭다운(기본값: '개인', 옵션: '개인'/'업무'), 할 일 입력 input(placeholder: "새로운 할 일을 입력하세요..."), '추가' 버튼.
   - 필터 탭 영역: '전체', '개인', '업무' 3가지 탭 버튼.
   - 목록 영역: 할 일 목록이 렌더링될 <ul> 컨테이너(#todo-list), 할 일이 없을 때 노출할 빈 상태 안내(#empty-state).
   - app.js 스크립트 연결 (defer 또는 body 하단).

2. style.css:
   - 외부 폰트/아이콘 라이브러리 없이 시스템 폰트(-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif) 기반 타이포그래피.
   - 중앙 정렬 카드형 레이아웃 (max-width: 560px, 모바일 화면 패딩 처리).
   - 세련된 뉴트럴 톤의 모던 미니멀 디자인 (그림자, 부드러운 라운드 코너).
   - 카테고리 배지 스타일 ('개인': 소프트 블루/그린, '업무': 소프트 오렌지/퍼플).
   - 진행률 게이지 바 트랜지션 애니메이션 (transition: width 0.3s ease-in-out).
   - 완료된 항목 스타일 (텍스트 취소선 line-through, opacity: 0.6).
   - 수정 모드 인라인 인풋 필드 스타일.

3. 규칙 준수:
   - 작업 완료 후 GEMINI.md의 [진행 상황]을 업데이트해줘.
```

---

## 📌 2단계: 데이터 상태 관리 및 LocalStorage 영구 저장소 모듈 구현 (JS)

```text
[목표]: 애플리케이션의 핵심 데이터 스키마를 정의하고, 새로고침 후에도 유지되도록 LocalStorage 기반 상태 관리 모듈을 작성해줘.

[대상 파일]:
- app.js

[세부 구현 지시사항]:
1. 데이터 스키마 & 상태(State) 설계:
   - Todo 객체 구조:
     {
       id: string,          // Date.now().toString() 또는 crypto.randomUUID()
       text: string,        // 할 일 텍스트
       category: string,    // "personal" | "work"
       completed: boolean,  // true | false
       createdAt: number    // timestamp
     }
   - 전역 상태 객체 관리:
     const state = {
       todos: [],
       currentFilter: 'all' // 'all' | 'personal' | 'work'
     };

2. 스토리지 동기화 유틸리티:
   - 스토리지 키 상수: STORAGE_KEY = 'TODO_APP_DATA_V1'
   - saveTodos(todos): JSON.stringify 후 localStorage에 저장하는 함수.
   - loadTodos(): localStorage에서 파싱하여 가져오되, JSON 파싱 실패 또는 빈 스토리지 시 안전하게 빈 배열([])을 반환하는 try-catch 방어 로직 구현.

3. 상태 조작 헬퍼 함수:
   - addTodo(text, category): 새 아이템 생성 후 state.todos에 추가 및 저장.
   - toggleTodo(id): 특정 아이템의 completed 불리언 반전 및 저장.
   - updateTodo(id, newText): 특정 아이템의 text 변경 및 저장.
   - deleteTodo(id): 특정 아이템 삭제 및 저장.
   - getFilteredTodos(): state.currentFilter에 맞게 필터링된 배열 반환.

4. 규칙 준수:
   - 작업 완료 후 GEMINI.md의 [진행 상황]을 업데이트해줘.
```

---

## 📌 3단계: 할 일 등록, 완료 체크, 삭제 및 동적 렌더링 구현 (JS)

```text
[목표]: 사용자가 폼에 입력한 할 일을 목록에 추가하고, 완료 상태를 토글하거나 삭제할 수 있도록 이벤트 핸들링 및 DOM 렌더링을 완성해줘.

[대상 파일]:
- app.js

[세부 구현 지시사항]:
1. DOM 렌더링 로직 (render):
   - state.todos 및 getFilteredTodos() 결과를 바탕으로 #todo-list 내부를 갱신하는 render() 함수 작성.
   - 리스트가 비었을 경우 #empty-state 표시, 항목이 있을 경우 숨김 처리.
   - 각 Todo 항목의 DOM 구조:
     - 카테고리 배지 ('개인' / '업무')
     - 체크박스 (input type="checkbox", completed에 따라 checked)
     - 텍스트 span (더블클릭/수정용)
     - 액션 버튼 그룹 (수정 버튼, 삭제 버튼)

2. 이벤트 리스너 및 유효성 검사:
   - 폼 제출(submit) 또는 추가 버튼 클릭 / Enter 키 입력 이벤트 처리:
     - text.trim() 적용, 빈 문자열이면 alert 또는 에러 피드백 표시 후 중단.
     - 100자 초과 방지.
     - 추가 완료 후 input 초기화 및 재포커스.
   - 이벤트 위임(Event Delegation) 패턴:
     - #todo-list에 단일 click/change 리스너를 바인딩하여 각 항목의 체크박스(완료 토글) 및 삭제 버튼 클릭을 처리.
   - 각 동작 후 render() 호출 및 LocalStorage 자동 동기화.

3. 규칙 준수:
   - 작업 완료 후 GEMINI.md의 [진행 상황]을 업데이트해줘.
```

---

## 📌 4단계: 인라인 수정(Edit) 및 카테고리 필터링 탭 구현 (JS/CSS)

```text
[목표]: 기존 할 일의 내용을 인라인으로 즉시 수정할 수 있는 편집 모드와, '전체/개인/업무' 카테고리별 탭 필터링을 완성해줘.

[대상 파일]:
- app.js
- style.css (필요 시 수정 모드 스타일 보강)

[세부 구현 지시사항]:
1. 카테고리 필터 탭:
   - 탭 버튼 클릭 시 active 클래스 전환.
   - state.currentFilter 값을 'all', 'personal', 'work'로 변경 후 render() 재호출.
   - 탭 전환 시에도 체크 상태와 데이터 정합성이 그대로 유지되도록 구현.

2. 인라인 수정(Inline Edit) 모드:
   - Todo 항목의 수정 버튼 클릭 또는 텍스트 더블 클릭 시 해당 아이템을 편집 모드로 전환.
   - 기존 텍스트가 채워진 <input class="edit-input"> 노출 및 자동 포커스(selection).
   - Enter 키 입력 또는 포커스 아웃(blur) 시:
     - 변경된 텍스트 유효성 검사(trim 및 빈 값 체크).
     - updateTodo() 호출하여 상태 갱신, 스토리지 저장 및 렌더링.
   - Escape(ESC) 키 입력 시:
     - 저장하지 않고 수정 모드 취소(기존 텍스트 유지).

3. 규칙 준수:
   - 작업 완료 후 GEMINI.md의 [진행 상황]을 업데이트해줘.
```

---

## 📌 5단계: 실시간 진행률(Progress Bar) 연동 및 최종 QA / 안정화 (HTML/CSS/JS)

```text
[목표]: 전체 진행률 게이지와 텍스트를 실시간으로 연동하고, 새로고침 데이터 보존 및 예외 상황을 종합 검증해줘.

[대상 파일]:
- app.js
- style.css
- index.html

[세부 구현 지시사항]:
1. 실시간 진행률(Progress Bar) 계산 및 반영:
   - updateProgress() 함수 구현:
     - 전체 항목 수(total)와 완료된 항목 수(completed) 계산.
     - 진행률 퍼센티지: total === 0 ? 0 : Math.round((completed / total) * 100).
     - 프로그레스 게이지 바 너비 갱신 (style.width = `${percent}%`).
     - 텍스트 정보 표기: "달성률 XX% (완료 N개 / 전체 M개)".
     - 달성률 100% (total > 0)일 때 축하 배지 또는 강조 색상 클래스 부여.
   - 모든 상태 변경(추가/삭제/체크/초기 로드) 시 updateProgress() 자동 호출.

2. 종합 QA 및 예외 처리 검증:
   - 페이지 새로고침 시 모든 할 일과 완료 상태, 카테고리 배지가 손실 없이 복원되는지 확인.
   - localStorage 데이터가 없거나 손상되었을 때 크래시 없이 정상 작동하는지 확인.
   - 모바일 화면(360px) 및 데스크톱에서 레이아웃 깨짐이 없는지 반응형 확인.
   - 키보드 인터랙션(Tab 포커스, Enter 추가, Esc 취소) 동작 검증.

3. 규칙 준수:
   - 작업 완료 후 GEMINI.md의 [진행 상황]의 모든 체크박스를 점검하고 최종 완료 상태로 업데이트해줘.
```
