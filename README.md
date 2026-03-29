# ApnaITS — Intelligent Tutoring System for Grade 8 Mensuration

> An adaptive, AI-driven tutoring system that thinks, teaches, and responds like a real tutor.

---

## What is ApnaITS?

**ApnaITS** is a full-stack Intelligent Tutoring System (ITS) built for Grade 8 students learning **Mensuration** — covering Perimeter, Area, Surface Area, and Volume. Unlike a basic quiz app, ApnaITS dynamically adapts to every student's learning pace, tracks their mastery in real time, delivers contextual hints, and triggers remedial content when a student is struggling — just like a human tutor would.

The entire system is grounded in a **domain knowledge module** (PDF) that serves as the single source of truth for concepts, questions, hints, remedial logic, and pedagogical rules.

---

## The Problem

- Grade 8 students struggle with Mensuration because it involves multiple formulas, shape-specific logic, and unit handling — all at once.
- Traditional study apps give the same questions to all students, regardless of their current understanding.
- Students get a "Wrong ❌" message with no explanation of *why* it's wrong or *how* to fix it.
- There is no system that truly adapts — detecting formula confusion, unit errors, or frustration — and responds intelligently.

---

## The Solution — ApnaITS

A student-first Intelligent Tutoring System that combines:

1. **Adaptive Quiz Engine** — Questions that change difficulty based on student performance.
2. **Learner Model** — A per-student profile tracking mastery, accuracy, confidence, and error patterns.
3. **Pedagogical Rule Engine** — 7+ rules controlling when to encourage, hint, or remediate.
4. **3-Level Hint System** — Progressive hints from concept → formula → step-by-step.
5. **Remedial Content Engine** — Triggered after repeated failure; re-teaches from scratch.
6. **Error Detection System** — Identifies specific mistake types (formula swap, unit error, etc.).
7. **Time-Based Adaptivity** — Detects student frustration via time and auto-adjusts.
8. **Mastery Scoring Formula** — A weighted formula (not just accuracy) to classify students.
9. **Session Tracking** — Full session summary on completion.
10. **Per-Student Dashboard** — Visual progress by topic, shape, mastery level, and accuracy.

---

## Target Audience

- Grade 8 students learning Mensuration
- School teachers who want to assign adaptive practice
- EdTech developers studying ITS architecture

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React.js (Vite)                        |
| Styling     | Tailwind CSS                           |
| Routing     | React Router v6                        |
| State       | Zustand or Context API                 |
| Backend     | Node.js + Express.js                   |
| Database    | MongoDB (Mongoose ODM)                 |
| Auth        | JWT-based Authentication               |
| Domain Data | Static JSON seeded from domain PDF     |
| Hosting     | Vercel (frontend) + Render (backend)   |

---

## Domain Knowledge — Mensuration (Grade 8)

All content is sourced from the attached domain module PDF. The system covers:

### Topics

| Topic         | Shapes Covered                          |
|---------------|-----------------------------------------|
| Perimeter     | Square, Rectangle, Circle (Circumference) |
| Area          | Square, Rectangle, Circle               |
| Surface Area  | Cube, Cuboid, Cylinder                  |
| Volume        | Cube, Cuboid, Cylinder                  |

### Key Formulas (Source of Truth)

| Shape       | Perimeter / Circumference      | Area                         | Surface Area (TSA)              | Volume                  |
|-------------|-------------------------------|------------------------------|---------------------------------|-------------------------|
| Square      | 4s                            | s²                           | 6s²                             | s³                      |
| Rectangle   | 2(l + b)                      | l × b                        | 2(lb + bh + hl)                 | l × b × h               |
| Circle      | 2πr                           | πr²                          | —                               | —                       |
| Cylinder    | —                             | —                            | 2πr(r + h)                      | πr²h                    |

---

## Core System Architecture

```
┌─────────────────────────────────────────────────┐
│                   STUDENT                       │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   Learner Model     │  ← per-student adaptive profile
          └──────────┬──────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
┌────▼────┐   ┌──────▼──────┐  ┌────▼──────┐
│  Quiz   │   │ Pedagogical │  │  Mastery  │
│ Engine  │   │ Rule Engine │  │ Tracker   │
└────┬────┘   └──────┬──────┘  └────┬──────┘
     │               │               │
┌────▼────┐   ┌──────▼──────┐  ┌────▼──────┐
│  Hint   │   │  Remedial   │  │  Session  │
│ System  │   │   Engine    │  │  Tracker  │
└─────────┘   └─────────────┘  └───────────┘
```

---

## Learner Model

Stored per student in MongoDB. Updated after every answer.

