import { gql } from "@apollo/client";

export const LOAD_ATTENDANCE_OF_TIME = gql`
  query attendanceOfTimeByStudent(
    $filter: AttendanceOfTimeByStudentFilterInput!
  ) {
    attendanceOfTimeByStudent(filter: $filter) {
      timeTypeForView
      chart {
        labels
        values {
          absent
          late
        }
      }
    }
  }
`;

export const LOAD_ATTENDANCE_OF_CLASSROOM = gql`
  query attendanceOfClassroom(
    $filter: AttendanceOfClassroomFilterInput!
    $orderBy: [AttendanceOfClassroomOrderByOrderByClause!]
    $first: Int
  ) {
    attendanceOfClassroom(filter: $filter, orderBy: $orderBy, first: $first) {
      classroom {
        id
        name
        teacher {
          name
        }
        grade {
          name
        }
      }
      statistic {
        lateInAllDay
        absentInAllDay
      }
    }
  }
`;

export const LOAD_SCHOOLYEARS = gql`
  query loadSchoolyears {
    schoolyears(first: 1000) {
      data {
        id
        name
        endAt
        startAt
        mostRecentSemester
      }
    }
  }
`;

export const GET_URL_EXPORT = gql`
  query studentOfClassroomAttendanceStatisticsExport(
    $filter: studentOfClassroomAttendanceStatisticsExportFilterInput!
  ) {
    studentOfClassroomAttendanceStatisticsExport(filter: $filter) {
      url
    }
  }
`;
