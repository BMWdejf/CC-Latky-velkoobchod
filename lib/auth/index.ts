import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

let _instance: NeonAuth | undefined;

function getInstance(): NeonAuth {
  if (!_instance) {
    _instance = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      },
    });
  }
  return _instance;
}

export const auth = new Proxy({} as NeonAuth, {
  get(_, prop) {
    return Reflect.get(getInstance(), prop as string);
  },
});
