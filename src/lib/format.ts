export function formatYen(value?: number): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${new Intl.NumberFormat("ja-JP").format(value)}円`;
}

export function formatOku(value?: number): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value)}億円`;
}

export function formatPct(value?: number): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1
  }).format(value)}%`;
}

export function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }
  return `${year}年${month}月${day}日`;
}

export function yearOf(value: string): string {
  return value.slice(0, 4);
}

export function monthOf(value: string): string {
  return value.slice(5, 7);
}
