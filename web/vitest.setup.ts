import "@testing-library/jest-dom";

// Mock chart libraries to avoid Canvas dependency errors in JSDOM
vi.mock("chart.js", () => ({
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Tooltip: {},
  Legend: {},
  Chart: { register: () => {} },
}));

vi.mock("react-chartjs-2", () => ({
  Line: () => null,
}));

// Misc DOM shims
// @ts-ignore
window.HTMLElement.prototype.scrollIntoView = function () {};

// Mock next/navigation to avoid App Router invariant in tests
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock auth hook to simulate an authenticated user during tests
vi.mock("@/lib/auth", () => ({
  useRequireAuth: () => ({ userId: "test-user", loading: false }),
}));
