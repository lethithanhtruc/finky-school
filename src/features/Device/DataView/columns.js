import { Space } from 'antd';
import Icon from '@ant-design/icons';

import { DEVICE_FUNCTIONS, CAMERA_TYPE_VALUES, CAMERA_TYPES } from '../constants';

import { ReactComponent as EditIcon } from "../images/Edit.svg";
import { ReactComponent as DeleteIcon } from "../images/Delete.svg";

export const columns = (intl, selectedRow, redirectToEdit, deleteItem) => {
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.view.dataView.columns.${suffix}`,
        });
    }

    return [
        {
            title: getText('deviceId'),
            dataIndex: 'code',
            align: 'left',
            width: 120,
            render: (text) => {
                return (<div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>{text}</div>);
            }
        },
        {
            title: getText('deviceName'),
            dataIndex: 'name',
            align: 'left',
            width: 250,
            render: (text) => {
                return (<div style={{ fontSize: 14 }}>{text}</div>);
            }
        },
        {
            title: getText('deviceType'),
            width: 120,
            dataIndex: 'type',
            align: 'left',
            render: (text) => {
                if (text === CAMERA_TYPES.IN_CAMPUS) {
                    return (<div style={{ fontSize: 14 }}>{getText('deviceType.onCampus')}</div>);
                } else if (text === CAMERA_TYPES.IN_CLASSROOM) {
                    return (<div style={{ fontSize: 14 }}>{getText('deviceType.onClass')}</div>);
                } else if (text === CAMERA_TYPES.IN_VEHICLE) {
                    return (<div style={{ fontSize: 14 }}>{getText('deviceType.onCar')}</div>);
                }
                return null;
            }
        },
        {
            title: getText('devicePart'),
            dataIndex: 'location',
            align: 'left',
            width: 150,
            render: (text) => {
                if (text?.__typename === CAMERA_TYPE_VALUES.Vehicle) {
                    return (<div style={{ fontSize: 14 }}>{text?.licensePlate}</div>);
                } else if (text?.__typename === CAMERA_TYPE_VALUES.Classroom) {
                    return (<div style={{ fontSize: 14 }}>{text?.name}</div>);
                } else if (text?.__typename === CAMERA_TYPE_VALUES.Gate) {
                    return (<div style={{ fontSize: 14 }}>{text?.name}</div>);
                }
                return null;
            }
        },
        {
            title: getText('deviceFunction'),
            dataIndex: 'function',
            // width: '35%',
            align: 'left',
            render: (text) => {
                const functions = text?.map(item => {
                    if (item === DEVICE_FUNCTIONS.CHECKIN) {
                        return (<div className="device-management__function-item">{getText('deviceFunction.checkin')}</div>);
                    } else if (item === DEVICE_FUNCTIONS.CHECKOUT) {
                        return (<div className="device-management__function-item">{getText('deviceFunction.checkout')}</div>);
                    } else if (item === DEVICE_FUNCTIONS.CHECK_TEMPERATURE) {
                        return (<div className="device-management__function-item">{getText('deviceFunction.temperature')}</div>);
                    }
                    return null;
                }).filter(item => item)
                return (<div style={{ fontSize: 14, display: 'flex' }}>{functions}</div>);
            },
        },
        {
            title: '',
            dataIndex: 'action',
            width: 60,
            align: 'left',
            render: (text, record) => {
                if (record?.id === selectedRow?.id) {
                    return (
                        <div style={{ fontSize: 14, display: 'flex', cursor: 'pointer', justifyContent: 'flex-end' }}>
                            <Space>
                                <Icon
                                    onClick={redirectToEdit(record)}
                                    component={EditIcon}
                                    style={{
                                        fontSize: 16,
                                        color: 'transparent',
                                    }}
                                />
                                <Icon
                                    onClick={deleteItem(record)}
                                    component={DeleteIcon}
                                    style={{
                                        fontSize: 16,
                                        color: 'transparent'
                                    }}
                                />
                            </Space>
                        </div>
                    );
                }
                return null;
            }
        }
    ];
    
}