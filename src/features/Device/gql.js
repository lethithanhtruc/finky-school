import {gql} from '@apollo/client';

// LOAD
export const LOAD_DEVICES = gql`
    query cameras($first: Int, $page: Int, $filter: CameraFilterInput) {
        cameras(filter: $filter, first: $first, page: $page) {
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data {
                id
                name
                code
                topic
                type
                location {
                    __typename
                    ... on Gate {
                        id
                        name
                    }
                    ... on Classroom {
                        id
                        name
                    }
                    ... on Vehicle {
                        id
                        licensePlate
                    }
                }
                ipAddress
                installedAt
                function
                usedFor
                campusId
                campus {
                    name
                }
                note
                status
            }
        }
    }
`;

// GEt detail
export const LOAD_DEVICE_DETAIL = gql`
    query loadCameraDetail($id: ID!){
        camera(id: $id){
            id
            name
            code
            topic
            type
            ipAddress
            installedAt
            function
            usedFor
            campusId
            note
            status
            location {
                __typename
                ... on Gate {
                    id
                    name
                }
                ... on Classroom {
                    id
                    name
                }
                ... on Vehicle {
                    id
                    licensePlate
                }
            }
        }
    }
`;

// Create
export const CREATE_DEVICE = gql`
    mutation cameraCreate($input: CameraCreateInput!) {
        cameraCreate (input: $input){
            id
        }
    }
`;

// EDIT
export const EDIT_DEVICE = gql`
    mutation cameraUpdate($id: ID!, $input: CameraUpdateInput!) {
        cameraUpdate (id: $id, input: $input){
            id
        }
    }
`;

// DELETE
export const DELETE_DEVICE = gql`
    mutation cameraDelete($id: ID!) {
        cameraDelete (id: $id){
            id
        }
    }
`;

// LOAD CLASS
export const LOAD_CLASSROOMS = gql`
    query classroomsWithoutPaginatitonInCurrentSchoolYear($filter: ClassroomsWithoutPaginatitonInCurrentSchoolYearFilterInput!){
        classroomsWithoutPaginatitonInCurrentSchoolYear(filter: $filter){
            id
            code
            name
        }
    }
`;

// LOAD VEHICELS
export const LOAD_VEHICLES = gql`
    query vehiclesWithoutPaginatiton($filter: VehiclesWithoutPaginatitonFilterInput!){
        vehiclesWithoutPaginatiton(filter: $filter){
            id
            licensePlate
        }
    }
`;


// LOAD CAMPUS GATES
export const LOAD_GATES = gql`
    query gatesWithoutPaginatiton($filter: GatesWithoutPaginatitonFilterInput!){
        gatesWithoutPaginatiton(filter: $filter){
            id
            name
        }
    }
`;

export const DOWNLOAD_MUTATION = gql`
    mutation camerasExport($filter: CamerasExportFilterInput!) {
        camerasExport(filter: $filter){
            url
        }
    }
`;

export const GET_SCHOOL_YEAR_RANGE = gql`
    query timeRange($numberOfYear: Int!) {
        schoolyearTimeRange(numberOfYear: $numberOfYear){
            startAt
            endAt
        }
    }
`;