```json
{
  "student_id": "ObjectId",
  "concept_mastery": {
    "perimeter_square": 0.82,
    "area_circle": 0.45,
    "volume_cylinder": 0.30
  },
  "attempts": 24,
  "accuracy": 0.71,
  "hints_used": 5,
  "time_taken": { "perimeter_square": 45, "area_circle": 120 },
  "error_patterns": ["formula_swap", "radius_diameter_confusion"],
  "confidence_score": 0.65
}
```

---

## Mastery Calculation Formula

```
M = 0.40 * A + 0.20 * (1 - H) + 0.15 * (1 - PA) + 0.15 * C + 0.10 * T
```

| Variable | Meaning                                              |
|----------|------------------------------------------------------|
| A        | Accuracy (correct / total attempts)                  |
| H        | Hint Rate (hints used / total questions)             |
| PA       | Attempts Penalty (extra attempts beyond first)       |
| C        | Confidence Score (derived from time + consistency)  |
| T        | Time Efficiency (avg time vs expected time)          |

### Mastery Classification

| Score Range | Level        | Description                          |
|-------------|--------------|--------------------------------------|
| M < 0.40    | Beginner     | Needs foundational re-teaching       |
| 0.40 – 0.70 | Intermediate | Understands basics, needs practice   |
| M > 0.70    | Advanced     | Consistent, fast, and accurate       |

---

## Pedagogical Rule Engine

The engine fires rules in order based on student behaviour:

| Rule | Trigger Condition               | System Action                                  |
|------|---------------------------------|------------------------------------------------|
| R1   | Student opens a topic           | Show concept material first                    |
| R2   | After concept shown             | Present first question                         |
| R3   | Correct answer                  | Increase difficulty level                      |
| R4   | 1st wrong attempt               | Show encouragement message                     |
| R5   | 2nd wrong attempt               | Trigger Hint Level 1 (concept hint)            |
| R6   | 3rd wrong attempt               | Trigger Hint Level 2 (formula hint)            |
| R7   | ≥ 4th wrong attempt             | Show full remedial content + simple re-question|

### Advanced Detection Rules

| Detection              | Trigger                                   | Response                            |
|------------------------|-------------------------------------------|-------------------------------------|
| Formula confusion      | Student applies area formula for perimeter| Targeted formula clarification      |
| Unit error             | Correct numeric value, wrong unit         | Unit-specific feedback              |
| Radius/Diameter mix-up | Value is exactly 2x or 0.5x of answer    | Explain r vs d                      |
| SA vs Volume confusion | Wrong formula category applied            | Show side-by-side comparison        |
| Frustration detection  | Time on question > 2× expected            | Auto-trigger hint, lower difficulty |

---

## Hint System (3 Levels)

Every question in the system has three pre-authored hint levels:

| Hint Level | Content Type          | Trigger Condition               |
|------------|-----------------------|---------------------------------|
| Level 1    | Concept Hint          | 2nd wrong attempt               |
| Level 2    | Formula Hint          | 3rd wrong attempt               |
| Level 3    | Step-by-step walkthrough | Frustration detected (time-based) |

Students can also manually request hints — each use is logged in the learner model.

---

## Error Detection System

The backend compares student answers against expected values to classify error types:

| Error Type           | Detection Logic                                             |
|----------------------|-------------------------------------------------------------|
| Formula Swap         | Answer matches area when perimeter asked (or vice versa)   |
| Unit Error           | Numeric value correct but unit wrong (cm vs cm²)           |
| Radius/Diameter      | Student answer = 2× or 0.5× correct answer                 |
| Arithmetic Mistake   | Formula correct, calculation wrong                         |
| Partial Formula      | Only part of the formula applied (e.g., l×b missing ×2)   |
| SA vs Volume Mix     | SA formula used for volume or vice versa                   |

Each error type generates a specific, targeted feedback message — never a generic "Wrong" response.

---

## Time-Based Adaptivity

| Condition                     | System Response                        |
|-------------------------------|----------------------------------------|
| Time > 1.5× expected          | Suggest hint button                    |
| Time > 2× expected            | Auto-show Level 1 hint                 |
| Time > 3× expected            | Reduce difficulty for next question    |
| Consistent fast + correct     | Increase confidence score              |

Expected time is set per question difficulty (Beginner: 60s, Intermediate: 90s, Advanced: 120s).

---

## Remedial System

Triggered when a student fails the same concept ≥ 4 times:

1. Quiz is paused
2. Conceptual explanation shown (text + visual reasoning)
3. Formula breakdown displayed
4. Worked example provided
5. One simplified question given
6. On success → return to normal flow
7. On failure → flag for teacher review (future feature)

---

## Quiz Engine

### Question Structure (stored in MongoDB, seeded from domain PDF)

