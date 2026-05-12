import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the NeonAuth package before importing auth
vi.mock("@neondatabase/auth/next/server", () => ({
  createNeonAuth: vi.fn((config) => ({
    _config: config,
    getSession: vi.fn(),
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
    handler: vi.fn(),
    middleware: vi.fn(),
  })),
}));

describe("lib/auth", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEON_AUTH_BASE_URL = "https://test.neon.tech/auth";
    process.env.NEON_AUTH_COOKIE_SECRET = "test-secret-at-least-32-chars-long!!";
  });

  it("creates auth instance with correct config", async () => {
    const { createNeonAuth } = await import("@neondatabase/auth/next/server");
    const { auth } = await import("./index");

    // Lazy init: createNeonAuth is called on first property access
    void auth.getSession;

    expect(createNeonAuth).toHaveBeenCalledWith({
      baseUrl: "https://test.neon.tech/auth",
      cookies: {
        secret: "test-secret-at-least-32-chars-long!!",
      },
    });
    expect(auth).toBeDefined();
  });

  it("auth instance exposes required methods", async () => {
    const { auth } = await import("./index");

    expect(typeof auth.getSession).toBe("function");
    expect(typeof auth.signIn.email).toBe("function");
    expect(typeof auth.signUp.email).toBe("function");
    expect(typeof auth.signOut).toBe("function");
    expect(typeof auth.handler).toBe("function");
  });
});
