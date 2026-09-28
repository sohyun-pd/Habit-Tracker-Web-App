# Habit Tracker — Design Rules

> Ramp 스타일 레퍼런스를 매일 쓰는 습관 추적 **웹 애플리케이션**에 맞게 정리한 디자인 규칙.
> 한 줄 요약: **흑백 에디토리얼 톤 + 형광 하이라이터 한 색.** 형광 노랑(`#e4f222`)은 "지금 켜져 있는 것"(주요 액션, 현재 페이지, 완료, 진행률)에만 쓴다.

구현 위치: 토큰은 `src/index.css`의 `@theme`, 재사용 스타일은 같은 파일의 `@layer components`(`.btn`, `.card`, `.field` 등)에 있다. 컴포넌트에서 색·간격 값을 직접 쓰지 말고 이 토큰과 클래스를 쓴다.

---

## 0. 제품 성격: 앱이지 소개 사이트가 아니다

이 화면은 사용자가 매일 열어서 체크하고 닫는 도구다. 모든 화면은 세 가지 질문에 즉시 답해야 한다.

1. **지금 무슨 상태인가?** — 오늘 몇 개 완료했는가 (링 진행률, 사이드바/상단바의 `1/3`)
2. **누구로 로그인했는가?** — 사용자 이름·이메일, 로그아웃 버튼
3. **다음에 뭘 해야 하는가?** — Today 화면의 "Next up" 카드와 `Mark complete` 버튼

### 콘텐츠 규칙
- **페이지마다 제목(`h1`)은 하나.** 제목은 현재 내비게이션 항목과 같다 (Today / Calendar / Statistics / Data).
- 카드 안의 소제목은 **역할을 알려주는 짧은 라벨**이다(예: New habit, Top habits). 페이지 제목을 반복하지 않는다.
- **히어로 섹션, 큰 홍보 문구, 슬로건, 환영 배너를 만들지 않는다.** 응원 문구는 상태 줄 안에 작은 보조 텍스트로만 둔다.
- 라벨은 동사·명사로 직관적으로 쓴다: `Add habit`, `Mark complete`, `Sign out`. 감탄사와 이모지로 꾸미지 않는다.
- 이모지 장식 금지. 예외로 습관 아이콘(데이터)은 회색조로만 보여준다.

## 1. 원칙

1. **색은 하나만 강조한다.** 유채색은 Highlighter Yellow 하나뿐이다. 성공=초록, 경고=주황, 삭제=빨강처럼 의미별 색을 늘리지 않는다.
2. **굵기 대신 크기로 위계를 만든다.** 폰트 굵기는 400 하나뿐이다.
3. **그림자 대신 헤어라인을 쓴다.** 카드의 높이감은 1px `#e5e7eb` 테두리와 배경색 차이(Bone → White → Obsidian)로 표현한다.
4. **왼쪽 정렬이다.** 본문·제목은 가운데 정렬하지 않는다.
5. **장식하지 않는다.** 그라디언트, 일러스트, 바운스·회전 애니메이션은 쓰지 않는다.

## 2. 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `highlighter-yellow` | `#e4f222` | 주요 버튼 채움, 현재 내비게이션 항목, 완료된 체크, 진행 링, 100% 표시, 오늘 막대, 전부 완료된 날 |
| `ink` | `#0c0a08` | 기본 텍스트, 버튼 글자, 아웃라인 테두리, 아바타 배경. **넓은 면의 배경으로 쓰지 않는다** |
| `obsidian` | `#1a1919` | 어두운 면 (호버 시 반전 버튼, 30일 태그) |
| `paper` | `#ffffff` | 카드, 사이드바, 상단바, 어두운 배경 위 글자 |
| `bone` | `#f4f2f0` | 앱 배경, 옅은 카드(wash), 호버 배경 |
| `ash` | `#6d6c6b` | 보조 텍스트, 캡션, 라벨 |
| `hairline` | `#e5e7eb` | 카드 테두리, 구분선 |
| `smoke` | `#d3d3d3` | 부분 완료 상태, 막대 그래프 기본색, 어두운 면 위 보조 텍스트 |

