# Quality Checklist

session, note, post를 생성하거나 수정한 뒤 다음 항목을 확인한다. 특히 "게시 준비해줘" 요청을 처리할 때는 이 목록 전체를 적용한다.

## 구조와 위치

- [ ] 올바른 계층(`sessions/` / `notes/<category>/` / `posts/`)에 저장했는가?
- [ ] 파일명 규칙을 지켰는가? (`sessions/YYYY-MM-DD-topic-slug.md`, `notes/<category>/<topic-slug>.md`, `posts/YYYY-MM-DD-topic-slug.mdx`)

## 중복과 기존 자료 확인

- [ ] 작업 전에 관련 session, note, post를 먼저 검색했는가?
- [ ] 기존 자료와 불필요하게 중복되지 않는가? (같은 개념을 다루는 새 note를 만들지 않고 기존 note를 갱신했는가)

## 원본 보존과 연결

- [ ] session 원본이 삭제, 덮어쓰기, 블로그 문체 변형 없이 보존되었는가?
- [ ] note가 출처 session을 상대 경로로 링크하는가?
- [ ] post가 사용한 note와 session을 글 마지막에 상대 경로로 링크하는가?

## 사실 확인

- [ ] 코드 예제를 실제로 실행하거나 검증했는가?
- [ ] 불확실한 내용을 사실처럼 표현하지 않고 "확인 필요" 등으로 표시했는가?
- [ ] 사용한 외부 자료에 URL과 확인 날짜(`YYYY-MM-DD`)가 있는가?

## post 전용 확인

- [ ] post frontmatter가 유효한가? (`title`, `date`, `description`, `tags`, `draft` 모두 존재하고 형식이 올바른가)
- [ ] post가 특정 블로그 엔진의 컴포넌트나 import에 종속되지 않는가?
- [ ] `npm run validate:posts`가 통과하는가?

## 실행 범위

- [ ] 사용자가 요청하지 않은 commit, push, publish를 하지 않았는가?
- [ ] 사용자가 요청하지 않은 `draft: false` 전환을 하지 않았는가?
