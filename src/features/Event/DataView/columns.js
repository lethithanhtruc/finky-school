import { Dropdown, Menu } from 'antd';
import moment from 'moment';
import { LANGUAGE_SHORT_TEXT_TYPE, STATUS_OPTIONS, LANGUAGE_OPTIONS, LANGUAGE_VI_EN } from '../constants';
import StatusIcon from '../StatusIcon';

export const columns = (intl, selectedRow, viewEvent, editEvent, deleteEvent, cancelEvent) => {
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `event.view.dataView.columns.${suffix}`,
        });
    }

    return [
        {
            title: getText('eventId'),
            dataIndex: 'code',
            align: 'left',
            width: 100,
            render: (text) => {
                return (<div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>{text}</div>);
            }
        },
        {
            title: getText('eventName'),
            dataIndex: 'name',
            align: 'left',
            render: (text, record) => {
                const renderTitle = () => {
                    if (record.languageType === LANGUAGE_VI_EN) {
                        if (intl.locale === 'en') {
                            return record.titleEn;
                        }
                    }
                    if (record.languageType === LANGUAGE_OPTIONS.EN) {
                        return record.titleEn || record.titleVi;
                    }
                    return record.titleVi || record.titleEn;
                }

                const renderContent = () => {
                    if (record.languageType === LANGUAGE_VI_EN) {
                        if (intl.locale === 'en') {
                            return record.contentEn;
                        }
                    }
                    if (record.languageType === LANGUAGE_OPTIONS.EN) {
                        return record.contentEn || record.contentVi;
                    }
                    return record.contentVi || record.contentEn;
                }

                return (
                    <div style={{ fontSize: 14 }}>
                        <div
                            style={{
                                color: '#313131',
                                fontSize: '16px',
                                fontWeight: 500
                            }}
                        >
                            {renderTitle()}
                        </div>
                        <div
                            style={{
                                display: 'flex'
                            }}
                        >
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '2px 4px',
                                    borderRadius: 4,
                                    background: '#E8F0FC',
                                    color: '#16499C',
                                    marginRight: '8px'
                                }}
                            >
                                {LANGUAGE_SHORT_TEXT_TYPE[record.languageType]}
                            </span>
                            <div
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: getText('createdBy'),
            dataIndex: 'createdBy',
            align: 'left',
            render: (text) => {
                if (text.object) {
                    return (<div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>{text?.object?.name}</div>);
                }
                return (<div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>{text?.name}</div>);
            }
        },
        {
            title: getText('receiver'),
            dataIndex: 'receiveType',
            align: 'left',
            render: (text) => {
                const mappingTranslate = {
                    PARENTS: 'parents',
                    TEACHER: 'teacher',
                    DRIVER: 'driver',
                    NANNY: 'nanny'
                }
                return (
                    <div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                        {
                            intl.formatMessage({
                                id: `event.forms.receiver.${mappingTranslate[text]}`,
                            })
                        }
                    </div>
                );
            }
        },
        {
            title: getText('sendAt'),
            dataIndex: 'sendAt',
            // width: '35%',
            align: 'left',
            render: (text) => {
                if (text) {
                    const sendAtDate = moment(text);
                    return (
                        <div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                            <div>{sendAtDate.format('DD/MM/YYYY')}</div>
                            <div
                                style={{
                                    color: 'grey'
                                }}
                            >
                                {sendAtDate.format('HH:mm')}
                            </div>
                        </div>
                    );
                }
                return null;
            },
        },
        {
            title: getText('status'),
            dataIndex: 'status',
            align: 'left',
            render: (text) => {
                const mappingTranslate = {
                    SAVE_DRAFT: 'saveDraft',
                    SCHEDULE: 'schedule',
                    SENDING: 'sending',
                    SEND: 'send',
                    STOP_SEND: 'stopSend',
                }
                

                return (
                    <div
                        style={{
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <StatusIcon type={text} />
                        <div>
                            {
                                intl.formatMessage({
                                    id: `event.view.status.${mappingTranslate[text]}`,
                                })
                            }
                        </div>
                    </div>
                );
            },
        },
        {
            title: getText('sentTotal'),
            dataIndex: 'function',
            align: 'right',
            render: (text, record) => {
                if (record.recipientNumber) {
                    let percent = (record.receivedNumber / record.recipientNumber) * 100;
                    if (!Number.isInteger(percent)) {
                        percent = percent.toFixed(2);
                    }
                    return (
                        <div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                            <div>{record.receivedNumber}</div>
                            <div>
                                ({percent}%)
                            </div>
                        </div>
                    );
                }
                return '--';
            },
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'left',
            render: (text, record) => {
                const handleMenuClick = ({ key }) => {
                    if (key === 'edit') {
                        editEvent(record)();
                    } else if (key === 'delete') {
                        deleteEvent(record)();
                    }
                };
                const menu = (
                    <Menu
                        onClick={handleMenuClick}
                        style={{ width: 136 }}
                    >
                      <Menu.Item key="edit">
                        {getText('action.edit')}
                      </Menu.Item>
                      <Menu.Item key="delete">
                      {getText('action.delete')}
                      </Menu.Item>
                    </Menu>
                );

                const renderText = () => {
                    if (record.status === STATUS_OPTIONS.SENDING) {
                        return (
                            <div
                                className="cancel-event-action"
                                onClick={cancelEvent(record)}
                            >
                                {getText('action.canceled')}
                            </div>
                        );
                    }
                    return (
                        <div
                            style={{
                                color: '#007AFF',
                                cursor: 'pointer',
                                lineHeight: '28px',
                            }}
                            onClick={viewEvent(record)}
                        >
                            {getText('action.viewDetail')}
                        </div>
                    );
                }

                const renderAction = () => {
                    if (record?.id === selectedRow?.id) {
                        if ([STATUS_OPTIONS.SAVE_DRAFT, STATUS_OPTIONS.SCHEDULE].includes(record.status)) {
                            return (
                                <div>
                                    <Dropdown
                                        overlay={menu}
                                    >
                                        <button
                                            className="three-dot-action"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                                            </svg>
                                        </button>
                                    </Dropdown>
                                </div>
                            );
                        }
                    } 
                    return null;
                }
                return (
                    <div
                        style={{
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            display: 'flex'
                        }}>
                        {renderText()}
                        {renderAction()}
                    </div>
                );
            }
        }
    ];
    
}