**접근성 예외:** 레퍼런스는 어두운 면의 라벨을 Ash로 쓰지만 Ash on Obsidian은 대비가 약 3.3:1이라 작은 글자에 부족하다. 어두운 면 위의 보조 텍스트는 `smoke`를 쓴다.

**습관별 색상:** 데이터에는 `habit.color`(Tailwind 클래스)가 그대로 저장되지만 화면에서는 쓰지 않는다. 습관을 색으로 구분하지 않는다.

## 3. 타이포그래피

- 서체: 레퍼런스의 lausanne 대체로 **Inter**(400) → 시스템 산세리프 순으로 폴백. 모든 텍스트에 `font-feature-settings: "ss01" on`.
- 굵기: **400만.** `font-bold`, `font-semibold`, `<b>`, `<strong>`으로 강조하지 않는다.
- 숫자가 바뀌는 곳(카운터, 통계, 스트릭, 날짜)은 `tabular-nums`.

| 역할 | 클래스 | 크기 / 행간 | 용도 |
|---|---|---|---|
| display | `text-display` | 64px / 1.0 | 앱 화면에서는 쓰지 않음 (마케팅 페이지 전용) |
| 페이지 제목 | `text-heading-lg` (lg 이상 `text-[48px]`) | 40 / 1.05, 48 / 1.0 | 페이지당 하나의 `h1` |
| heading-lg | `text-heading-lg` | 40px / 1.05 | 핵심 수치 (진행률 %, 통계 숫자) |
| heading | `text-heading` | 28px / 1.14 | 로그인 화면 제목 |
| heading-sm | `text-heading-sm` | 24px / 1.17 | 다음 습관 이름, 월 이름, 사이드바 수치 |
| subheading | `text-subheading` | 20px / 1.3 | 로고, 카드 소제목, 습관 이름 |
| body | `text-body` | 16px / 1.5 | 본문, 입력, 버튼 |
| small | `text-small` | 14px / 1.5 | 보조 본문 |
| note | `text-note` | 13px / 1.5 | 설명문, 폼 라벨 |
| caption | `text-caption` | 10px / 2.2 | 대문자 마이크로 라벨 (자간 0.018em) |

- 대문자 라벨은 `.eyebrow`(caption + uppercase + Ash).
- 행간은 위 표의 값을 넘기지 않는다(제목 ≤ 1.05).

## 4. 여백과 모양

- 기본 단위 **4px.** Tailwind 기본 스케일(`p-1` = 4px)을 그대로 쓴다. 자주 쓰는 간격은 8 / 12 / 16 / 24px.
- 카드 안쪽 여백 20px(모바일) / 24px(sm 이상). 카드 사이 간격 24px, 카드 안 요소 간격 8~16px.

| 요소 | 반경 | 클래스 |
|---|---|---|
| 버튼, 태그, 캘린더 칸, 아바타, 탭 아이콘 배경 | 6px | `rounded-md` |
| 입력 | 10px | `rounded-input` |
| Wash 카드, 계정 선택 행 | 12px | `rounded-xl` |
| Content 카드, 요약 카드 | 16px | `rounded-2xl` |

- **4px 반경, 완전한 원(pill), `rounded-full`은 쓰지 않는다.** 체크 버튼·아바타도 6px 사각형이다. (진행 링의 원은 데이터 시각화이므로 예외)
- 그림자는 내비게이션(상단바, 하단 탭 바)의 안쪽 하이라이트 `--shadow-subtle` 하나만 쓴다.

## 5. 앱 셸과 레이아웃

### 데스크톱 (lg ≥ 1024px)
```
┌──────────┬──────────────────────────────────────────┐
│ 사이드바 │ 날짜 (eyebrow)                            │
│ 256px    │ 페이지 제목 (h1)                          │
│ 고정     │ ┌──────────────────────┐ ┌────────────┐  │
│          │ │ Today 요약 (어두운 카드)│ │ New habit  │  │
│ · Today  │ └──────────────────────┘ │ (sticky)   │  │
│ · Calendar│ 습관 목록                │ └────────────┘  │
│ · Statistics│                        │                │
│ · Data   │                                           │
│ ──────── │                                           │
│ Today 1/3│                                           │
│ 사용자   │                                           │
│ Sign out │                                           │
└──────────┴──────────────────────────────────────────┘
```
- **사이드바** 256px, 화면 왼쪽 고정, 흰 배경 + 오른쪽 헤어라인. 위에서부터 로고 → 내비게이션 → (아래로 밀어서) 오늘 상태 → 사용자 → `Sign out`.
- **콘텐츠 영역** 사이드바 오른쪽, 최대 너비 1100px, 안쪽 여백 40px. 맨 위에 날짜(eyebrow)와 페이지 제목 하나.
- Today 화면은 xl(≥1280px)에서 2열이다: 왼쪽에 요약 카드 → 습관 목록, 오른쪽 340px에 `New habit` 폼(스크롤 시 고정). xl 미만에서는 요약 → 폼 → 목록 순으로 쌓인다.
- Calendar, Statistics, Data는 카드 그리드다. 통계는 수치 카드 4개 + 2열 카드(Top habits / Last 14 days).

