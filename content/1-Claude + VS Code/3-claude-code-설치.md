# 3. Claude Code 설치

> 본인 컴퓨터가 **Mac**인지 **Windows**인지 확인 후, 해당 섹션만 따라하세요.
>
> Pro 구독 + VS Code 설치가 아직이라면 [0. 사전 확인](./0-사전-확인.md)을 먼저 완료하세요.

---

## Step 1. Claude Extension 설치 (VS Code 화면용)

> VS Code 안에서 채팅 패널로 Claude를 쓰기 위한 확장 프로그램입니다.

1. VS Code 왼쪽 사이드바에서 **Extensions** 아이콘 클릭 (네모 4개 모양, 아래 그림 참고)
   > 💡 못 찾겠으면 단축키: Mac `Cmd + Shift + X` / Windows `Ctrl + Shift + X`
2. 검색창에 **Claude** 입력
3. **Anthropic** 제작 확인 후 **Install** 클릭

![](../../../public/images/CleanShot%202026-02-22%20at%2000.41.13@2x.png)

### Extension 패널 열기

1. 왼쪽 사이드바 첫번째 파일 아이콘 눌러서 파일목록 다시 열기
2. 설치가 끝나면 Claude 익스텐션 패널 열기:
   - 우측 상단 클로드 모양 주황색 아이콘 누르기
   - 또는 단축키: Mac `Cmd + Shift + Esc` / Windows `Ctrl + Shift + Esc`
   ![](../../../public/images/CleanShot%202026-02-22%20at%2000.43.52@2x.png)

---

## Step 2. Homebrew & Git 설치

> 스킬을 설치하고 공유하려면 **Git**이 필요합니다. 본인 OS에 맞는 섹션만 따라하세요.

### Mac

**1. Homebrew 설치**

VS Code 상단 메뉴에서 **Terminal → New Terminal**을 열고, 아래 명령어를 붙여넣기 → Enter:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> 💡 Mac 로그인 비밀번호를 물어보면 입력하세요. (입력할 때 화면에 글자가 안 보이는 게 정상이에요)

설치가 끝난 뒤 아래와 같은 메시지가 나오면, 그 명령어를 **그대로 복사해서 실행**하세요:

```bash
echo >> ~/.zprofile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

확인: `brew --version` 입력 → 버전이 나오면 성공!

**2. Git 설치**

```bash
brew install git
```

확인: `git --version` 입력 → 버전이 나오면 성공!

### Windows

1. [git-scm.com/download/win](https://git-scm.com/download/win) 접속
2. **"64-bit Git for Windows Setup"** 다운로드 → 실행
3. 모든 옵션을 **기본값 그대로** 두고 설치 진행
4. VS Code를 **완전히 종료한 후 다시 열기**
5. 터미널에서 확인: `git --version` 입력 → 버전이 나오면 성공!

> ⚠️ VS Code를 재시작하지 않으면 `git` 명령어가 인식되지 않습니다.

---

## Step 3. Claude Code CLI 설치

1. VS Code 상단 메뉴에서 **Terminal** → **New Terminal** 클릭
   > 💡 단축키: `` Ctrl + ` `` (백틱, 숫자 1 왼쪽 키)

2. 아래 명령어 복사 → 터미널에 붙여넣기 → Enter

   **Mac:**
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

   **Windows (PowerShell):**
   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

   > CMD(명령 프롬프트)에서는 작동하지 않습니다. 반드시 **PowerShell**을 사용하세요.
   >
   > 💡 **Windows 사용자**: 엔터를 눌러도 한동안 **아무 일도 일어나지 않는 게 정상이에요.** 설치 파일을 서버에서 받아오는 중이라, 와이파이가 느리면 시간이 좀 걸릴 수 있어요. 멈춘 게 아니니 기다려주세요!

3. VS Code **완전히 종료** 후 다시 열기
4. 터미널에서 확인: `claude --version` 입력 → 버전 나오면 성공!

<div style="margin: 1.25rem 0 1.25rem 1.5rem; padding: 0.75rem 1.25rem; background: #f9fafb; border-left: 3px solid #e5e7eb; border-radius: 0 0.5rem 0.5rem 0;">

**⚠️ Mac 사용자: PATH 설정 메시지가 나올 경우**

설치 후 아래와 같은 메시지가 나오면:

```
⚠ Setup notes:
  • Native installation exists but ~/.local/bin is not in your PATH.
```

터미널에 아래 명령어를 **그대로 복사해서 붙여넣기** → Enter:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

그 다음 `claude --version` 입력 → 버전 나오면 성공!

</div>

<div style="margin: 1.25rem 0 1.25rem 1.5rem; padding: 0.75rem 1.25rem; background: #f9fafb; border-left: 3px solid #e5e7eb; border-radius: 0 0.5rem 0.5rem 0;">

**⚠️ Windows 사용자: PATH 설정 (필수)**

Windows에서는 `claude` 명령어가 바로 안 되는 경우가 많습니다. 아래 설정을 해주세요.

1. `Win + R` 누르고 → `sysdm.cpl` 입력 → Enter → **고급** 탭 클릭
2. **"환경 변수"** 버튼 클릭
3. **사용자 변수**에서 **Path** 선택 → **편집** 클릭
4. **새로 만들기** → `%USERPROFILE%\.claude\bin` 입력 → **확인**
5. VS Code **완전히 종료** 후 다시 열기
6. 터미널에서 `claude --version` 다시 확인

</div>

---

## Step 4. Claude Code 로그인

> Extension(VS Code 패널)과 터미널(CLI) 양쪽 모두 로그인합니다.

### 4-1. Extension 로그인

1. Claude 패널에서 **Sign In** 버튼 클릭
2. 브라우저에서 Claude 계정 로그인 → **허용** 클릭
3. Claude 패널에 `안녕하세요` 입력 → 응답 오면 **완료!**
	![](../../../public/images/CleanShot%202026-02-22%20at%2000.46.31@2x.png)

### 4-2. 터미널(CLI) 로그인

1. VS Code 상단 메뉴에서 **Terminal** → **New Terminal** 클릭 (단축키: `` Ctrl + ` ``)
2. `claude` 입력 → Enter
3. 테마 선택 → **Light** 또는 **Dark** 선택 (아무거나 OK)	![](../../../public/images/CleanShot%202026-02-22%20at%2000.38.56@2x.png)
4. 로그인 방법 → **Claude account with subscription** 선택	![](../../../public/images/CleanShot%202026-02-22%20at%2000.39.48@2x.png)
5. 브라우저가 자동으로 열림 → Claude 계정으로 로그인 → **허용** 클릭
6. 터미널로 돌아와서 `안녕하세요` 입력 → 응답 오면 **CLI 설정 완료!**

---

## 다음 단계

설치가 모두 완료됐다면, 다음 페이지로 넘어가세요:

→ **4. 추가 설정** (GitHub 계정, Markdown 프리뷰)

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| `claude` 명령어가 안 됨 | VS Code 완전히 종료 후 재시작 |
| 브라우저 로그인 후 터미널 반응 없음 | 브라우저에서 "허용" 클릭 확인 |
| Extension이 안 보임 | VS Code 재시작 |
| 로그인이 안 됨 | 브라우저 팝업 차단 해제 |
| 응답이 안 옴 | Claude Pro 구독 상태 확인 |

**해결 안 되면**: 오픈채팅방에 남겨주세요!

---

## 참고 문서

- [Claude Code 공식 설치 가이드 (한국어)](https://code.claude.com/docs/ko/setup)
- [왕초보를 위한 Claude Code 설치 방법](https://mildit.tistory.com/25)
