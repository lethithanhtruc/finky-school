import {gql} from '@apollo/client';

export const LOAD_STUDENTS = gql`
    query loadStudents($first: Int, $page: Int, $filter: StudentsFilterInput){
        students(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                name
                avatar
                birthday
                gender
                code
                liveWith
                emergencyContact
                parentages{
                    name
                    studentRelationship
                    phone
                    address
                }
                classrooms{
                    id
                    name
                }
                stationInCurrentSchoolYear{
                    id
                }
            }
        }
    }
`;

export const LOAD_STUDENT = gql`
    query loadStudent($id: ID!){
        student(id: $id){
            key: id
            classrooms{
                id
                name
                schoolYearId
                schoolYear{
                    id
                    name
                }
                teacher{
                    id
                    name
                    avatar
                }
            }
            parentages{
                id
                name
                phone
                studentRelationship
                email
                address
            }
            campusId
            campus{
                id
                name
                grades{
                    id
                    name
                    classroom{
                        id
                        name
                        schoolYearId
                    }
                }
            }
            name
            avatar
            birthday
            gender
            provinceIdOfBirth
            liveWith
            emergencyContact
            code
            startedAt
            endedAt
            note
            status
        }
    }
`;

export const STUDENT_CREATE = gql`
    mutation studentCreate($input: StudentCreateInput!){
        studentCreate(input: $input){
            id
        }
    }
`;

export const STUDENT_UPDATE = gql`
    mutation studentUpdate($id: ID!, $input: StudentUpdateInput!){
        studentUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_STUDENT = gql`
    mutation studentsDelete($id: [ID!]!){
        studentsDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_STUDENT = gql`
    query getRelevantDataForCreateStudent{
        provinces{
            id
            name
        }
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
        subjects(first: 1000){
            data{
                id
                gradeIds
                name
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_STUDENT = gql`
    query getRelevantDataForStudent{
        campuses(first: 1000){
            data{
                id
                name
                grades{
                    id
                    name
                    classroom{
                        id
                        name
                        schoolYearId
                    }
                }
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_STUDENT_ASSIGNMENT = gql`
    query getRelevantDataForStudentAssignment{
        schoolyears(first: 1000){
            data{
                id
                name
                endAt
            }
        }
    }
`;

export const STUDENT_CODE_GENERATE = gql`
    query studentCodeGenerate{
        studentCodeGenerate
    }
`;

export const STUDENTS_UPLOAD = gql`
    mutation studentsUpload($input: StudentsUploadInput!){
        studentsUpload(input: $input)
    }
`;
