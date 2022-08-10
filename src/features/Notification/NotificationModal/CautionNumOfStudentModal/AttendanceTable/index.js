import { Avatar, Table } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import "./index.scss";

// const testData = [
//   {
//     key: "mhs",
//     id: "mhs",
//     name: "Nguyen Huu Hoang",
//     address: "Nguyen Huu Hoang",
//     status: "no_get_on_turn_away_in_the_morning",
//     getOn: { avatar: "", time: "" },
//     getOff: { avatar: "", time: "" },
//     parent: [
//       {
//         name: "Nguyen Huu Hoang",
//         phone: "12345678901",
//         studentRelationship: "relatives",
//       },
//     ],
//   },
// ];

export const AttendanceTable = ({ data }) => {
  const columns = [
    {
      title: <FormattedMessage id={`notification.modal.attendance.table.no`} />,
      dataIndex: "id",
      key: "id",
      width: 83,
    },
    {
      title: (
        <FormattedMessage id={`notification.modal.attendance.table.name`} />
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <FormattedMessage
          id={`notification.modal.attendance.table.pickupPlace`}
        />
      ),
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <FormattedMessage id={`notification.modal.attendance.table.status`} />
      ),
      dataIndex: "status",
      key: "status",
      width: 114,
      render: (status) => renderStatus(status),
    },
    {
      title: (
        <FormattedMessage
          id={`notification.modal.attendance.table.timeOn`}
          values={{ br: <br /> }}
        />
      ),
      dataIndex: "getOn",
      key: "getOn",
      render: (time) => renderTime(time),
    },
    {
      title: (
        <FormattedMessage
          id={`notification.modal.attendance.table.timeOff`}
          values={{ br: <br /> }}
        />
      ),
      dataIndex: "getOff",
      key: "getOff",
      render: (time) => renderTime(time),
    },
    {
      title: (
        <FormattedMessage id={`notification.modal.attendance.table.parent`} />
      ),
      dataIndex: "parent",
      key: "address",
      width: 180,
      render: (parent) => renderParent(parent),
    },
  ];

  const renderStatus = (status) => {
    return (
      <div className="attendance-table__status">
        <FormattedMessage
          id={`notification.caution.student.${status.toLowerCase()}`}
        />
      </div>
    );
  };

  const renderTime = ({ avatar, time }) => {
    return (
      <div className="attendance-table__time">
        <Avatar size={32} src={avatar} />
        {time || "--:--:--"}
      </div>
    );
  };

  const renderParent = (parent) => {
    const { name, phone, studentRelationship } = parent[0];

    return (
      <div>
        <div>{name}</div>
        <span>
          (
          {
            <FormattedMessage
              id={`student.relationship.${studentRelationship.toLowerCase()}`}
            />
          }
          )-{phone}
        </span>
      </div>
    );
  };

  const normalizeData = (data) => {
    const normalizedData = data.map((record) => {
      return {
        key: record?.id,
        id: record?.student?.code,
        name: record?.student?.name,
        address: record?.student?.stationInCurrentSchoolYear?.name,
        status: record?.status,
        getOn: record?.getOn,
        getOff: record?.getOff,
        parent: record?.student?.liveWithParentages,
      };
    });

    return normalizedData;
  };

  return (
    <>
      <div className="attendance-table__heading">
        <FormattedMessage id={`notification.modal.attendance.table.detail`} />
      </div>
      <Table
        className="attendance-table"
        dataSource={normalizeData(data)}
        columns={columns}
        pagination={false}
        scroll={{ y: 253 }}
      />
    </>
  );
};
