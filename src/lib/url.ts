export function withBase(path: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  if (!path || path === "/") return base + "/";
  return base + (path.startsWith("/") ? path : "/" + path);
}
