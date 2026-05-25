import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock matchMedia for Mantine and Theme logic
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Amplify Authenticator
vi.mock("@aws-amplify/ui-react", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useAuthenticator: vi.fn(() => ({
      authStatus: "unauthenticated",
      signOut: vi.fn(),
    })),
  };
});
