import React, { useCallback, useMemo, useState } from 'react';
import { Select } from 'antd';
import { useIntl } from "react-intl";
import { isEqual , intersection} from "lodash";
import moment from 'moment';
import { Modal } from 'antd';
import { MODAL_DETAIL_CSS_PREFIX } from '../constants';
import { STATUS_OPTIONS, LANGUAGE_OPTIONS, LANGUAGE_VI_EN } from '../constants';
import { useFactilityContext } from '../../../components/Common/FacilitiesSelect/context';
import { convertTextToPx } from '../../../utils/text';
import { getLanguageOptions } from '../helpers';

import './style.scss';

const receiveMappingTranslate = {
  PARENTS: 'parents',
  TEACHER: 'teacher',
  DRIVER: 'driver',
  NANNY: 'nanny'
}

const languageMappingTranslate = {
  VI: 'vietnamese',
  EN: 'english'
}

const ModalDetailView = ({ rowData, visible, ...rest }) => {
  const intl = useIntl();
  const [languageSelected, setLanguageSelected] = useState((intl.locale || LANGUAGE_OPTIONS.VIETNAMESE).toUpperCase());
  const { facilities } = useFactilityContext();

  const gradeOfCampus = facilities.find(item => item.id === rowData?.campusId);

  const getText = useCallback((suffix) => {
    return intl.formatMessage({
      id: `event.detail.${suffix}`,
    });
  }, [intl]);

  const getFieldText = useCallback((suffix, colon = true, opts = null) => {
    if (opts) {
      return `${intl.formatMessage({
        id: `event.forms.${ suffix }`,
      }, {
        ...opts
      })}${colon ? ':' : ''}`;
    }
    return `${intl.formatMessage({
      id: `event.forms.${suffix}`,
    })}${colon ? ':' : ''}`;
  }, [intl]);

  const getTitle = () => {
    if (rowData?.status === STATUS_OPTIONS.STOP_SEND) {
      return (
        <div className="modal-title">
          <div>{getText('title')}</div>
          <div className="modal-title__stop-send">
            {getText('title.stopSend')}
          </div>
        </div>
      );
    }
    return (
      <div className="modal-title">
        <div>{getText('title')}</div>
      </div>
    );
  }

  const getCampusName = () => {
    const gradeOfCampus = facilities.find(item => item.id === rowData?.campusId);
    return gradeOfCampus?.name;
  }

  const renderSendAt = () => {
    const sendAtDate = moment(rowData?.sendAt);
    return `${sendAtDate.format('DD/MM/YYYY')} | ${sendAtDate.format('HH:mm')}`;
  }

  const minimumOfGrade = useMemo(() => {
    return gradeOfCampus?.grades?.reduce((accom, grade) => {
      const newMin = convertTextToPx(
        intl.formatMessage({
          id: `grade.${grade.name.toLowerCase()}`,
        })
      );
      if (newMin < accom) {
        return accom;
      }
      return newMin;
    }, 0);
  }, [gradeOfCampus, intl]);

  const getGradeSelected = (grade) => {
    const classrooms = rowData?.classrooms?.map(item => item.id);
    const classInGrade = grade.classroom.map(cr => cr.id);
    if (classInGrade?.length === 0) {
      return false;
    }
    return isEqual(intersection(classInGrade, classrooms).sort(), classInGrade.sort());
  };

  const renderGradesAndClassRooms = () => {
    if (gradeOfCampus?.grades) {
      const classrooms = rowData?.classrooms?.map(item => item.id);
      return gradeOfCampus?.grades?.map(grade => {
        return (
          <div key={`${rowData?.campusId}_${grade.id}`} className="grades-input__grades-row">
            <div className="grades-input__grade">
              <div
                className={`grades-input__grade-item ${getGradeSelected(grade) ? 'selected' : ''}`}
                style={{ minWidth: `${minimumOfGrade + 14}px` }}
              >
                {
                  intl.formatMessage({
                    id: `grade.${grade.name.toLowerCase()}`,
                  })
                }
              </div>
            </div>
            <div className="grades-input__classrooms">
              {grade?.classroom.map(room => {
                return (
                  <div
                    key={`${grade.id}_${room.id}`}
                    className={`grades-input__classrooms-item ${classrooms.includes(room.id) ? 'selected' : ''}`}
                  >
                    {room.name} | {room.totalStudents}
                  </div>
                )
              })}
            </div>
          </div>
        );
      });
    }
    return null;
  }

  const renderClassrooms = () => {
    if (rowData?.classrooms) {
      return (
        <div className="grades-input">
          <div className="grades-input__legends">
            <div className="grades-input__legends-item">
              <div className="grades-input__legends-block selected"></div>
              <div className="grades-input__legends-help">
                {getFieldText('grades.selected', false)}
              </div>
            </div>
            <div className="grades-input__legends-item">
              <div className="grades-input__legends-block unselected"></div>
              <div className="grades-input__legends-help">
                {getFieldText('grades.unSelected', false)}
              </div>
            </div>
          </div>

          <div className="grades-input__grades">
            {renderGradesAndClassRooms()}
          </div>
        </div>
      )
    }

    return null;
  }

  const renderTitleText = () => {
    if (languageSelected === LANGUAGE_OPTIONS.VIETNAMESE) {
      return rowData?.titleVi || rowData?.titleEn;
    }
    return rowData?.titleEn || rowData?.titleVi;
  }

  const renderContentText = () => {
    if (languageSelected === LANGUAGE_OPTIONS.VIETNAMESE) {
      return rowData?.contentVi || rowData?.contentEn;
    }
    return rowData?.contentEn || rowData?.contentVi;
  }

  function handleChange(value) {
    setLanguageSelected(value);
  }

  const renderLanguageType = () => {
    if (rowData?.languageType === LANGUAGE_VI_EN) {
      const languageOptions = getLanguageOptions(intl);
      return (
        <Select onChange={handleChange} value={languageSelected}>
          {languageOptions.map(item => {
            return (
              <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
            );
          })}
        </Select>
      )
    }
    if (rowData?.languageType) {
      return (
        <div className="row-item__cell box value language">
          {getFieldText(`languages.${languageMappingTranslate[rowData?.languageType]}`, false)}
        </div>
      );
    }
    return (
      <div className="row-item__cell box value language">
        {rowData?.languageType}
      </div>
    );
  }

  return (
    <Modal
      className={MODAL_DETAIL_CSS_PREFIX}
      {...rest}
      key={`${visible}`}
      title={getTitle()}
      visible={visible}
      footer={null}
      width={1000}
      centered
    >
      <div className="modal-detail">
        <div className="data-detail">
          {/* Row 1 */}
          <div className="data-detail__row">
            <div className="row-item item-1">
              <div className="row-item__cell label">
                {getFieldText('languages')}
              </div>
              {renderLanguageType()}
            </div>
            <div className="row-item item-2">
              <div className="row-item__cell label">
                {getFieldText('eventCode')}
              </div>
              <div className="row-item__cell box value code">
                {rowData?.code}
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('subject')}
              </div>
              <div className="row-item__cell box value">
                {renderTitleText()}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('content')}
              </div>
              <div className="row-item__cell value content">
                <div className="have-scroll-bar">
                  {renderContentText()}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('receiver')}
              </div>
              <div className="row-item__cell value">
                {getFieldText(`receiver.${receiveMappingTranslate[rowData?.receiveType]}`, false)}
              </div>
            </div>
          </div>

          {/* Row 5 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('campus')}
              </div>
              <div className="row-item__cell value">
                {getCampusName()}
              </div>
            </div>
          </div>

          {/* Row 6 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {/* {getFieldText('campus')} */}
              </div>
              <div className="row-item__cell value classrooms">
                {renderClassrooms()}
              </div>
            </div>
          </div>

          {/* Row 7 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('sendAt')}
              </div>
              <div className="row-item__cell value">
                {renderSendAt()}
              </div>
            </div>
          </div>

          {/* Row 8 */}
          <div className="data-detail__row">
            <div className="row-item full-width">
              <div className="row-item__cell label">
                {getFieldText('note')}
              </div>
              <div className="row-item__cell value note">
                <div className="have-scroll-bar">
                  {rowData?.note}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  )
}

export default ModalDetailView;