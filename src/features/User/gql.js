import {gql} from '@apollo/client';

export const LOAD_USERS = gql`
    query loadUsers($first: Int, $page: Int, $filter: UsersFilterInput){
        users(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                name
                username
                email
                name
                avatar
                isActivated
                createdAt
                updatedAt
            }
        }
    }
`;

export const LOAD_USER = gql`
    query loadUser($id: ID!){
        user(id: $id){
            key: id
            name
            username
            email
            name
            avatar
            isActivated
            createdAt
            updatedAt
        }
    }
`;

export const LOAD_ME = gql`
    query loadMe{
        me{
            key: id
            name
            username
            email
            name
            avatar
            isActivated
            createdAt
            updatedAt
            totalNewConsiders
            school{
                avatar
                bannerSmall
            }
        }
    }
`;

export const USER_CREATE = gql`
    mutation userCreate($input: UserCreateInput!){
        userCreate(input: $input){
            id
        }
    }
`;

export const USER_UPDATE = gql`
    mutation userUpdate($id: ID!, $input: UserUpdateInput!){
        userUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_USER = gql`
    mutation usersDelete($id: [ID!]!){
        usersDelete(id: $id){
            id
        }
    }
`;