### 모바일·태블릿 (< 1024px)
- 사이드바 대신 **상단바**(56px, 아바타·이름·`1/3 done today`·`Sign out`)와 **하단 탭 바**(아이콘 + 대문자 라벨, 현재 탭은 Yellow 아이콘 배경)를 쓴다. 하단 탭 바는 `safe-area-inset-bottom`을 존중한다.
- 콘텐츠는 좌우 여백 16px(sm 24px), 하단에 탭 바 높이만큼 여백(`pb-28`).

### 로그인 화면
- 앱 셸 없이 Bone 배경에 최대 420px 카드 하나. 로고 → 카드(제목 `h1`, 설명, 폼 또는 계정 목록) → 저장 위치 안내 문구.
- 계정이 있으면 "Sign in"(계정 선택 행 + `Create new account`), 없으면 "Create account" 폼.
- 이 앱의 계정은 **이 기기의 브라우저에만 저장**된다(서버·비밀번호 없음). 화면에 그 사실을 항상 적는다.

## 6. 컴포넌트

### 버튼 (`.btn` + 변형)
| 변형 | 스타일 | 용도 |
|---|---|---|
| `.btn-primary` | Yellow 채움, Ink 글자, 높이 44px. 호버 시 Obsidian 배경 + Yellow 글자 | 화면(카드)당 하나의 핵심 액션: `Mark complete`, `Add habit`, `Create account` |
| `.btn-outline` | 투명, 1px Ink 테두리. 호버 시 Bone | 보조 액션: Edit, Delete, Sign out, Import, Clear |
| `.btn-ghost` | 테두리 없음. 호버 시 Bone | 비활성 내비게이션 항목 |
| `.btn-sm` | 높이 36px, 좌우 12px | 카드 안쪽·상단바 버튼 |

- Today 요약 카드의 `Mark complete`는 흰 카드 위 Ghost 버튼이다(노란 채움 없음, 호버 시 Bone).
- **삭제·초기화 버튼도 빨강을 쓰지 않는다.** 아웃라인 버튼이고 안전장치는 `confirm` 대화상자가 맡는다.

### 내비게이션
- 사이드바 항목: 아이콘(20px, 1.5px 선) + 라벨, 높이 44px. 현재 항목은 Yellow 채움 + `aria-current="page"`, 나머지는 Ghost.
- 하단 탭: 아이콘 위, 대문자 캡션 라벨 아래. 현재 탭은 아이콘 뒤에 Yellow 6px 사각형.
- 사용자 블록: 36px Ink 사각 아바타(이름 첫 글자, Paper) + 이름 + 이메일(말줄임).

### Today 요약 카드 (`TodaySummary`)
- 흰(Paper) 배경, 16px 반경, 안쪽 여백 24~32px. 위에 **144px 진행 링**(가운데 정렬), 아래에 상태와 다음 행동을 세로로 쌓는다. 모든 화면 너비에서 같은 배치.
- 링: 트랙은 `hairline`, 진행 호는 Yellow(12px 선, 둥근 끝), 가운데 `NN%`(40px)와 `DONE`(caption). 글자는 모두 Ink. 0%일 때는 호를 그리지 않는다. 변화는 0.4s ease-out. `role="progressbar"`.
- 링 아래 위에서 아래: `NEXT UP` 라벨 → 다음 미완료 습관 이름(24px)과 설명 + Ghost `Mark complete` → 상태 줄(`N of M habits completed · 응원 문구`).
- 습관이 없으면 "No habits yet", 모두 완료하면 "All habits completed today".
- **평평한 가로 진행률 바는 쓰지 않는다.**

