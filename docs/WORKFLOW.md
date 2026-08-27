# Workflow

이 문서는 `sessions → notes → posts` 승격 과정 전체를 설명한다.

## 세 계층의 관계

- **session**: 실제 학습이 벌어진 원본 기록. 질문, 답변, 시행착오, 오답을 포함한 날것 그대로의 과정.
- **note**: 하나 이상의 session에서 검증된 지식만 뽑아 주제별로 정제한 결과.
- **post**: 하나 이상의 note를 바탕으로, 외부 독자가 이해할 수 있게 다시 쓴 완결된 글.

승격은 항상 `session → note → post` 방향으로만 진행한다. 역방향으로 post의 문체나 결론을 note나 session에 되돌려 쓰지 않는다.

## 언제 다음 단계로 승격하는가

- **session → note**: 같은 주제로 질문/답변이 어느 정도 쌓여 "확인된 결론"이라고 부를 수 있는 지점에 도달했을 때. 세션이 끝났다고 자동으로 note가 되지는 않는다 — 사용자가 정리를 요청했을 때 승격한다.
- **note → post**: note의 내용이 외부 독자에게 설명할 만큼 안정적이고, 사용자가 블로그 글 작성을 명시적으로 요청했을 때.

승격은 항상 사용자의 요청에 의해 트리거된다. session이 쌓였다고 자동으로 note나 post를 생성하지 않는다.

## 원본을 보존해야 하는 이유

- session은 학습 당시의 사고 과정, 잘못된 가정, 시행착오를 보여주는 유일한 기록이다. note로 정제되는 순간 이 맥락은 사라진다.
- 나중에 note의 결론이 틀렸다고 판단되면 session을 다시 읽어 어디서 잘못된 가정이 들어갔는지 추적해야 한다.
- 따라서 note나 post를 만들거나 갱신해도 원본 session은 절대 삭제, 덮어쓰기, 블로그 문체로 재작성하지 않는다.

## 기존 note와 새 session 통합하기

1. 새 session의 주제와 관련된 note가 `notes/`에 있는지 먼저 검색한다.
2. 기존 note가 있다면 새 session의 내용 중 기존 note의 결론을 보강하거나 수정하는 부분을 찾는다.
3. 새 파일을 만들지 말고 기존 note를 갱신한다. 새로 확인된 내용은 관련 항목(핵심 원리, 주의점 등)에 추가하고, 출처 session 목록에 새 session 경로를 추가한다.
4. 기존 note의 내용과 새 session의 내용이 충돌하면 임의로 하나를 선택하지 않고 "검증 필요"로 표시한 뒤 사용자에게 보고한다.

## 동일 주제에 여러 session이 있을 때

- 같은 주제를 여러 날에 걸쳐 학습했다면 session 파일은 각 날짜별로 그대로 유지한다. 하나로 합치지 않는다.
- note를 작성할 때는 관련된 모든 session을 순서대로 읽고, 최신 session의 결론을 우선하되 이전 session에서 나온 유효한 내용도 함께 반영한다.
- note의 출처 session 목록에는 관련된 모든 session 경로를 나열한다.

## 관련 자료 찾는 방법

작업을 시작하기 전에 항상 다음을 검색한다.

- `sessions/`에서 같은 주제 또는 관련 키워드를 포함한 파일명/내용
- `notes/<category>/`에서 같은 주제를 다루는 기존 note
- `posts/`에서 같은 주제를 다루는 기존 draft 또는 완성된 글

검색 없이 새 파일부터 만들지 않는다.

## 추천 작업 순서

1. 관련 session, note, post를 검색한다.
2. 학습을 진행하며 session에 기록한다 (`docs/SESSION_GUIDE.md` 참고).
3. 사용자가 요청하면 관련 session을 바탕으로 note를 정리하거나 갱신한다 (`docs/NOTE_GUIDE.md` 참고).
4. 사용자가 요청하면 note를 바탕으로 draft post를 작성한다 (`docs/POST_GUIDE.md` 참고).
5. 사용자가 게시 준비를 요청하면 `docs/QUALITY_CHECKLIST.md`로 검토하고 `npm run check`를 실행한다.
6. commit/push/publish는 사용자가 명시적으로 요청했을 때만 수행한다.

## 외부 블로그(dev-denver.github.io)로 발행하기

이 레포의 `posts/`는 특정 블로그 엔진에 종속되지 않는 범용 형식이다. 반면
`dev-denver.github.io`는 Astro 기반 실제 블로그로, 자체 발행 파이프라인
(`docs/authoring/posting.md`, `docs/authoring/capture-prompt.md`)을 가지고 있다.
사용자가 "이 내용 블로그에 올려줘"라고 요청하면 다음 흐름을 따른다.

1. `templates/blog-capture-prompt.md`의 캡처 프롬프트 규격대로 `<slug>.intake.md`를
   작성한다 (비밀정보 제거, 파일 경로는 이 레포 기준 상대경로 유지).
2. 작성한 intake.md를 `dev-denver.github.io` 레포로 옮긴다.
3. 그 레포의 `blog-post` 스킬이 intake.md를 `src/content/blog/<slug>.md`로 다듬는다.
   intake.md의 `category_suggestion`은 제안일 뿐이며, 최종 카테고리 검증은 그
   스킬이 `src/config/categories.json` 기준으로 한다 — 이 레포에 있는 카테고리
   목록이 최신이 아니어도 무방하다.
4. commit/PR/머지/배포는 사용자가 명시적으로 요청했을 때만 진행한다.

로컬에서 두 레포를 함께 열 수 있는 환경이면 `templates/blog-capture-prompt.md`
대신 `dev-denver.github.io/docs/authoring/capture-prompt.md` 원본을 직접 참고해도
된다. 이 사본은 그 레포에 파일로 접근할 수 없는 환경(원격, 새 노트북 등)을 위한
것이다.

## 각 단계의 완료 조건

- **session 완료**: 오늘의 결론과 미해결 질문이 최신 상태로 정리되어 있다. (진행 중이어도 무방하며, 완료가 note 작성의 필수 조건은 아니다.)
- **note 완료**: 정의, 핵심 원리, 예제, 주의점, 출처 session 링크가 모두 채워져 있고 불확실한 내용이 명시적으로 표시되어 있다.
- **post 완료(발행 준비 상태)**: frontmatter가 유효하고, `docs/QUALITY_CHECKLIST.md` 항목을 통과하며, `npm run validate:posts`가 통과한다. 이 상태에서도 `draft`는 사용자가 명시적으로 요청하기 전까지 `true`로 유지한다.
