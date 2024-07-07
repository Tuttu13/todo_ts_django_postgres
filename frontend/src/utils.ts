// src/utils.ts

export const statusMap: { [key: number]: string } = {
  0: "未実施",
  1: "実施中",
  2: "完了",
};

export const priorityMap: { [key: number]: string } = {
  0: "低",
  1: "中",
  2: "高",
};

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("ja-JP", options);
};

export const formatDateToLocal = (date: string): string => {
  const dt = new Date(date);
  // 日本時間に変換
  dt.setHours(dt.getHours() + 9);
  return dt.toISOString().slice(0, 16);
};
