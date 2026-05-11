import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSignOut = vi.fn();
const mockSignInEmail = vi.fn();
const mockSignUpEmail = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: {
    signOut: mockSignOut,
    signIn: { email: mockSignInEmail },
    signUp: { email: mockSignUpEmail },
    getSession: vi.fn(),
  },
}));

const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

describe("lib/actions/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signInWithEmail", () => {
    it("returns error when email or password is missing", async () => {
      const { signInWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "");
      formData.set("password", "");

      const result = await signInWithEmail(null, formData);
      expect(result?.error).toBe("Email a heslo jsou povinné");
    });

    it("returns error from NeonAuth on failure", async () => {
      mockSignInEmail.mockResolvedValueOnce({
        error: { message: "Invalid credentials" },
        data: null,
      });

      const { signInWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "user@test.com");
      formData.set("password", "wrongpassword");

      const result = await signInWithEmail(null, formData);
      expect(result?.error).toBe("Invalid credentials");
    });

    it("redirects admin to /dashboard on success", async () => {
      mockSignInEmail.mockResolvedValueOnce({
        error: null,
        data: { user: { role: "admin" } },
      });

      const { signInWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "admin@test.com");
      formData.set("password", "password123");

      await expect(signInWithEmail(null, formData)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard"
      );
    });

    it("redirects customer to /account on success", async () => {
      mockSignInEmail.mockResolvedValueOnce({
        error: null,
        data: { user: { role: "customer" } },
      });

      const { signInWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "customer@test.com");
      formData.set("password", "password123");

      await expect(signInWithEmail(null, formData)).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });
  });

  describe("signUpWithEmail", () => {
    it("returns error when fields are missing", async () => {
      const { signUpWithEmail } = await import("./auth");
      const formData = new FormData();

      const result = await signUpWithEmail(null, formData);
      expect(result?.error).toBe("Všechna pole jsou povinná");
    });

    it("returns error from NeonAuth on failure", async () => {
      mockSignUpEmail.mockResolvedValueOnce({
        error: { message: "Email already exists" },
      });

      const { signUpWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "exists@test.com");
      formData.set("name", "Jan Novák");
      formData.set("password", "password123");

      const result = await signUpWithEmail(null, formData);
      expect(result?.error).toBe("Email already exists");
    });

    it("redirects to /account on successful registration", async () => {
      mockSignUpEmail.mockResolvedValueOnce({ error: null });

      const { signUpWithEmail } = await import("./auth");
      const formData = new FormData();
      formData.set("email", "new@test.com");
      formData.set("name", "Nový Uživatel");
      formData.set("password", "password123");

      await expect(signUpWithEmail(null, formData)).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });
  });

  describe("signOut", () => {
    it("calls auth.signOut and redirects to login", async () => {
      mockSignOut.mockResolvedValueOnce(undefined);

      const { signOut } = await import("./auth");

      await expect(signOut()).rejects.toThrow("NEXT_REDIRECT:/auth/login");
      expect(mockSignOut).toHaveBeenCalledOnce();
    });
  });
});
