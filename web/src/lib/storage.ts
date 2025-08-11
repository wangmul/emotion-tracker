export type StepOneData = {
  saidNoCount: number;
  askedHelpCount: number;
  choseForJoyCount: number;
  tookRest: boolean;
  selectedDate?: string; // YYYY-MM-DD
};

const STEP1_KEY = "emotionTracker.step1";

export function saveStepOne(data: StepOneData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STEP1_KEY, JSON.stringify(data));
}

export function loadStepOne(): StepOneData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STEP1_KEY);
  try {
    return raw ? (JSON.parse(raw) as StepOneData) : null;
  } catch {
    return null;
  }
}

export function clearStepOne() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STEP1_KEY);
}
