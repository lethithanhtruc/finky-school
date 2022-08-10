import {gql} from '@apollo/client';

export const LOAD_DRIVERS = gql`
    query loadDrivers($first: Int, $page: Int, $filter: DriversFilterInput){
        drivers(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                campusId
                avatar
                name
                code
                gender
                birthday
                provinceIdOfBirth
                phone
                address
                provider
                licenseType
                dateOfIssue
                note
                status
            }
        }
    }
`;

export const LOAD_DRIVER = gql`
    query loadDriver($id: ID!){
        driver(id: $id){
            key: id
            campusId
            avatar
            name
            code
            gender
            birthday
            provinceIdOfBirth
            phone
            address
            provider
            licenseType
            dateOfIssue
            note
            status
        }
    }
`;

export const DRIVER_CREATE = gql`
    mutation driverCreate($input: DriverCreateInput!){
        driverCreate(input: $input){
            id
        }
    }
`;

export const DRIVER_UPDATE = gql`
    mutation driverUpdate($id: ID!, $input: DriverUpdateInput!){
        driverUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_DRIVER = gql`
    mutation driversDelete($id: [ID!]!){
        driversDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_DRIVER = gql`
    query getRelevantDataForCreateDriver{
        campuses{
            data{
                id
                name
            }
        }
        provinces{
            id
            name
        }
    }
`;

export const DRIVER_CODE_GENERATE = gql`
    query driverCodeGenerate{
        driverCodeGenerate
    }
`;
