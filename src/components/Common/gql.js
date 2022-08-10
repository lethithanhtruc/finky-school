import {gql} from '@apollo/client';

export const LOAD_SCHOOLYEARS = gql`
    query loadSchoolyears{
        schoolyears(first: 1000) {
            data {
                id
                name
                endAt
            }
        }
    }
`;