### 카드
- **Content 카드 `.card`**: 흰 배경, 1px Hairline 테두리, 16px 반경, 그림자 없음.
- **Wash 카드 `.wash`**: Bone 배경, 테두리 없음, 12px 반경. 사이드바 상태 블록.
- 알림(`role="status"`): 흰 배경 + 1px Ink 테두리, 12px 반경, 카드 위에 표시. 색을 쓰지 않는다.

### 입력 `.field`
- 투명 배경, 1px `rgba(33,33,33,0.1)` 테두리, 10px 반경, 높이 48px. 포커스 시 테두리 Ink.
- 라벨 `.label`: 13px Ash, 입력 위 8px. 오류 문구는 입력 아래 13px Ink(`role="alert"`).

### 습관 카드
- 왼쪽에 44px 사각 체크 버튼. 미완료는 Bone 배경 + 습관 아이콘(회색조), 완료는 Yellow 채움 + Ink 테두리 + ✓. 완료된 카드는 테두리가 Ink.
- 완료된 습관 이름은 취소선 + Ash. 스트릭은 "N day streak" 텍스트, 7일 이상·30일 이상은 `.tag`.
- 목록 위 한 줄: `HABITS · N`(eyebrow) 왼쪽, `Total streaks N · Longest N days` 오른쪽.

### 캘린더
- 월 이름(24px)과 `←` `Today` `→` 컨트롤이 한 줄. 요일 헤더는 caption 대문자.
- 날짜 칸은 6px 반경 사각형, 상태를 **배경**으로 표시: 전부 완료 = Yellow, 일부 완료 = Smoke, 없음 = 투명. 오늘은 1px Ink 테두리. 데스크톱에서 칸 높이 80px, 모바일은 정사각형.

### 차트·통계
- 수치 카드: 40px 숫자 + eyebrow 라벨. 막대는 기본 Smoke, 오늘만 Yellow + 1px Ink 테두리. 그라디언트 없음.

### 코칭 화면 (하이브리드 코칭 Phase 1, 프론트엔드)
PRD: `docs/PRD-hybrid-coaching.md`. 백엔드가 없어서 같은 브라우저 안에서 회원과 코치 계정이 데이터를 공유하는 데모다.

- **역할:** 계정은 Member 또는 Coach다. Coach는 Clients / Timings 두 탭, Member는 Today / Weekly / Calendar / Statistics / Data 다섯 탭이다. 모바일 하단 탭 바는 탭 개수에 맞춰 열이 바뀐다.
- **배지:** 새 항목 수는 Ink 6px 사각형 안 흰 숫자(`Badge`)로 표시한다. 색을 쓰지 않는다. (Weekly의 안 읽은 피드백, Clients의 피드백 대기)
- **Missed recently 카드:** 최근 3일 미완료 항목에 사유 버튼(아웃라인)과 `Skip`을 붙인다. 선택은 선택 사항이다.
- **Weekly:** 페이지 제목 아래 주 이동(`WeekNav`) → 요약 카드(완료율, 문장) → By day 막대(전부 완료한 날만 Yellow) + Missed check-ins 목록(막대 없이 숫자) → Last 4 weeks 타일 → Coach feedback 카드(평가 1~5, 계획 확정).
- **코치 상세:** 위기 신호가 있으면 요약보다 위에 `Needs attention` 알림(Ink 1px 테두리)을 둔다. 피드백 입력창은 초안이 채워진 채 열리고, 전송 버튼이 Primary다.
- **안내 문구:** "Coaching is not medical or mental-health counseling"은 코치 작성 화면, 회원 피드백 카드, 동의 화면에 항상 보인다.
- **상태 표시:** Waiting은 Yellow 태그, Draft·Sent는 기본 태그, Needs attention은 Ink 채움 태그.

## 7. 반응형

