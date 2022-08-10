import React from "react";
import { NOTIFICATION_TYPE } from "../../../constants";
import CautionNumOfStudentModal from "./CautionNumOfStudentModal";

const NotificationModal = ({ data, visible, setVisible }) => {
  const handleCloseModal = () => {
    setVisible(false);
  };

  switch (data.type) {
    case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
      return (
        <CautionNumOfStudentModal
          data={data}
          visible={visible}
          onClose={handleCloseModal}
        />
      );
    default:
      return null;
  }
};

export default NotificationModal;
