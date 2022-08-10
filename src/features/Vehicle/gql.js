import {gql} from '@apollo/client';

export const LOAD_VEHICLES = gql`
    query loadVehicles($first: Int, $page: Int, $filter: VehiclesFilterInput){
        vehicles(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                campusId
                avatar
                licensePlate
                brand
                version
                color
                seatNumber
                ownerName
                ownerPhone
                ownerEmail
                provider
                note
            }
        }
    }
`;

export const LOAD_VEHICLE = gql`
    query loadVehicle($id: ID!){
        vehicle(id: $id){
            key: id
            campusId
            avatar
            licensePlate
            brand
            version
            color
            seatNumber
            ownerName
            ownerPhone
            ownerEmail
            provider
            note
        }
    }
`;

export const VEHICLE_CREATE = gql`
    mutation vehicleCreate($input: VehicleCreateInput!){
        vehicleCreate(input: $input){
            id
        }
    }
`;

export const VEHICLE_UPDATE = gql`
    mutation vehicleUpdate($id: ID!, $input: VehicleUpdateInput!){
        vehicleUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_VEHICLE = gql`
    mutation vehiclesDelete($id: [ID!]!){
        vehiclesDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_VEHICLE = gql`
    query getRelevantDataForCreateVehicle{
        campuses{
            data{
                id
                name
            }
        }
    }
`;
