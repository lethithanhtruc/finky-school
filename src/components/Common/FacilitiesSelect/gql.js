import { gql } from '@apollo/client';

export const GET_RELEVANT_DATA_FOR_STUDENT = gql`
    query getCampuses{
        campuses(first: 1000){
            data{
                id
                name
                isMain
                nearestTurn
                nearestShift
                grades{
                    id
                    name
                    classroom{
                        id
                        name
                        schoolYearId
                        totalStudents
                    }
                }
            }
        }
    }
`;