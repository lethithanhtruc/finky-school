export const transportPlaceColumns = intl => [
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.transportPlaces.columns.places',
        }),
        dataIndex: 'station',
        align: 'left',
        width: '45%',
        render: (text) => {
            if (text?.name) {
                return (<div style={{ fontSize: 14 }}>{text?.name}</div>);
            }
            return (
                <div style={{ fontSize: 14 }}>{
                    intl.formatMessage({
                        id: 'student.transportation.statistic.transportPlaces.columns.school',
                    })
                }</div>
            );
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.transportPlaces.columns.time',
        }),
        dataIndex: 'arrivedAt',
        align: 'right',
        width: 100,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.transportPlaces.columns.totalStudent',
        }),
        dataIndex: 'totalStudentsDone',
        align: 'right',
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
];

export const studentColumns = intl => [
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.no',
        }),
        dataIndex: 'id',
        align: 'left',
        render: (text, item, index) => {
            return (<div style={{fontSize: 14}}>{index + 1}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.studentNo',
        }),
        dataIndex: 'code',
        align: 'left',
        width: 100,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.studentName',
        }),
        dataIndex: 'name',
        align: 'left',
        width: 180,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.places',
        }),
        dataIndex: 'station',
        align: 'left',
        width: 180,
        render: (text, record) => {
            return (<div style={{fontSize: 14}}>{text?.name}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.pickupTime',
        }),
        dataIndex: 'timeGetOn',
        align: 'right',
        width: 100,
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
    {
        title: intl.formatMessage({
            id: 'student.transportation.statistic.students.columns.dropOffTime',
        }),
        dataIndex: 'timeGetOff',
        width: 100,
        align: 'right',
        render: (text) => {
            return (<div style={{fontSize: 14}}>{text}</div>)
        }
    },
];
