import { gql } from "@apollo/client";

export const GET_FACILITY_DATA = gql`
  query getRelevantDataForStudent {
    campuses(first: 1000) {
      data {
        id
        name
        isMain
        grades {
          id
          name
          classroom {
            id
            name
            schoolYearId
          }
        }
      }
    }
  }
`;
