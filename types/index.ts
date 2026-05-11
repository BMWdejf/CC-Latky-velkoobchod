export type ActionResult<TFieldErrors = Record<string, string[]>> =
  | { success: true }
  | { success: false; error: TFieldErrors | string };
