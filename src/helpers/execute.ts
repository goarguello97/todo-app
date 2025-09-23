import normalizeError from "./normalizeError";

export async function execute<T>(
  fn: () => Promise<T>
): Promise<
  | { error: false; data: T }
  | { error: true; data: { message: string; code?: number } }
> {
  try {
    const data = await fn();
    return { error: false, data };
  } catch (error: unknown) {
    return { error: true, data: normalizeError(error) };
  }
}
