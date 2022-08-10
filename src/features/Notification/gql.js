import { gql } from "@apollo/client";

export const ACTIVITY_CAUSER_REGISTEREDPARENTAGE_FIELDS = gql`
  fragment Causer_RegisteredParentage on RegisteredParentage {
    parentage {
      name
      phone
    }
  }
`;

export const ACTIVITY_SUBJECT_STUDENT_FIELDS = gql`
  fragment Subject_Student on Student {
    name
    campus {
      name
    }
    classroomInCurrentSchoolYear {
      name
    }
  }
`;

export const ACTIVITY_SUBJECT_PARENTAGECENSORSHIP_FIELDS = gql`
  fragment Parentage_Censorship on ParentageCensorship {
    name
    studentRelationship
    student {
      name
      classroomInCurrentSchoolYear {
        name
        campus {
          name
        }
      }
    }
  }
`;

export const LOAD_CONSIDERS = gql`
  ${ACTIVITY_CAUSER_REGISTEREDPARENTAGE_FIELDS}
  ${ACTIVITY_SUBJECT_STUDENT_FIELDS}
  ${ACTIVITY_SUBJECT_PARENTAGECENSORSHIP_FIELDS}
  query loadConsiders($after: String, $filter: ConsidersFilterInput) {
    considers(first: 25, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          activityLog {
            id
            causer {
              ...Causer_RegisteredParentage
            }
            subject {
              ...Subject_Student
              ...Parentage_Censorship
              ...on Classroom {
                name
                campus {
                  name
                }
              }
              ...on Campus {
                name
              }
            }
            changeLogs {
              key
              oldValue
              newValue
            }
          }
          type
          accept
          isExpired
          readAt
          createdAt
        }
      }
    }
  }
`;

export const CONSIDER_CONFIRM = gql`
  mutation considerConfirm($id: ID!, $input: ConsiderConfirmInput!) {
    considerConfirm(id: $id, input: $input) {
      id
      accept
    }
  }
`;

export const MARK_ALL_AS_READ = gql`
  mutation considersMarkAllAsRead {
    considersMarkAllAsRead
  }
`;

export const GET_DATA_NUM_STUDENT_ABNORMAL_POPUP = gql`
  query studentsInVehicleHasAbnormal(
    $filter: StudentsInVehicleHasAbnormalFilterInput
  ) {
    studentsInVehicleHasAbnormal(filter: $filter) {
      id
      student {
        code
        name
        avatar
        liveWithParentages {
          name
          phone
          studentRelationship
        }
      }
      getOn {
        avatar
        time
      }
      getOff {
        avatar
        time
      }
      status
    }
  }
`;
