/**
 * User-facing copy for error/message codes passed via the query string.
 * Only short codes travel in URLs (never raw database/auth messages), so
 * attacker-crafted `?error=` text can never render inside our styled alerts —
 * unknown codes collapse to a generic message.
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed: "Please confirm your email first — check your inbox for the link.",
  user_already_exists: "An account with this email already exists. Try logging in instead.",
  weak_password: "Please choose a stronger password (at least 8 characters).",
  auth_error: "We couldn't sign you in. Please try again.",
  verify_failed: "We couldn't verify your email link. Try logging in, or sign up again.",
  missing_fields: "Please fill in all required fields.",
  missing_name: "Please enter your display name.",
  invalid_input: "Please enter an email and choose a role.",
  duplicate_invite: "There's already a pending invite for that email address.",
  already_in_family:
    "This account is already in a family — the app currently supports one family per account.",
  invite_not_found: "This invite is invalid, expired, or has already been used.",
  invite_email_mismatch:
    "This invite was sent to a different email address. Log in with the invited email, or ask for a new invite.",
  server_error: "Something went wrong on our end. Please try again.",
};

const GENERIC_ERROR = ERROR_MESSAGES.server_error;

/** Friendly copy for an error code from the query string; generic for unknown codes. */
export function errorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return ERROR_MESSAGES[code] ?? GENERIC_ERROR;
}

const INFO_MESSAGES: Record<string, string> = {
  check_email: "Check your email to confirm your account, then log in.",
};

/** Friendly copy for an info/success code; unknown codes render nothing. */
export function infoMessage(code: string | undefined): string | null {
  if (!code) return null;
  return INFO_MESSAGES[code] ?? null;
}

/** Codes the security-definer RPCs raise as exception messages. */
const KNOWN_RPC_CODES = new Set(["already_in_family", "invite_not_found", "invite_email_mismatch"]);

/**
 * Map a Supabase/Postgres error to a short code for the query string.
 * Known RPC exception messages pass through; unique violations become
 * duplicate_invite; everything else is logged server-side and collapsed.
 */
export function toErrorCode(error: { message: string; code?: string }): string {
  if (KNOWN_RPC_CODES.has(error.message)) return error.message;
  if (error.code === "23505") return "duplicate_invite";
  console.error("Unexpected database error:", error);
  return "server_error";
}

const KNOWN_AUTH_CODES = new Set([
  "invalid_credentials",
  "email_not_confirmed",
  "user_already_exists",
  "weak_password",
]);

/** Map a Supabase Auth error to a short code for the query string. */
export function toAuthErrorCode(error: { message: string; code?: string }): string {
  if (error.code && KNOWN_AUTH_CODES.has(error.code)) return error.code;
  console.error("Unexpected auth error:", error);
  return "auth_error";
}
