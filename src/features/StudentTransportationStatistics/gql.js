import {gql} from '@apollo/client';

export const LOAD_SCHEDULE_LOGS = gql`
    query loadScheduleLogs($first: Int, $page: Int, $filter: ScheduleLogsFilterInput!) {
        scheduleLogs(filter: $filter, first: $first, page: $page) {
            paginatorInfo{
                total
                currentPage
                lastPage
            }
            data {
                id
                campusId
                scheduleId
                schedule{
                    name
                }
                startedAt
                finishedAt
                vehicleId
                vehicle{
                    licensePlate
                }
                driverId
                driver{
                    name
                }
                nannyId
                nanny{
                    name
                }
                status
                statistic {
                    totalTime
                    totalStudentsWaiting
                    totalStation
                    totalStudentsIgnored
                    totalStudentsRegistered
                    totalStudentsDone
                    isUnusualCondition
                }
            }
        }
    }
`;

export const LOAD_SCHEDULE_LOGS_STATISTIC = gql`
    query scheduleLogsStatistic($filter: ScheduleLogsStatisticFilterInput!) {
        scheduleLogsStatistic(filter: $filter) {
            totalVehicles
            totalVehiclesCompleted
            totalVehiclesNotCompleted
            totalVehiclesOnTime
            totalVehiclesRunningLate
        }
    }
`;

export const LOAD_SCHEDULE_STATION_LOGS = gql`
    query scheduleStationLogs($filter: ScheduleStationLogsFilterInput!) {
        scheduleStationLogs(filter: $filter){
            id
            arrivedAt
            station{
                name
            }
            totalStudentsDone
            studentsDone{
                id
                code
                name
                timeGetOn
                timeGetOff
            }
        }
    }

`