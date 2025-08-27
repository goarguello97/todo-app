import CustomError from "./CustomError";

function normalizeError(error: unknown): { message: string; code?: number } {
  if (error instanceof CustomError) {
    return { message: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Error desconocido" };
}

export default normalizeError;
