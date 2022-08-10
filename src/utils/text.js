import { FormattedMessage } from "react-intl";

export function capitalizedFirstLetter(text = "") {
  return `${text[0].toUpperCase()}${text.substring(1)}`;
}

export function getAllChangeKey(changeLogs = [], intl) {
  const allChanges = changeLogs.map((log, index) => {
    // Capitalized First field
    if (index === 0) {
      return capitalizedFirstLetter(
        intl.formatMessage({ id: `notification.desc.update.${log.key}` })
      );
    }

    // Add coma for fields that are not the last field
    if (index < changeLogs.length - 1) {
      return (
        ", " +
        intl.formatMessage({
          id: `notification.desc.update.${log.key}`,
        })
      );
    }

    // Add "and" for the last field
    return (
      intl.formatMessage({
        id: `notification.desc.and`,
      }) +
      intl.formatMessage({
        id: `notification.desc.update.${log.key}`,
      })
    );
  });

  return allChanges;
}

export const convertNameGrade = (id) => {
  let text = "";
  switch (id) {
    case "grade_1":
      text = <FormattedMessage id="grade.grade_1" />;
      break;
    case "grade_2":
      text = <FormattedMessage id="grade.grade_2" />;
      break;
    case "grade_3":
      text = <FormattedMessage id="grade.grade_3" />;
      break;
    case "grade_4":
      text = <FormattedMessage id="grade.grade_4" />;
      break;
    case "grade_5":
      text = <FormattedMessage id="grade.grade_5" />;
      break;
    case "grade_6":
      text = <FormattedMessage id="grade.grade_6" />;
      break;
    case "grade_7":
      text = <FormattedMessage id="grade.grade_7" />;
      break;
    case "grade_8":
      text = <FormattedMessage id="grade.grade_8" />;
      break;
    case "grade_9":
      text = <FormattedMessage id="grade.grade_9" />;
      break;
    case "grade_germ":
      text = <FormattedMessage id="grade.grade_germ" />;
      break;
    case "grade_bud":
      text = <FormattedMessage id="grade.grade_bud" />;
      break;
    case "grade_leaves":
      text = <FormattedMessage id="grade.grade_leaves" />;
      break;
    default:
      break;
  }
  return text;
};


export const convertTextToPx = (text, px = 14, family = 'Roboto', bold = '') => {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");

  ctx.font = `${bold} ${px}px ${family}`;

  return Math.ceil(ctx.measureText(text).width);
}