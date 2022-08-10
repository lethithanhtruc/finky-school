import { EMPTY_TEXT } from "../constants";

export const getDataFromChangeLogs = (changeLogs, key, noDefaultText) => {
  const data = changeLogs.find((log) => log.key === key);

  const emptyText = noDefaultText ? "" : EMPTY_TEXT;

  if (!Boolean(data)) {
    return emptyText;
  }

  return data.newValue || emptyText;
};
