# RS-Tandem

## 🚀 About the Project

**RS-Tandem** is an interactive educational platform designed to gamify technical interview preparation. The project offers structured learning across topics like JavaScript, TypeScript, and algorithms through a flexible system of interactive exercises.

## 🔗 Deployment

🌐 **Live Application:**
https://jsgods-rs-tandem.github.io/rs-tandem/

🚀 **Backend API (Railway):**
https://rs-tandem-production.up.railway.app

---

## 👥 Team & Development Diaries

| Name              | Github                                                  | Development Diary                  |
| :---------------- | :------------------------------------------------------ | :--------------------------------- |
| Diana Dukhovskaya | [dukhd](https://github.com/dukhd)                       | [🔗 DEVELOPMENT_DIARY - TBC](link) |
| Boris Zashliapin  | [elrouss](https://github.com/elrouss)                   | [🔗 DEVELOPMENT_DIARY - TBC](link) |
| Daniil Mikhalenka | [mikhalenkadaniil](https://github.com/mikhalenkadaniil) | [🔗 DEVELOPMENT_DIARY - TBC](link) |
| Mikita Kern       | [nck1969](https://github.com/nck1969)                   | [🔗 DEVELOPMENT_DIARY - TBC](link) |
| Ales Drobysh      | [alesdrobysh](https://github.com/alesdrobysh)           | N/A - mentor                       |

### 📝 Meeting Notes

- [🔗 Meeting Notes - Meeting #3 (Feb 15, Sunday)](https://github.com/dukhd/rs-tandem/issues/2#issue-3937972932)
- [🔗 Meeting Notes - Meeting #4 (Feb 18, Wednesday)](https://github.com/dukhd/rs-tandem/issues/4#issue-3944841485)
- [🔗 Meeting Notes - TBC]

---

## ⚙️ Development Processes

### Project Management

**Board Link:** [Link](https://github.com/users/dukhd/projects/2) \
We used **GitHub Projects** with a **Kanban board** to manage tasks and track our progress throughout the development cycle.

[Kanban Board Screenshot - TBC]

### Code Review (Top Pull Requests)

1. [🔗 PR #XX: Feature Name - TBC] — Brief description.
2. [🔗 PR #XX: Feature Name - TBC] — Brief description.
3. [🔗 PR #XX: Feature Name - TBC] — Brief description.

---

## 📺 Demo Video

**[🔗 Demo Video link - TBC]**

---

## 🛠 Local Setup & Installation

Follow these steps to set up the project locally.

### Installation

#### Clone the repository:

```bash
git clone https://github.com/jsgods-rs-tandem/rs-tandem.git
cd rs-tandem
```

#### Install dependencies:

```bash
npm install
```

#### Running the Project:

```bash
npm start
```

The applications will be available at: \
**Frontend:** http://localhost:4200 \
**Backend:** http://localhost:3000

#### Useful Commands:

| Command                  | Description                                       |
| :----------------------- | :------------------------------------------------ |
| `npm run start:frontend` | Starts only the Frontend application              |
| `npm run start:backend`  | Starts only the Backend application               |
| `npm run build`          | Builds all workspaces (Frontend & Backend)        |
| `npm run typecheck`      | Runs TypeScript type checking across all packages |
| `npm run lint`           | Runs ESLint for all packages                      |
| `npm run format`         | Formats code using Prettier                       |
| `npm test`               | Runs tests (currently placeholders)               |

---

## 💻 Tech Stack

### Frontend

- **Framework:** Angular
- **Language:** TypeScript
- **Styling:** SCSS
- **Build Tool:** Angular CLI (Vite/Esbuild)

### Backend

- **Framework:** NestJS
- **Language:** TypeScript

### Architecture & Tooling

- **Architecture:** Monorepo (NPM Workspaces)
- **Deployment:** Railway (backend)
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint (Unicorn plugin), Prettier
- **Git Hooks:** Husky (pre-commit, pre-push, commit-msg)
- **Commit Convention:** Conventional Commits (@commitlint)
