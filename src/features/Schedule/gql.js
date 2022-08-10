import {gql} from '@apollo/client';

export const LOAD_SCHEDULES = gql`
    query loadSchedules($first: Int, $page: Int, $filter: SchedulesFilterInput){
        schedules(filter: $filter, first: $first, page: $page){
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data{
                key: id
                code
                name
                turnAwayVehicle{
                    licensePlate
                    seatNumber
                }
                turnAwayDriver{
                    name
                }
                turnAwayNanny{
                    name
                }
                turnBackVehicle{
                    licensePlate
                    seatNumber
                }
                turnBackDriver{
                    name
                }
                turnBackNanny{
                    name
                }
                stationsInCurrentSchoolYear{
                    station{
                        id
                        name
                    }
                    turn
                    sort
                    morningAt
                    afternoonAt
                }
                totalTurnAwayStation
                totalTurnAwayStudent
                totalTurnBackStation
                totalTurnBackStudent
            }
        }
    }
`;

export const LOAD_SCHEDULE = gql`
    query loadSchedule($id: ID!){
        schedule(id: $id){
            key: id
            campusId
            code
            name
            turnAwayVehicleId
            turnAwayDriverId
            turnAwayNannyId
            turnAwayDescription
            turnBackVehicleId
            turnBackDriverId
            turnBackNannyId
            turnBackDescription
            turnAwayVehicle{
                licensePlate
                seatNumber
            }
            turnAwayDriver{
                name
            }
            turnAwayNanny{
                name
            }
            turnBackVehicle{
                licensePlate
                seatNumber
            }
            turnBackDriver{
                name
            }
            turnBackNanny{
                name
            }
            stationsInCurrentSchoolYear{
                station{
                    id
                    name
                }
                turn
                sort
                morningAt
                afternoonAt
            }
            totalTurnAwayStation
            totalTurnAwayStudent
            totalTurnBackStation
            totalTurnBackStudent
        }
    }
`;

export const SCHEDULE_CREATE = gql`
    mutation scheduleCreate($input: ScheduleCreateInput!){
        scheduleCreate(input: $input){
            id
        }
    }
`;

export const SCHEDULE_UPDATE = gql`
    mutation scheduleUpdate($id: ID!, $input: ScheduleUpdateInput!){
        scheduleUpdate(id: $id, input: $input){
            id
        }
    }
`;

export const DELETE_SCHEDULE = gql`
    mutation schedulesDelete($id: [ID!]!){
        schedulesDelete(id: $id){
            id
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_SCHEDULE = gql`
    query getRelevantDataForSchedule{
        campuses(first: 1000){
            data{
                id
                name
            }
        }
        schoolyears(first: 1000){
            data{
                id
                name
                startAt
                endAt
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE = gql`
    query getRelevantDataForCreateSchedule{
        campuses{
            data{
                id
                name
            }
        }
    }
`;

export const GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE_BY_CAMPUS = gql`
    query getRelevantDataForCreateSchedule($campusId: ID!){
        vehicles(first: 1000, filter: {
            campusId: $campusId
        }){
            data{
                id
                licensePlate
                seatNumber
            }
        }
        drivers(first: 1000, filter: {
            campusId: $campusId
        }){
            data{
                id
                name
            }
        }
        nannies(first: 1000, filter: {
            campusId: $campusId
        }){
            data{
                id
                name
            }
        }
    }
`;


export const SCHEDULE_CODE_GENERATE = gql`
    query scheduleCodeGenerate{
        scheduleCodeGenerate
    }
`;

export const LOAD_STATIONS = gql`
    query loadStations($filter: StationsFilterInput){
        stations(filter: $filter, first: 1000){
            data{
                id
                name
                totalStudents
            }
        }
    }
`;
