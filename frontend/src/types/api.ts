export type ApiErrorPayload = {
  message: string | string[];
  statusCode?: number;
  error?: string;
} | string;

export function getErrorMessage(payload: ApiErrorPayload): string {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload.message)) return payload.message.join(" ");
  return payload.message;
}

export function extractApiError(err: unknown): ApiErrorPayload {
  const e = err as { response?: { data?: ApiErrorPayload }; message?: string };
  return e.response?.data ?? e.message ?? "Unknown error";
}
