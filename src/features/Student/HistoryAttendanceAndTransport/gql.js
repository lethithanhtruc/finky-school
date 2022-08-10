import { gql } from "@apollo/client";

export const LOAD_SCHOOLYEARS_CURRENT = gql`
  query schoolyearCurrent {
    schoolyearCurrent {
      id
      name
      startAt
      endAt
    }
  }
`;

export const LOAD_TOTAL_STATISTIC_STUDENT = gql`
  query attendanceOfTotalByStudent(
    $filter: AttendanceOfTotalByStudentFilterInput!
  ) {
    attendanceOfTotalByStudent(filter: $filter) {
      student {
        name
      }
      totalShift
      totalAbsent
      totalLate
    }
  }
`;

export const LOAD_TRACKING_HISTORY_EXPORT = gql`
  query studentTrackingHistoriesExport(
    $filter: StudentTrackingHistoriesExportFilterInput!
  ) {
    studentTrackingHistoriesExport(filter: $filter) {
      url
    }
  }
`;

export const LOAD_TRACKING_HISTORY = gql`
  query attendanceOfDateByStudent(
    $filter: AttendanceOfDateByStudentFilterInput!
    $page: Int
    $orderBy: [AttendanceOfDateByStudentOrderByOrderByClause!]
  ) {
    attendanceOfDateByStudent(
      first: 7
      orderBy: $orderBy
      page: $page
      filter: $filter
    ) {
      paginatorInfo {
        hasMorePages
        total
      }
      data {
        date
        statistic {
          getOnOfTurnAwayInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOffOfTurnAwayInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          gateOfTurnAwayInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          classroomOfTurnAwayInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          classroomOfTurnBackInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          gateOfTurnBackInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOnOfTurnBackInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOffOfTurnBackInTheMorning {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOnOfTurnAwayInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOffOfTurnAwayInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          gateOfTurnAwayInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          classroomOfTurnAwayInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          classroomOfTurnBackInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          gateOfTurnBackInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOnOfTurnBackInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
          getOffOfTurnBackInTheAfternoon {
            avatar
            time
            isLate
            isNotStartedYet
          }
        }
      }
    }
  }
`;
