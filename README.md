# dev-knowledge-base

Claude Code와 함께 개발 학습 내용을 기록하고, Git으로 장기 보관하며, 정제된 지식을 블로그 글로 발전시키기 위한 AI 기반 개인 개발 지식 저장소다.

별도 웹 UI, 데이터베이스, GitHub Pages, 블로그 엔진은 이 저장소에 포함하지 않는다. Markdown/MDX 파일과 최소한의 TypeScript 유틸리티 스크립트로만 구성한다.

## 디렉터리 구조

```text
.
├── CLAUDE.md               # Claude Code가 항상 따르는 저장소 지침
├── README.md
├── docs/
│   ├── WORKFLOW.md          # session → note → post 승격 절차
│   ├── SESSION_GUIDE.md     # session 작성 규칙
│   ├── NOTE_GUIDE.md        # note 작성 규칙
│   ├── POST_GUIDE.md        # post 작성 규칙
│   └── QUALITY_CHECKLIST.md # 검토용 체크리스트
├── templates/
│   ├── session-template.md
│   ├── note-template.md
│   └── post-template.mdx
├── sessions/                # 학습 원본 기록 (YYYY-MM-DD-topic-slug.md)
├── notes/                   # 주제별 정제 지식 (<category>/<topic-slug>.md)
├── posts/                   # 블로그 draft (YYYY-MM-DD-topic-slug.mdx)
├── scripts/
│   ├── new-session.ts       # session 파일 생성
│   └── validate-posts.ts    # post frontmatter/링크 검증
├── package.json
└── tsconfig.json
```

## session, note, post의 차이

| 구분 | 위치 | 내용 | 대상 독자 |
| --- | --- | --- | --- |
| session | `sessions/` | 학습 과정 원본 — 질문, 답변, 코드, 오류, 시행착오 | 미래의 나 |
| note | `notes/<category>/` | session에서 검증한 지식을 개념 단위로 정제 | 미래의 나 |
| post | `posts/` | note를 바탕으로 쓴 완결된 블로그 글 (MDX, draft) | 외부 독자 |

정보는 `session → note → post` 방향으로만 승격한다. 상위 단계를 만들었다고 하위 단계를 삭제하거나 그 문체로 바꾸지 않는다 — 세 계층은 각자 독립적으로 보존된다. 자세한 절차는 `docs/WORKFLOW.md`를 참고한다.

## 설치

Node.js 20 이상이 필요하다.

```bash
npm install
```

## 제공되는 npm 명령

```bash
npm run build            # TypeScript 컴파일
npm run new:session -- <category> "<topic>"   # 새 session 파일 생성
npm run new:session -- <category> "<topic>" --date YYYY-MM-DD
npm run validate:posts   # posts/*.mdx frontmatter와 링크 검증
npm run check            # build + validate:posts
```

## Claude Code 실행 방법

저장소 루트에서 다음을 실행한다.

```bash
claude
```

## 전체 사용 흐름

```text
저장소에서 Claude Code 실행
→ 공부 시작
→ session 기록
→ note 정리
→ draft post 생성
→ 검토 및 검증
→ git commit/push
```

commit, push, 실제 publish는 이 흐름의 어느 단계에서도 Claude Code가 임의로 수행하지 않는다. 사용자가 명시적으로 요청할 때만 진행한다.

## 단계별 Claude Code 입력 예시

**1. 공부 시작**

```text
Java sealed class 공부를 시작하자.
새 session을 만들고 중요한 질문과 답변을 기록해줘.
```

**2. session 기록 → note 정리**

```text
오늘 session을 바탕으로 Java sealed class note를 정리해줘.
관련된 기존 note가 있으면 먼저 확인해줘.
```

**3. note → draft post**

```text
관련 note를 바탕으로 draft 블로그 글을 만들어줘.
```

**4. 검토 및 검증 (commit/push 없이)**

```text
변경된 session, note, post의 연결과 사실 관계를 확인하고
npm run check를 실행해줘. commit과 push는 하지 마.
```

## 블로그 배포에 대해

이 저장소는 블로그를 직접 배포하지 않는다. 웹 UI, 정적 사이트 생성기, GitHub Pages 설정을 포함하지 않는다. `posts/*.mdx` 파일은 이후 별도의 블로그 저장소로 옮기거나, 별도의 발행 파이프라인에서 자동으로 가져가 발행하는 용도로 사용할 수 있다.
