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