```json
{
  "id": "Q001",
  "topic": "area",
  "shape": "circle",
  "difficulty": "intermediate",
  "question": "Find the area of a circle with radius 7 cm. (Use π = 22/7)",
  "answer": 154,
  "unit": "cm²",
  "formula": "π × r²",
  "hints": {
    "level1": "Area of a circle uses the radius, not the diameter.",
    "level2": "Formula: A = π × r². Substitute r = 7 and π = 22/7.",
    "level3": "Step 1: A = (22/7) × 7². Step 2: 7² = 49. Step 3: (22/7) × 49 = 22 × 7 = 154 cm²."
  },
  "remedial": "The area of a circle tells us how much flat space it covers..."
}
```

### Quiz Flow

```
1. Select Topic → Select Shape
2. System loads concept material (R1)
3. Present question at current difficulty
4. Student submits answer
5. Error detection runs
6. Pedagogical rule fires
7. Learner model updates
8. Next question (adapted difficulty)
9. Session ends → Summary generated
```

### Adaptive Difficulty

- Start at student's current mastery level
- 2 consecutive correct → step up difficulty
- 2 consecutive wrong → step down difficulty
- Difficulty range: Beginner → Intermediate → Advanced

---

## Session Tracking

Each session generates one payload on completion:

```json
{
  "sessionId": "uuid",
  "userId": "ObjectId",
  "topic": "area",
  "shape": "circle",
  "startTime": "ISO timestamp",
  "endTime": "ISO timestamp",
  "metrics": {
    "correct_answers": 6,
    "wrong_answers": 3,
    "attempts": 9,
    "hints_used": 2,
    "time_spent_seconds": 480,
    "topic_completion": true,
    "mastery_score_before": 0.42,
    "mastery_score_after": 0.61,
    "error_patterns_detected": ["radius_diameter_confusion"]
  }
}
```

---

## Dashboard

Displayed after login for each student:

- **Topic Cards** — Perimeter, Area, Surface Area, Volume
- **Per-Shape Progress Bars** — Visual mastery per shape
- **Mastery Badge** — Beginner / Intermediate / Advanced
- **Accuracy %** — Correct answers / total attempts
- **Hints Used** — Count with trend
- **Time Spent** — Total study time
- **Error Pattern Summary** — Most common mistake types
- **Recent Sessions** — Last 5 sessions with scores

---

## API Structure

### Auth Routes

| Method | Route             | Description           |
|--------|-------------------|-----------------------|
| POST   | `/auth/register`  | Register new student  |
| POST   | `/auth/login`     | Login, returns JWT    |

### User Routes

| Method | Route              | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/user/dashboard`  | Get student dashboard data     |
| GET    | `/user/profile`    | Get learner model              |

### Quiz Routes

| Method | Route             | Description                              |
|--------|-------------------|------------------------------------------|
| POST   | `/quiz/start`     | Start session (topic + shape)            |
| POST   | `/quiz/answer`    | Submit answer, get evaluation + next Q   |
| GET    | `/quiz/hint`      | Get next hint level for current question |
| GET    | `/quiz/remedial`  | Get remedial content for current concept |

### Session Routes

| Method | Route                | Description                      |
|--------|----------------------|----------------------------------|
| POST   | `/session/complete`  | Save completed session payload   |
| GET    | `/session/history`   | Get all past sessions for user   |

---

## Database Schema

### User

```
_id           : ObjectId
name          : String (required)
email         : String (unique, required)
passwordHash  : String (bcrypt)
grade         : Number (default: 8)
createdAt     : Date
```

### LearnerModel

```
_id              : ObjectId
userId           : ObjectId (ref: User)
concept_mastery  : Map<String, Number>   // e.g. { "area_circle": 0.72 }
attempts         : Number
accuracy         : Number (0.0 – 1.0)
hints_used       : Number
time_taken       : Map<String, Number>   // seconds per concept
error_patterns   : [String]
confidence_score : Number (0.0 – 1.0)
updatedAt        : Date
```

### Question

```
_id        : ObjectId
topic      : String (enum: perimeter|area|surface_area|volume)
shape      : String (enum: square|rectangle|circle|cube|cuboid|cylinder)
difficulty : String (enum: beginner|intermediate|advanced)
question   : String
answer     : Number
unit       : String
formula    : String
hints      : { level1, level2, level3 }
remedial   : String
```

### Session

```
_id          : ObjectId
sessionId    : String (UUID)
userId       : ObjectId (ref: User)
topic        : String
shape        : String
startTime    : Date
endTime      : Date
metrics      : Object (see session payload above)
```

---

## Folder Structure

```
apnaits/
├── client/                          # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── assets/                  # Icons, images
│       ├── components/
│       │   ├── ui/                  # Button, Card, ProgressBar, Badge
│       │   ├── quiz/                # QuestionCard, HintPanel, FeedbackBox
│       │   ├── dashboard/           # TopicCard, MasteryBadge, SessionHistory
│       │   └── layout/              # Navbar, Sidebar, PageWrapper
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── TopicSelectPage.jsx
│       │   ├── QuizPage.jsx
│       │   └── ResultPage.jsx
│       ├── store/                   # Zustand stores
│       │   ├── authStore.js
│       │   ├── quizStore.js
│       │   └── learnerStore.js
│       ├── services/                # Axios API calls
│       │   ├── authService.js
│       │   ├── quizService.js
│       │   └── sessionService.js
│       ├── utils/
│       │   ├── masteryCalc.js       # M = 0.40*A + 0.20*(1-H) + ...
│       │   ├── errorDetector.js     # Classifies answer errors
│       │   └── timeTracker.js       # Question timer logic
│       └── main.jsx
│
├── server/                          # Node.js + Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── env.js                   # Env validation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── sessionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── LearnerModel.js
│   │   ├── Question.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── pedagogyEngine.js        # Rule engine R1–R7 + advanced rules
│   │   ├── masteryService.js        # Mastery formula implementation
│   │   ├── errorDetectionService.js # Error classification logic
│   │   ├── hintService.js           # Hint level selector
│   │   └── remedialService.js       # Remedial content trigger
│   ├── data/
│   │   └── questions.seed.json      # All questions seeded from PDF
│   └── index.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Pages & Routes

