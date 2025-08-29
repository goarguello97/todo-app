import normalizeError from "./normalizeError";

export async function execute<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { error: false, data };
  } catch (error: unknown) {
    return { error: true, data: normalizeError(error) };
  }
}
