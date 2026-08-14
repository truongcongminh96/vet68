export const AUTH_BUILD_COOKIE = "vet68-auth-build";
export const AUTH_BUILD_VERSION = process.env.VET68_BUILD_VERSION ?? "dev";

export const AUTH_BUILD_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};
