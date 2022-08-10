import {gql} from '@apollo/client';

export const SCHOOL_PUBLIC = gql`
    query schoolPublic($domain: String!){
        schoolPublic(domain: $domain){
            id
            name
            avatar
            bannerLarge
        }
    }
`;

export const LOGIN = gql`
    mutation login($schoolId: ID!, $username: String!, $password: String!){
        login(type: SCHOOL, schoolId: $schoolId, username: $username, password: $password){
            accessToken
        }
    }
`;
