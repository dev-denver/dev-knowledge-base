# CLAUDE.md

이 저장소는 개인 개발 학습 내용을 기록하고, Git으로 장기 보관하며, 정제된 지식을 블로그 글로 발전시키기 위한 AI 기반 개인 개발 지식 저장소다. 별도 웹 UI, 데이터베이스, GitHub Pages, 블로그 엔진은 만들지 않는다. Markdown/MDX 파일 중심으로 구성한다.

## 지식 승격 원칙

정보는 `sessions/ → notes/ → posts/` 방향으로만 승격한다.

- `sessions/` — 실제 학습 과정의 원본 (질문, 답변, 코드, 오류, 시행착오). 절대 삭제하거나 대체하지 않는다.
- `notes/<category>/` — session에서 검증한 지식을 주제별로 정제.
- `posts/YYYY-MM-DD-topic-slug.mdx` — note를 바탕으로 쓴 외부 공개용 완결 글.

각 단계는 독립적으로 보존한다. 상위 단계를 만들었다고 하위 단계를 삭제하거나 그 문체로 덮어쓰지 않는다.

## 항상 지켜야 할 규칙

- 파일을 만들기 전에 `sessions/`, `notes/`, `posts/`에서 관련 기존 자료를 먼저 검색한다. 검색 없이 새 파일부터 만들지 않는다.
- 원본 session은 항상 보존한다. note나 post 작성이 session 삭제나 재작성의 이유가 되지 않는다.
- 확인되지 않았거나 추측한 내용을 사실처럼 쓰지 않는다. 불확실한 내용은 "확인 필요"로 표시한다.
- 외부 자료를 인용하면 URL과 확인 날짜(`YYYY-MM-DD`)를 함께 기록한다.
- note와 post에는 근거가 된 session/note를 저장소 상대 경로로 연결한다.
- 파일을 생성하거나 수정한 뒤에는 `npm run check`를 실행해 검증한다.
- 사용자가 명시적으로 요청하지 않으면 `git commit`, `git push`, 실제 publish를 수행하지 않는다.
- 기존 사용자 파일을 임의로 삭제하거나 덮어쓰지 않는다. 같은 이름의 파일이 있으면 내용을 검토해 통합하거나 충돌을 보고한다.

## 자주 쓰는 명령

```bash
npm run new:session -- <category> "<topic>"
npm run validate:posts
npm run check
```

## 참고 문서

역할별 상세 규칙은 아래 문서를 참고한다.

@docs/WORKFLOW.md
@docs/SESSION_GUIDE.md
@docs/NOTE_GUIDE.md
@docs/POST_GUIDE.md
@docs/QUALITY_CHECKLIST.md
