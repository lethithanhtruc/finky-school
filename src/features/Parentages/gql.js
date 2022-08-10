import {gql} from '@apollo/client';

export const LOAD_PARENTAGES = gql`
    query loadParentages($first: Int, $page: Int, $filter: ParentagesFilterInput){
        parentages(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                name
                code
                avatar
                birthday
                studentRelationship
                phone
                email
                address
                students{
                    name
                }
                job
            }
        }
    }
`;

export const LOAD_PARENTAGE = gql`
    query loadParentage($id: ID!){
        parentage(id: $id){
            key: id
            name
            avatar
            birthday
            studentRelationship
            phone
            email
            address
        }
    }
`;

export const PARENTAGE_CREATE = gql`
    mutation parentageCreate($input: ParentageCreateInput!){
        parentageCreate(input: $input){
            id
        }
    }
`;

export const PARENTAGE_UPDATE = gql`
    mutation parentageUpdate($id: ID!, $input: ParentageUpdateInput!){
        parentageUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_PARENTAGE = gql`
    mutation parentagesDelete($id: [ID!]!){
        parentagesDelete(id: $id){
            id
        }
    }
`;
