import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatCustomDate = (dateString: string, utcOffset: number = 0): string => {
  const localDate = new Date(dateString);
  const utcDate = new Date(
    localDate.getTime() + utcOffset * 60 * 60 * 1000
  );

  const formatted = formatDistanceToNow(utcDate, {
    addSuffix: true,
    locale: ru,
  });
  return formatted.replace("назад", "назад");
};