| 구간 | 동작 |
|---|---|
| < 1024px | 상단바 + 하단 탭 바, 콘텐츠 1열, 페이지 제목 40px, 요약 카드는 링 위·내용 아래 세로 배치 |
| ≥ 640px (`sm`) | 좌우 여백 24px, 카드 안쪽 여백 24px |
| ≥ 768px (`md`) | 데이터 카드 3열 |
| ≥ 1024px (`lg`) | 사이드바 고정, 상단바·하단 탭 바 숨김, 페이지 제목 48px, 통계 수치 4열·2열 카드, 캘린더 칸 80px |
| ≥ 1280px (`xl`) | Today 화면 2열(콘텐츠 + 340px 폼) |

- 터치 대상은 최소 36px, 주요 버튼·체크 버튼·내비게이션 항목은 44px 이상.
- 페이지 전체가 가로로 넘치면 안 된다.

## 8. 모션

- 지속 0.3~0.4s, `ease-out`. 색·배경·테두리·폭·`stroke-dashoffset` 변화에만 쓴다.
- `transform`(scale, translate), 바운스, 펄스, 진입 페이드 애니메이션은 쓰지 않는다.
- `prefers-reduced-motion: reduce`에서는 전환을 끈다.

## 9. 접근성

- 포커스 링은 항상 보인다: `:focus-visible { outline: 2px solid Ink; outline-offset: 2px }`.
- 아이콘만 있는 버튼에는 `aria-label`, 토글은 `aria-pressed`, 현재 페이지는 `aria-current="page"`, 진행 링은 `role="progressbar"`.
- 색만으로 상태를 전달하지 않는다. 캘린더 칸에는 `title`로 상태 문구를 붙인다.
- 본문 텍스트 대비 4.5:1 이상. Ash는 흰색·Bone 위에서만, 어두운 면에서는 Smoke.

## 10. 데이터와 날짜

- 날짜 키는 항상 **로컬 날짜** `YYYY-MM-DD`(`src/utils/date.js`의 `toDateKey`)다. `toISOString().split('T')[0]`은 UTC 기준이라 한국 시간에서 하루씩 밀리므로 쓰지 않는다.
- 사용자별 저장 키: `habits:<userId>`, `completions:<userId>`, `misses:<userId>`(미완료 사유), `consent:<userId>`(코치 공유 동의). 계정 목록은 `users`(role 포함), 현재 로그인은 `session`, 코치 피드백은 공용 `feedback`(id: `fb:<userId>:<주 시작일>`).
- 주간 요약의 **모든 수치는 `src/utils/weeklySummary.js`가 코드로 계산**한다. 문장과 코치 초안은 템플릿이며, 아직 AI 모델을 쓰지 않는다. 주는 월~일이고, 끝난 날만 집계한다.

## 11. Do

- 서체 굵기는 400만 쓴다.
- Yellow는 액션·현재 위치·완료·진행 상태에만 쓴다.
- 페이지마다 `h1` 하나, 그 아래 카드는 짧은 역할 라벨만 쓴다.
- 현재 상태(오늘 진행)와 사용자, 다음 행동을 모든 화면에서 볼 수 있게 둔다.
- 카드는 흰 배경 + 1px `#e5e7eb` 테두리로 만든다.
- 버튼·태그 6px, 입력 10px, wash 카드 12px, 카드 16px 반경을 지킨다.
- 새 컴포넌트는 `.btn`, `.card`, `.wash`, `.field`, `.label`, `.eyebrow`, `.tag`를 먼저 재사용한다.

## 12. Don't

- 히어로, 홍보성 문구, 반복되는 제목, 환영 배너를 넣지 않는다.
- 초록·빨강·파랑·보라·주황 등 두 번째 강조색을 추가하지 않는다.
- `font-bold` / `font-semibold`를 쓰지 않는다.
- 카드·모달·패널에 `box-shadow`를 쓰지 않는다.
- 그라디언트, 일러스트, 스톡 사진, 이모지 장식을 넣지 않는다.
- `#0c0a08`을 넓은 배경으로 쓰지 않는다. 어두운 면은 `#1a1919`.
- 제목이나 본문을 가운데 정렬하지 않는다.
- 4px 반경이나 pill 모양을 쓰지 않는다.
- hover에서 `scale`을 키우거나 요소를 움직이지 않는다.
- 상태를 나타내려고 새 색을 만들지 않는다. 필요하면 Yellow / Ink / Smoke / 채움 유무로 표현한다.
