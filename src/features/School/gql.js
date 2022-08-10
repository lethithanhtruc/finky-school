import {gql} from '@apollo/client';

export const CAMPUSES = gql`
    query campuses{
        campuses(first: 1000){
            data{
                id
                name
                avatar
                province{
                    id
                    name
                }
                district{
                    id
                    name
                }
                address
                representativeName
                representativePosition
                phone
                email
                level
                scale
                operationStart
                operationEnd
                isActivated
                isMain
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_OR_UPDATE_CAMPUS = gql`
    query getRelevantDataForCreateOrUpdateCampus{
        provinces{
            id
            name
        }
    }
`;

export const GET_DISTRICTS = gql`
    query getDistricts($filter: DistrictsFilterInput!){
        dictricts(filter: $filter){
            id
            name
        }
    }
`;

export const GET_GRADES = gql`
    query getGrades($filter: GradesFilterInput!){
        grades(filter: $filter){
            id
            name
            classroom{
                id
                name
            }
        }
    }
`;

export const CAMPUS_CREATE = gql`
    mutation campusCreate($input: CampusCreateInput!){
        campusCreate(input: $input){
            id
        }
    }
`;

export const CAMPUS_UPDATE = gql`
    mutation campusUpdate($id: ID!, $input: CampusUpdateInput!){
        campusUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const CAMPUS_DELETE = gql`
    mutation campusDelete($id: ID!){
        campusDelete(id: $id){
            id
        }
    }
`;
