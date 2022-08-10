import moment from "moment";
import { DATE_REQUEST_FORMAT, EMPTY_TEXT } from "../constants";

export function secondsToHms(secs, delimitor = ":") {
  const sec_num = parseInt(secs, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(delimitor);
}

export function disabledFuture(current) {
  // Can not select days before today and today
  return current && current > moment().endOf("day");
}

export function datePickerMinMax(min, max, type = "days") {
  return (current = moment()) => {
    if (min !== undefined && max !== undefined) {
      return (
        current > moment().add(max, type) || current < moment().add(min, type)
      );
    }
    if (max !== undefined) {
      return current > moment().add(max, type);
    }
    if (min !== undefined) {
      return current < moment().add(min, type);
    }

    return current;
  };
}

export function formatFormDate(date, format = DATE_REQUEST_FORMAT) {
  return date ? date.format(format) : "";
}

export function capitalizedFirstLetter(text = "") {
  return `${text[0].toUpperCase()}${text.substring(1)}`;
}

export function parseDateFromChangeLogs(date, intl) {
  if (date === EMPTY_TEXT) {
    return date;
  }

  const parsedDate = moment(date).locale(intl.locale);

  const dateString = parsedDate.format(
    intl.formatMessage({ id: "notification.date.format" })
  );

  return dateString;
}
