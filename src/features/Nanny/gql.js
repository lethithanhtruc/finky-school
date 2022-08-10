import {gql} from '@apollo/client';

export const LOAD_NANNIES = gql`
    query loadNannies($first: Int, $page: Int, $filter: NanniesFilterInput){
        nannies(filter: $filter, first: $first, page: $page){
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
                note
                status
            }
        }
    }
`;

export const LOAD_NANNY = gql`
    query loadNanny($id: ID!){
        nanny(id: $id){
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
            note
            status
        }
    }
`;

export const NANNY_CREATE = gql`
    mutation nannyCreate($input: NannyCreateInput!){
        nannyCreate(input: $input){
            id
        }
    }
`;

export const NANNY_UPDATE = gql`
    mutation nannyUpdate($id: ID!, $input: NannyUpdateInput!){
        nannyUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_NANNY = gql`
    mutation nanniesDelete($id: [ID!]!){
        nanniesDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_NANNY = gql`
    query getRelevantDataForCreateNanny{
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

export const NANNY_CODE_GENERATE = gql`
    query nannyCodeGenerate{
        nannyCodeGenerate
    }
`;
