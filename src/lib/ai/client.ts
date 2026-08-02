/**
 * Single call-site for talking to Claude. Backend is chosen by AI_BACKEND:
 *  - "proxy" -> local claude-proxy daemon (Max subscription, $0 marginal cost).
 *    PERSONAL/DEV USE ONLY - the proxy is PC-only and single-user, so it must
 *    never serve real users. Refused outright when NODE_ENV is "production".
 *  - "api"   -> real Anthropic API (ANTHROPIC_API_KEY), the only backend
 *    allowed once other people are testing or using the app.
 * Defaults to "proxy" outside production and "api" in production so a missing
 * env var can't accidentally leave a deployed instance on the personal daemon.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export interface AskClaudeOptions {
  system?: string;
  model?: string;
  maxTokens?: number;
}

const PROXY_URL = process.env.CLAUDE_PROXY_URL ?? "http://127.0.0.1:8799/v1/messages";
const API_URL = "https://api.anthropic.com/v1/messages";

function backend(): "proxy" | "api" {
  const mode = process.env.AI_BACKEND;
  if (mode === "proxy" || mode === "api") return mode;
  return process.env.NODE_ENV === "production" ? "api" : "proxy";
}

export async function askClaude(
  messages: ChatMessage[],
  opts: AskClaudeOptions = {}
): Promise<string> {
  const mode = backend();

  if (mode === "proxy" && process.env.NODE_ENV === "production") {
    throw new Error(
      "AI_BACKEND=proxy is not allowed in production - the claude-proxy daemon is personal/PC-only, not for real users."
    );
  }

  const maxTokens = opts.maxTokens ?? 1024;

  if (mode === "proxy") {
    const model = opts.model ?? "haiku";
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, system: opts.system, messages, max_tokens: maxTokens }),
    });
    if (!res.ok) {
      throw new Error(`claude-proxy error ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY must be set when AI_BACKEND=api");
  }
  const model = opts.model ?? "claude-haiku-4-5-20251001";
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, system: opts.system, messages, max_tokens: maxTokens }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}
