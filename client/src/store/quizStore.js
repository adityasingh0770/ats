import { create } from 'zustand';

export const useQuizStore = create((set, get) => ({
  sessionId: null,
  topic: null,
  shape: null,
  currentQuestion: null,
  conceptMaterial: null,
  phase: 'concept', // concept | quiz | remedial | complete
  feedback: null,
  hint: null,
  hints: [],       // accumulated array of hint strings for current question
  hintSources: [], // parallel: 'llm' | 'rules' per hint line
  hintLevel: 0,
  remedialContent: null,
  progress: { answered: 0, total: 8, correct: 0 },
  currentDifficulty: 'beginner',
  masteryBefore: 0,
  masteryAfter: 0,
  questionStartTime: null,
  showHintSuggestion: false,
  attemptCount: 0,

  setSession: (data) =>
    set({
      sessionId: data.sessionId,
      topic: data.topic,
      shape: data.shape,
      conceptMaterial: data.conceptMaterial,
      currentQuestion: data.question,
      currentDifficulty: data.difficulty,
      masteryBefore: data.masteryBefore,
      phase: 'concept',
      feedback: null,
      hint: null,
      hints: [],
      hintSources: [],
      hintLevel: 0,
      remedialContent: null,
      progress: { answered: 0, total: 8, correct: 0 },
      attemptCount: 0,
    }),

  startQuiz: () => set({ phase: 'quiz', questionStartTime: Date.now() }),

  setFeedback: (feedback) => set({ feedback }),

  setHint: (hint) => set((s) => ({
    hint,
    hintLevel: hint?.level || 0,
    hints: hint?.content ? [...s.hints, hint.content] : s.hints,
    hintSources: hint?.content ? [...(s.hintSources || []), hint.source || 'rules'] : (s.hintSources || []),
  })),

  setRemedial: (remedialContent) => set({ remedialContent, phase: 'remedial' }),

  setNextQuestion: (question, progress, difficulty, masteryUpdate) =>
    set({
      currentQuestion: question,
      feedback: null,
      hint: null,
      hints: [],
      hintSources: [],
      hintLevel: 0,
      remedialContent: null,
      phase: 'quiz',
      questionStartTime: Date.now(),
      showHintSuggestion: false,
      attemptCount: 0,
      progress: progress || get().progress,
      currentDifficulty: difficulty || get().currentDifficulty,
      masteryAfter: masteryUpdate?.after || get().masteryAfter,
    }),

  setComplete: (masteryAfter) => set({ phase: 'complete', masteryAfter }),

  resumeQuiz: () => set({ phase: 'quiz', remedialContent: null }),

  incrementAttempt: () => set((s) => ({ attemptCount: s.attemptCount + 1 })),

  setHintSuggestion: (v) => set({ showHintSuggestion: v }),

  reset: () =>
    set({
      sessionId: null, topic: null, shape: null, currentQuestion: null,
      conceptMaterial: null, phase: 'concept', feedback: null,
      hint: null, hints: [], hintSources: [], hintLevel: 0, remedialContent: null,
      progress: { answered: 0, total: 8, correct: 0 },
      currentDifficulty: 'beginner', masteryBefore: 0, masteryAfter: 0,
      questionStartTime: null, showHintSuggestion: false, attemptCount: 0,
    }),
}));
