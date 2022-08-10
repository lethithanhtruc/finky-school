import {gql} from '@apollo/client';

export const LOAD_STATIONS = gql`
    query loadStations($first: Int, $page: Int, $filter: StationsFilterInput){
        stations(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                code
                avatar
                name
                from
                status
                students{
                    id
                }
                gmapAddress
            }
        }
    }
`;

export const LOAD_STATION = gql`
    query loadStation($id: ID!){
        station(id: $id){
            key: id
            code
            name
            from
            to
            note
            status
            students{
                key: id
                name
                code
                classrooms{
                    id
                    name
                    schoolYearId
                }
            }
            gmapAddress
        }
    }
`;

export const STATION_CREATE = gql`
    mutation stationCreate($input: StationCreateInput!){
        stationCreate(input: $input){
            id
        }
    }
`;

export const STATION_UPDATE = gql`
    mutation stationUpdate($id: ID!, $input: StationUpdateInput!){
        stationUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_STATION = gql`
    mutation stationsDelete($id: [ID!]!){
        stationsDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_STATION = gql`
    query getRelevantDataForStation{
        campuses(first: 1000){
            data{
                id
                name
            }
        }
        schoolyears(first: 1000){
            data{
                id
                name
                startAt
                endAt
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_STATION = gql`
    query getRelevantDataForCreateStation{
        campuses(first: 1000){
            data{
                id
                name
                grades{
                    id
                    name
                }
            }
        }
        schoolyears(first: 1000) {
            data {
                id
                name
                endAt
            }
        }
    }
`;

export const GET_CLASSROOM_DATA_FOR_CREATE_STATION = gql`
    query getClassroomDataForCreateStation($filter: ClassroomsFilterInput){
        classrooms(first: 1000, filter: $filter){
            data{
                id
                name
            }
        }
    }
`;

export const GET_STUDENT_DATA_FOR_CREATE_STATION = gql`
    query getStudentDataForCreateStation($filter: StudentsFilterInput){
        students(first: 1000, filter: $filter){
            data{
                key: id
                name
                code
                classrooms{
                    id
                    name
                    schoolYearId
                }
                stationInCurrentSchoolYear{
                    id
                }
            }
        }
    }
`;

export const STATION_CODE_GENERATE = gql`
    query stationCodeGenerate{
        stationCodeGenerate
    }
`;