| Page              | Route                    | Description                                      |
|-------------------|--------------------------|--------------------------------------------------|
| Login             | `/login`                 | JWT login form                                   |
| Register          | `/register`              | Student signup                                   |
| Dashboard         | `/dashboard`             | Mastery overview per topic + shape               |
| Topic Selection   | `/topics`                | Choose topic + shape to practice                 |
| Quiz              | `/quiz/:topic/:shape`    | Adaptive quiz with hints and feedback            |
| Result            | `/result/:sessionId`     | Session summary with mastery delta               |

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/your-username/apnaits.git
cd apnaits

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Environment Variables

Create `server/.env` based on `.env.example`:

```env
PORT=5001
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Seed the Database

```bash
cd server
node data/seed.js
```

> Make sure MongoDB is running locally before seeding.

### 4. Run the App

```bash
# Terminal 1 — Backend (from apnaats/server/)
npm run dev

# Terminal 2 — Frontend (from apnaats/client/)
npm run dev
```

Frontend: `http://localhost:5173`
Backend API: `http://localhost:5001`

---

## .env.example

```env
PORT=5001
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
```

---

## Development Phases

### Phase 1 — Foundation
- [ ] Project setup (React + Vite, Node + Express, MongoDB)
- [ ] JWT Auth (Register, Login, Protected Routes)
- [ ] Basic routing and layout (Navbar, Page shell)
- [ ] Question seeding from domain PDF

### Phase 2 — Core ITS Engine
- [ ] Learner Model schema + update logic
- [ ] Mastery formula implementation (`M = 0.40*A + ...`)
- [ ] Pedagogical Rule Engine (R1–R7)
- [ ] Quiz Engine with adaptive difficulty
- [ ] 3-Level Hint System

### Phase 3 — Intelligence Layer
- [ ] Error Detection System (6 error types)
- [ ] Time-Based Adaptivity (frustration detection)
- [ ] Remedial Content Engine
- [ ] Session payload generation

### Phase 4 — Dashboard & UI Polish
- [ ] Per-student Dashboard (progress bars, mastery badges)
- [ ] Result Page with session summary
- [ ] Responsive mobile design
- [ ] Animations and UI refinements

### Phase 5 — Testing & Deployment
- [ ] Unit tests for mastery formula and rule engine
- [ ] API testing (Postman collection)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Seed production DB

---

## Why ApnaITS is NOT a Basic Quiz App

| Feature                       | Basic Quiz App | ApnaITS         |
|-------------------------------|----------------|-----------------|
| Adaptive difficulty           | No             | Yes             |
| Per-student learner model     | No             | Yes             |
| Mastery formula               | No             | Yes (weighted)  |
| Pedagogical rules             | No             | Yes (R1–R7)     |
| 3-level hint system           | No             | Yes             |
| Error type detection          | No             | Yes (6 types)   |
| Remedial content engine       | No             | Yes             |
| Time-based frustration detect | No             | Yes             |
| Targeted feedback             | No             | Yes             |
| Session analytics             | No             | Yes             |

---

## Future Ideas (Post-Launch)

- Teacher dashboard with class-wide analytics
- Export student progress report as PDF
- Voice-based question reading (accessibility)
- Gamification (badges, leaderboard)
- Parent portal
- Multi-subject expansion (Algebra, Geometry)

---

*This README is a living document and will be updated as the project evolves.*
