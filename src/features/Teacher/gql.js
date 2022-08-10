import {gql} from '@apollo/client';

export const LOAD_TEACHERS = gql`
    query loadTeachers($first: Int, $page: Int, $filter: TeachersFilterInput){
        teachers(filter: $filter, first: $first, page: $page){
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
                phone
                email
                address
                code
                status
                classrooms{
                    name
                }
                subjects{
                    id
                    name
                }
            }
        }
    }
`;

export const LOAD_TEACHER = gql`
    query loadTeacher($id: ID!){
        teacher(id: $id){
            key: id
            campuses{
                id
                name
                grades{
                    id
                    name
                    classroom{
                        id
                        name
                        schoolYearId
                        schoolYear{
                            id
                            name
                        }
                        teacher{
                            id
                        }
                        subjects{
                            id
                            name
                        }
                    }
                }
            }
            gradeIds
            subjects{
                id
                gradeIds
                name
                classrooms{
                    id
                    gradeId
                    schoolYearId
                }
            }
            name
            avatar
            birthday
            gender
            phone
            email
            address
            code
            workExperience
            startedDate
            trainingDegree
            trainingPlace
            note
            status
        }
    }
`;

export const TEACHER_ASSIGN_CLASSROOMS = gql`
    mutation teacherAssignClassrooms($id: ID!, $input: TeacherAssignClassroomsInput!){
        teacherAssignClassrooms(
            id: $id,
            input: $input
        ){
            id
        }
    }
`;

export const TEACHER_ASSIGN_SUBJECT_OF_CLASSROOMS = gql`
    mutation teacherAssignSubjectOfClassrooms($id: ID!, $input: TeacherAssignSubjectOfClassroomsInput!){
        teacherAssignSubjectOfClassrooms(
            id: $id,
            input: $input
        ){
            id
        }
    }
`;

export const TEACHER_UPDATE = gql`
    mutation teacherUpdate($id: ID!, $input: TeacherUpdateInput!){
        teacherUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_TEACHER = gql`
    mutation teachersDelete($id: [ID!]!){
        teachersDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_TEACHER_ASSIGNMENT = gql`
    query getRelevantDataForTeacherAssignment{
        schoolyears(first: 1000){
            data{
                id
                name
                endAt
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_FORM_TEACHER_INFO = gql`
    query getRelevantDataForFormTeacherInfo{
        campuses(first: 1000){
            data{
                id
                name
                grades{
                    id
                    name
                }
                level
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

export const GET_RELEVANT_DATA_FOR_TEACHER = gql`
    query getRelevantDataForTeacher{
        campuses(first: 1000){
            data{
                id
                name
                grades{
                    id
                    name
                }
                level
            }
        }
    }
`;

export const TEACHER_CODE_GENERATE = gql`
    query teacherCodeGenerate{
        teacherCodeGenerate
    }
`;

export const TEACHER_CREATE = gql`
    mutation teacherCreate($input: TeacherCreateInput!){
        teacherCreate(input: $input){
            id
        }
    }
`;
