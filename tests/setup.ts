import { vi } from "vitest";

// Mock environment variables for tests
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test";
process.env.NEON_AUTH_COOKIE_SECRET =
  process.env.NEON_AUTH_COOKIE_SECRET ?? "test-secret-at-least-32-chars-long!!";
