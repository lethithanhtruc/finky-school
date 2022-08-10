import { gql } from '@apollo/client';

// LOAD
export const LOAD_EVENTS = gql`
    query notificationSchedules($first: Int, $page: Int, $filter: NotificationScheduleFilterInput) {
        notificationSchedules(filter: $filter, first: $first, page: $page) {
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data {
                id
                code
                titleVi
                titleEn
                contentVi
                contentEn
                campusId
                createdBy{
                    name
                    object {
                        ... on Teacher {
                            name
                        }
                    }
                }
                classrooms {
                    ... on Classroom {
                        id
                    }
                }
                receiveType
                sendAt
                status
                recipientNumber
                receivedNumber
                languageType
                note
            }
        }
    }
`;

// GEt detail
export const LOAD_EVENT_DETAIL = gql`
    query notificationSchedule($id: ID!){
        notificationSchedule(id: $id){
            id
            code
            titleVi
            titleEn
            contentVi
            contentEn
            note
            classrooms {
                ... on Classroom {
                    id
                }
            }
            campusId
            createdBy{
                name
            }
            receiveType
            sendAt
            status
            recipientNumber
            receivedNumber
            languageType
            status
        }
    }
`;


// Create
// notificationScheduleCreate
export const CREATE_EVENT = gql`
    mutation notificationScheduleCreate($input: NotificationScheduleCreateInput!) {
        notificationScheduleCreate (input: $input){
            id
            code
        }
    }
`;

// EDIT
export const EDIT_EVENT = gql`
    mutation notificationScheduleUpdate($id: ID!, $input: NotificationScheduleUpdateInput!) {
        notificationScheduleUpdate (id: $id, input: $input){
            id
            code
        }
    }
`;

// DELETE
export const DELETE_EVENT = gql`
    mutation notificationScheduleDelete($id: ID!) {
        notificationScheduleDelete (id: $id){
            id
        }
    }
`;

// STOP SENDING
export const STOP_SENDING_EVENT = gql`
    mutation notificationScheduleStopSending($id: ID!) {
        notificationScheduleStopSending (id: $id){
            id
        }
    }
`;
