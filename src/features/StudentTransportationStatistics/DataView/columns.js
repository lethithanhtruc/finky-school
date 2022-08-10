import { secondsToHms } from '../../../utils';
import { MORNING } from '../constants';

export const columns = (intl, type = MORNING) => [
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.carNumber',
        }),
        dataIndex: 'vehicle',
        align: 'left',
        width: 120,
        render: (text) => {
            return (<div style={{fontSize: 14, whiteSpace: 'nowrap'}}>{text?.licensePlate}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.roadName',
        }),
        dataIndex: 'schedule',
        // width: 200,
        align: 'left',
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text?.name}</div>)
        }
    },
    {
        title: type === MORNING ? intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.studentPickup',
        }) : intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.afternoon.needToReturn',
        }),
        width: 75,
        dataIndex: 'statistic',
        align: 'right',
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text?.totalStudentsRegistered}</div>)
        }
    },
    {
        title: type === MORNING ? intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.studentPickupDone',
        }) : intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.afternoon.hasRetured',
        }),
        dataIndex: 'statistic',
        align: 'right',
        width: 80,
        render: (text, {status}) => {
            return (<div style={{fontSize: 14}}>{text?.totalStudentsDone}</div>);
        }
    },
    {
        title: type === MORNING ? intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.studentUnPickup',
        }) : intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.afternoon.notRetured',
        }),
        dataIndex: 'statistic',
        align: 'right',
        width: 100,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text?.totalStudentsWaiting}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.studentPickupIgnore',
        }),
        dataIndex: 'statistic',
        align: 'right',
        width: 80,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text?.totalStudentsIgnored}</div>)
        }
    },
    {
        title: type === MORNING ? intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.places',
        }) : intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.afternoon.places',
        }),
        dataIndex: 'statistic',
        align: 'right',
        width: 90,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text?.totalStation}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.time',
        }),
        dataIndex: 'statistic',
        align: 'right',
        width: 100,
        render: (text) => {
            if (text?.totalTime) {
                return (<div style={{fontSize: 14}}>{secondsToHms(Math.abs(text?.totalTime))}</div>)
            }
            return (<div style={{ fontSize: 14 }}>'--:--:--'</div>);
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.finish',
        }),
        dataIndex: 'status',
        align: 'center',
        width: 150,
        render: (text) => {
            if (text === 'WAITING' || text === 'STARTED') {
                return <div className={`transportation-unfinish`}>
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.dataView.labels.unfinish',
                    })}
                </div>;
            }
            if (text === 'NOT_COMPLETED') {
                return <div className={`transportation-failed`}>
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.dataView.labels.failed',
                    })}
                </div>;
            }
            if (text === 'FINISHED') {
                return <div className={`transportation-finish`}>
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.dataView.labels.finish',
                    })}
                </div>;
            }
            return null;
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.dataView.columns.studentDropoff',
        }),
        dataIndex: 'statistic',
        align: 'center',
        width: 100,
        render: (text, {status}) => {
            if (status === 'FINISHED') {
                if (text?.isUnusualCondition === false) {
                    return (
                        <div className={`student-inout__full`}>
                            {
                                intl.formatMessage({
                                    id: 'student.transportation.statistic.dataView.labels.full',
                                })
                            }
                        </div>
                    );
                } else if (text?.isUnusualCondition === true) {
                    return (
                        <div className={`student-inout__missing`}>
                            {
                                intl.formatMessage({
                                    id: 'student.transportation.statistic.dataView.labels.missing',
                                })
                            }
                        </div>
                    );
                }
            }
            return null;
        }
    }
];
