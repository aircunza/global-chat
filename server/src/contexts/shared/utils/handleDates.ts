import dayjs from "dayjs";

export function timeStamp2dateTime(timestamp: number): Date {
  const dateObject: Date = dayjs.unix(timestamp).toDate();
  return dateObject;
}

export function timeStamp2StringDateTime(timestamp: number): string {
  const formatted = dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
  return formatted;
}
