import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { isEqual, remove , intersection} from "lodash";

import { convertTextToPx } from '../../../utils/text';
import { useFactilityContext } from '../../../components/Common/FacilitiesSelect/context';

const Grades = ({ campusId, value = [], onChange, ...rest }) => {
  const intl = useIntl();
  const [oldCampus, setOldCampus] = useState(campusId);
  const getText = useCallback((suffix, opts = null) => {
    if (opts) {
      return intl.formatMessage({
        id: `event.forms.${suffix}`,
      }, {
        ...opts
      });
    }
    return intl.formatMessage({
      id: `event.forms.${suffix}`,
    });
  }, [intl]);

  const { facilities } = useFactilityContext();
  const gradeOfCampus = facilities.find(item => item.id === campusId);

  useEffect(() => {
    setOldCampus(campusId);
  }, [campusId])

  useEffect(() => {
    if (campusId && oldCampus && campusId !== oldCampus) {
      onChange([]);
    }
  }, [campusId, oldCampus, onChange]);

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

  const handleOnClickClass = (id) => {
    return () => {
      if (typeof onChange === 'function') {
        if (value.includes(id)) {
          onChange(value.filter(v => v !== id));
        } else {
          onChange([...value, id]);
        }
      }
    }
  };

  const getGradeSelected = (grade) => {
    const classInGrade = grade.classroom.map(cr => cr.id);
    if (classInGrade?.length === 0) {
      return false;
    }
    return isEqual(intersection(classInGrade, value).sort(), classInGrade.sort());
  };

  const handleOnClickGrade = (grade) => {
    return () => {
      if (typeof onChange === 'function') {
        const classInGrade = grade.classroom.map(cr => cr.id);
        if (classInGrade?.length !== 0) {
          let updateValue = [...value];
          if (getGradeSelected(grade)) {
            remove(updateValue, function(el) {
              return classInGrade.includes(el);
            });
            onChange(updateValue);
          } else {
            onChange(Array.from(new Set([...value, ...classInGrade])));
          }
        }
      }
    }
  };

  const renderGradesAndClassRooms = () => {
    if (gradeOfCampus?.grades) {
      return gradeOfCampus?.grades?.map(grade => {
        return (
          <div key={`${campusId}_${grade.id}`} className="grades-input__grades-row">
            <div className="grades-input__grade">
              <div
                className={`grades-input__grade-item ${getGradeSelected(grade) ? 'selected' : ''}`}
                style={{ minWidth: `${minimumOfGrade + 14}px` }}
                onClick={handleOnClickGrade(grade)}
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
                    onClick={handleOnClickClass(room.id)}
                    key={`${grade.id}_${room.id}`}
                    className={`grades-input__classrooms-item ${value.includes(room.id) ? 'selected' : ''}`}
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

  return (
    <div className="grades-input">
      <div className="grades-input__legends">
        <div className="grades-input__legends-item">
          <div className="grades-input__legends-block selected"></div>
          <div className="grades-input__legends-help">
            {getText('grades.selected')}
          </div>
        </div>
        <div className="grades-input__legends-item">
          <div className="grades-input__legends-block unselected"></div>
          <div className="grades-input__legends-help">
            {getText('grades.unSelected')}
          </div>
        </div>
      </div>

      <div className="grades-input__grades">
        {renderGradesAndClassRooms()}
      </div>
    </div>
  );
}

export default Grades;
