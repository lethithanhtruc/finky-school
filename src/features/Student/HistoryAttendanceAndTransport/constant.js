import moment from "moment";

export const FORMAT_DATE_API = "YYYY-MM-DD";
export const FORMAT_DATE_FE = "DD/MM";
export const FORMAT_TIME_API = "HH:mm:ss";
export const FORMAT_TIME_FE = "HH:mm";
export const CONDITION_SHOW_BACKGROUND = "ALL_EMPTY";
export const CONDITION_DAY_OFF = "NN";
export const OPTION_ALL = "ALL";
export const EMPTY_VALUE = "--:--";
export const SORT_DESC = "DESC";
export const SORT_ASC = "ASC";

export const INIT_DATA_FILTER = {
  page: 1,
  filter: {
    studentId: 1,
    from: moment().add(-1, "days").format(FORMAT_DATE_API),
    to: moment().format(FORMAT_DATE_API),
  },
  orderBy: [{ field: "DATE", order: SORT_DESC }],
};
