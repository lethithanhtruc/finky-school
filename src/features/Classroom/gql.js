import {gql} from '@apollo/client';

export const GET_RELEVANT_DATA_FOR_CLASSROOM = gql`
    query getRelevantDataForClassRoom{
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
    }
`;

export const LOAD_CLASSROOMS = gql`
    query loadClassrooms($filter: ClassroomsFilterInput){
        classrooms(first: 1000, filter: $filter){
            data{
                key: id
                name
                code
                campusId
                schoolYearId
                gradeId
                shift
                totalStudents
                teacher{
                    id
                    name
                    gender
                    phone
                    avatar
                }
            }
        }
    }
`;

export const DELETE_CLASSROOM = gql`
    mutation classroomsDelete($id: [ID!]!){
        classroomsDelete(id: $id){
            id
        }
    }
`;

export const STUDENTS_UPLOAD_FOR_CLASSROOM = gql`
    mutation studentsUploadForClassroom($input: StudentsUploadForClassroomInput!){
        studentsUploadForClassroom(input: $input){
            path
            students{
                schoolId
                name
                birthday
                gender
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_CLASSROOM = gql`
    query getRelevantDataForCreateClassRoom{
        campuses(first: 1000){
            data{
                id
                name
                isMain
                grades{
                    id
                    name
                }
            }
        }
        schoolyears{
            data{
                id
                name
                endAt
            }
        }
        subjects(first: 1000) {
            data {
                id
                name
                gradeIds
            }
        }
    }
`;

export const GET_TEACHERS_FOR_CREATE_CLASSROOM = gql`
    query getTeachersForCreateClassRoom($filter: TeachersFilterInput){
        teachers(first: 1000, filter: $filter){
            data{
                id
                name
                code
            }
        }
    }
`;

export const CLASSROOM_NAME_GENERATE = gql`
    query classroomNameGenerate($filter: ClassroomNameGenerateFilterInput!){
        classroomNameGenerate(filter: $filter)
    }
`;

export const CLASSROOM_CREATE = gql`
    mutation classroomCreate($input: ClassroomCreateInput!){
        classroomCreate(input: $input){
            id
        }
    }
`;
