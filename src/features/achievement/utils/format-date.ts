export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formatted.replace(/^(\d+)/, "Ngày $1");
}
