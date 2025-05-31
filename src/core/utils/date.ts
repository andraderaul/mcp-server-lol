const MINUTE_IN_SECONDS = 60;

export function formatDuration(duration: number): string {
  if (!duration) return "Unknown";

  const minutes = Math.floor(duration / MINUTE_IN_SECONDS);
  const seconds = duration % MINUTE_IN_SECONDS;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDate(dateString: string, locale = "pt-BR"): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return dateString;
  }
}
