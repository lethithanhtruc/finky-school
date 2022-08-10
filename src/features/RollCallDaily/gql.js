import { gql } from "@apollo/client";

export const LOAD_GRADES = gql`
  query gradesInCurrentSchoolYear(
    $filter: GradesInCurrentSchoolYearFilterInput!
  ) {
    gradesInCurrentSchoolYear(filter: $filter) {
      id
      name
    }
  }
`;

export const LOAD_ATTENDANCE_OF_CLASS_BY_GRADE = gql`
  query attendanceOfClassroomByGrades(
    $filter: AttendanceOfClassroomByGradesFilterInput!
  ) {
    attendanceOfClassroomByGrades(filter: $filter) {
      id
      name
      classrooms {
        classroom {
          id
          name
          teacher {
            name
          }
          totalStudents
        }
        statistic {
          absentInTheMorning
          absentInTheAfternoon
          lateInTheMorning
          lateInTheAfternoon
        }
      }
    }
  }
`;

export const SORT_ATTENDANCE_OF_STUDENT_BY_CLASS = gql`
  query attendanceOfStudentByClassrooms(
    $filter: AttendanceOfStudentByClassroomsFilterInput!
    $orderBy: [AttendanceOfStudentByClassroomsOrderByOrderByClause!]
  ) {
    attendanceOfStudentByClassrooms(filter: $filter, orderBy: $orderBy) {
      student {
        id
        name
        code
      }
      statistic {
        absentInTheMorning
        absentInTheAfternoon
        lateInTheMorning
        lateInTheAfternoon
      }
    }
  }
`;

export const LOAD_INFOR_CLASS_BY_ID = gql`
  query classroom($id: ID!) {
    classroom(id: $id) {
      code
      name
      totalStudents
    }
  }
`;

export const LOAD_CAMPUS_MAIN = gql`
  query campusMain {
    campusMain {
      id
      name
    }
  }
`;

export const GET_URL_EXPORT = gql`
  query attendanceOfStudentByClassroomExport(
    $filter: AttendanceOfStudentByClassroomsFilterInput!
  ) {
    attendanceOfStudentByClassroomExport(filter: $filter) {
      url
    }
  }
`;
