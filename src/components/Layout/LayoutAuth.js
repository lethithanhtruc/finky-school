import React, { useState, useEffect, useContext } from "react";
import { matchPath } from "react-router";
import {
  Link,
  useRouteMatch,
  useLocation,
  Redirect,
  useHistory,
  Route,
  Switch,
} from "react-router-dom";
import {
  Layout as LayoutAnt,
  PageHeader,
  Menu,
  Dropdown,
  Avatar,
  Badge,
  List,
  message,
  Image,
  Button,
  Space,
  Select,
} from "antd";
import "./LayoutAuth.scss";
import StoreProvider, { StoreContext } from "../../store";
import { FacilityProvider } from '../Common/FacilitiesSelect/context';

import { UserOutlined } from "@ant-design/icons";
// import MenuNotification from "./MenuNotification";
import SpinPage from "./SpinPage";
import loadable from "@loadable/component";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ME } from "../../features/User/gql";
import { Helmet } from "react-helmet";

import { ReactComponent as IconSchool } from "../../svg/icon-school.svg";
import { ReactComponent as IconClass } from "../../svg/icon-class.svg";
import { ReactComponent as IconTeacher } from "../../svg/icon-teacher.svg";
import { ReactComponent as IconSubject } from "../../svg/icon-subject.svg";
import { ReactComponent as IconStudent } from "../../svg/icon-student.svg";
import { ReactComponent as IconParents } from "../../svg/icon-parents.svg";
import { ReactComponent as IconNotification } from "../../svg/icon-notification.svg";
import { ReactComponent as IconDriver } from "../../svg/icon-driver.svg";
import { ReactComponent as IconNanny } from "../../svg/icon-nanny.svg";
import { ReactComponent as IconVehicle } from "../../svg/icon-vehicle.svg";
import { ReactComponent as IconSchedule } from "../../svg/icon-schedule.svg";
import { ReactComponent as IconStatistic } from "../../svg/icon-transportation-statistics.svg";
import { ReactComponent as IconExit } from "../../svg/icon-exit.svg";
import { ReactComponent as IconRollCallDaily } from "../../svg/icon-roll-daily.svg";
import { ReactComponent as IconDevice } from "../../svg/icon_device_24px.svg";
import { ReactComponent as IconAttendanceStatistic } from "../../svg/icon-attendace-statictis.svg";
import { ReactComponent as IconCreateEvent } from "../../svg/Icon_createEvent.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { LOGOUT } from "./gql";

const { Header, Sider, Content } = LayoutAnt;
const { SubMenu } = Menu;

const WrapperPage = ({ route, children }) => {
  const [keySelectedSidebar, setKeySelectedSidebar] =
    useContext(StoreContext).keySelectedSidebar;

  useEffect(() => {
    const match = matchPath(window.location.pathname, route);
    if (match) {
      setKeySelectedSidebar(route.keySidebar + "");
    }
  }, []);

  return children;
};

const Sidebar = ({ dataSidebar }) => {
  const intl = useIntl();
  const history = useHistory();
  const [keySelectedSidebar, setKeySelectedSidebar] =
    useContext(StoreContext).keySelectedSidebar;
  const [me, setme] = useContext(StoreContext).me;

  const [language, setLanguage] = useState(localStorage.getItem("language"));
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const siderBreakpoint = (broken) => {
    if (broken) {
      setCollapsed(!collapsed);
    }
  };

  const [
    logout,
    { loading: loadingLogout, error: errorLogout, data: dataLogout },
  ] = useMutation(LOGOUT);
  useEffect(() => {
    if (!loadingLogout && errorLogout) {
      // ...
    } else if (!loadingLogout && dataLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [loadingLogout, errorLogout, dataLogout]);

  const { loading: loadingMe, error, data: dataMe } = useQuery(LOAD_ME);
  useEffect(() => {
    if (!loadingMe && error) {
      // localStorage.removeItem('token');
      // history.push("/login");
    } else if (!loadingMe && dataMe) {
      // ...
      console.log("Layout page", dataMe);
      setme(dataMe.me);
      // handleRouter(dataMe);
    }
  }, [loadingMe, error, dataMe]);

  return (
    <Sider
      theme="light"
      width={220}
      breakpoint="xs"
      collapsedWidth="0"
      trigger={null}
      collapsible
      collapsed={collapsed}
      onBreakpoint={siderBreakpoint}
    >
      <div className="logo">
        <img
          src={
            dataMe?.me?.school.avatar && dataMe?.me?.school.avatar != ""
              ? `${dataMe?.me?.school.avatar}`
              : `${process.env.PUBLIC_URL}/assets/img/logo-default.png`
          }
        />
        <div className="wrapper-language">
          <label htmlFor="">Ngôn ngữ: </label>
          <Select
            value={language}
            options={[
              {
                label: "VI",
                value: "vi",
              },
              {
                label: "EN",
                value: "en",
              },
            ]}
            onChange={(value) => {
              // console.log('valuevalue', value)
              history.push(`/language/${value}`);
            }}
          />
        </div>
      </div>
      <Menu
        id="menu-sidebar"
        theme="light"
        mode="inline"
        inlineIndent={0}
        openKeys={["2", "3", "4", "5", "6", "7"]}
        selectedKeys={[keySelectedSidebar]}
      >
        {dataSidebar &&
          dataSidebar.map((menu, index) => (
            <SubMenu key={menu.key} title={menu.title}>
              {menu &&
                menu.routes.map((item) => {
                  const isNotificationMenu = item.title === intl.formatMessage({ id: "sidebar.item.notification" });
                  const hasNewNotification = me?.totalNewConsiders;
                  const hightlightIcon = isNotificationMenu && hasNewNotification ? "wrap-icon--hightlight" : "";

                  return (
                    <Menu.Item key={item.key}>
                      <Link to={item.path}>
                        <span className={`wrap-icon ${hightlightIcon}`}>{item.icon}</span>
                        <span className="wrap-title">{item.title}</span>
                      </Link>
                    </Menu.Item>
                  ) 
                })
              }
            </SubMenu>
          ))}
      </Menu>
      {dataMe && (
        <div className="user-info">
          <div>
            <Space>
              <Avatar size={36} icon={<UserOutlined />} />
              <div className="user-info-text">
                <div className="user-info-text-title">{dataMe.me.name}</div>
                <div className="user-info-text-desc">Description</div>
              </div>
            </Space>
          </div>
          <Button
            className="btn-logout"
            icon={<IconExit />}
            onClick={() => {
              logout().catch((e) => {
                // console.log(e.graphQLErrors)
              });
            }}
          >
            <FormattedMessage id="general.logout" />
          </Button>
        </div>
      )}
    </Sider>
  );
};

const LayoutAuth = () => {
  // const history = useHistory();
  const intl = useIntl();
  // const location = useLocation();
  const [routesAuth, setRoutesAuth] = useState(null);
  const [dataSidebar, setDataSidebar] = useState(null);
  const [keySidebarCurrent, setKeySidebarCurrent] = useState(null);

  useEffect(() => {
    setRoutesAuth(handleRouter());
    setDataSidebar(handleDataSidebar());
  }, []);

  const handleRouter = (dataUserMe) => {
    // let permissions = dataUserMe.me.role ? dataUserMe.me.role.permissions.map(item => item.name) : [];

    let routesAuth = [];
    // if(permissions.includes('read_shops_report')) {
    const School = loadable(() => import("../../features/School"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/school",
      title: intl.formatMessage({ id: "sidebar.item.campus" }),
      exact: true,
      keySidebar: 21,
      main: () => <School />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const Classroom = loadable(() => import("../../features/Classroom"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/class",
      title: intl.formatMessage({ id: "sidebar.item.class" }),
      exact: true,
      keySidebar: 22,
      main: () => <Classroom />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateClassroom = loadable(
      () => import("../../features/Classroom/Create"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/create-class/:fill",
      title: "Tạo thông tin lớp học",
      exact: true,
      keySidebar: 22,
      main: () => <CreateClassroom />,
    });
    routesAuth.push({
      path: "/create-class",
      title: "Tạo thông tin lớp học",
      exact: true,
      keySidebar: 22,
      main: () => <CreateClassroom />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const Teacher = loadable(() => import("../../features/Teacher"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/teacher",
      title: intl.formatMessage({ id: "sidebar.item.teacher" }),
      exact: true,
      keySidebar: 23,
      main: () => <Teacher />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateTeacher = loadable(
      () => import("../../features/Teacher/Create"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/create-teacher",
      title: "Hồ sơ giáo viên",
      exact: true,
      keySidebar: 23,
      main: () => <CreateTeacher />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const EditTeacher = loadable(() => import("../../features/Teacher/Edit"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/edit-teacher/:teacherId/:moreAction",
      title: "Hồ sơ giáo viên",
      exact: true,
      keySidebar: 23,
      main: () => <EditTeacher />,
    });
    routesAuth.push({
      path: "/edit-teacher/:teacherId",
      title: "Hồ sơ giáo viên",
      exact: true,
      keySidebar: 23,
      main: () => <EditTeacher />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const Subject = loadable(() => import("../../features/Subject"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/subject",
      title: intl.formatMessage({ id: "sidebar.item.subject" }),
      exact: true,
      keySidebar: 24,
      main: () => <Subject />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const Notification = loadable(() => import("../../features/Notification"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/notification",
      title: intl.formatMessage({ id: "sidebar.item.notification" }),
      exact: true,
      keySidebar: 25,
      main: () => <Notification />,
    });
    // }
    const RollCallDaily = loadable(
      () => import("../../features/RollCallDaily/PageGroupDetail"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/roll-call-daily",
      title: intl.formatMessage({ id: "sidebar.item.rollCallDaily" }),
      exact: true,
      keySidebar: 26,
      main: () => <RollCallDaily />,
    });

    const RollCallDailyOfClass = loadable(
      () => import("../../features/RollCallDaily/PageClassDetail"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/roll-call-daily/:classId",
      exact: true,
      keySidebar: 26,
      main: () => <RollCallDailyOfClass />,
    });

    const AttendanceStatistics = loadable(
      () => import("../../features/AttendanceStatistics/ChartPage"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/attendance-statistics",
      title: intl.formatMessage({
        id: "sidebar.item.attendanceStatistics",
      }),
      exact: true,
      keySidebar: 27,
      main: () => <AttendanceStatistics />,
    });

    const AttendanceStatisticsDetail = loadable(
      () => import("../../features/AttendanceStatistics/DetailClassPage"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/attendance-statistics/:type",
      exact: true,
      keySidebar: 27,
      main: () => <AttendanceStatisticsDetail />,
    });

    // if(permissions.includes('read_users')) {
    const Student = loadable(() => import("../../features/Student"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/student",
      title: intl.formatMessage({ id: "sidebar.item.student" }),
      exact: true,
      keySidebar: 31,
      main: () => <Student />,
    });

    const HistoryAttendanceAndTransport = loadable(
      () => import("../../features/Student/HistoryAttendanceAndTransport"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/tracking-history/:studentId",
      exact: true,
      keySidebar: 31,
      main: () => <HistoryAttendanceAndTransport />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateStudent = loadable(
      () => import("../../features/Student/Create"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/create-student",
      title: "Hồ sơ học sinh",
      exact: true,
      keySidebar: 31,
      main: () => <CreateStudent />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const EditStudent = loadable(() => import("../../features/Student/Edit"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/edit-student/:studentId",
      title: "Hồ sơ học sinh",
      exact: true,
      keySidebar: 31,
      main: () => <EditStudent />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const Parentages = loadable(() => import("../../features/Parentages"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/parentages",
      title: intl.formatMessage({ id: "sidebar.item.parents" }),
      exact: true,
      keySidebar: 32,
      main: () => <Parentages />,
    });
    // }
    // if(permissions.includes('read_users')) {

    const StudentTransportationStatistics = loadable(
      () => import("../../features/StudentTransportationStatistics"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/statistic",
      title: intl.formatMessage({ id: "sidebar.item.statistic" }),
      exact: true,
      keySidebar: 40,
      main: () => <StudentTransportationStatistics />,
    });

    const CreateDriver = loadable(
      () => import("../../features/Driver/Create"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/create-driver",
      title: "Thêm mới tài xế",
      exact: true,
      keySidebar: 41,
      main: () => <CreateDriver />,
    });

    const EditDriver = loadable(() => import("../../features/Driver/Edit"), {
      fallback: <SpinPage />,
    });
    routesAuth.push({
      path: "/edit-driver/:driverId",
      title: "Chỉnh sửa tài xế",
      exact: true,
      keySidebar: 41,
      main: () => <EditDriver />,
    });

    const Driver = loadable(() => import("../../features/Driver"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/driver",
      title: intl.formatMessage({ id: "sidebar.item.driver" }),
      exact: true,
      keySidebar: 41,
      main: () => <Driver />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateNanny = loadable(() => import("../../features/Nanny/Create"), {
      fallback: <SpinPage />,
    });
    routesAuth.push({
      path: "/create-nanny",
      title: "Thêm mới bảo mẫu",
      exact: true,
      keySidebar: 42,
      main: () => <CreateNanny />,
    });

    const EditNanny = loadable(() => import("../../features/Nanny/Edit"), {
      fallback: <SpinPage />,
    });
    routesAuth.push({
      path: "/edit-nanny/:nannyId",
      title: "Chỉnh sửa bảo mẫu",
      exact: true,
      keySidebar: 42,
      main: () => <EditNanny />,
    });
    const Nanny = loadable(() => import("../../features/Nanny"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/nanny",
      title: intl.formatMessage({ id: "sidebar.item.nanny" }),
      exact: true,
      keySidebar: 42,
      main: () => <Nanny />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateVehicle = loadable(
      () => import("../../features/Vehicle/Create"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/create-vehicle",
      title: "Thêm mới xe",
      exact: true,
      keySidebar: 43,
      main: () => <CreateVehicle />,
    });

    const EditVehicle = loadable(() => import("../../features/Vehicle/Edit"), {
      fallback: <SpinPage />,
    });
    routesAuth.push({
      path: "/edit-vehicle/:vehicleId",
      title: "Chỉnh sửa xe",
      exact: true,
      keySidebar: 43,
      main: () => <EditVehicle />,
    });

    const Vehicle = loadable(() => import("../../features/Vehicle"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/vehicle",
      title: intl.formatMessage({ id: "sidebar.item.vehicle" }),
      exact: true,
      keySidebar: 43,
      main: () => <Vehicle />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateStation = loadable(
      () => import("../../features/Station/Create"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/create-station",
      title: "Thêm điểm đón",
      exact: true,
      keySidebar: 44,
      main: () => <CreateStation />,
    });

    const EditStation = loadable(() => import("../../features/Station/Edit"), {
      fallback: <SpinPage />,
    });
    routesAuth.push({
      path: "/edit-station/:stationId",
      title: "Chỉnh sửa điểm đón",
      exact: true,
      keySidebar: 44,
      main: () => <EditStation />,
    });

    const Station = loadable(() => import("../../features/Station"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/station",
      title: intl.formatMessage({ id: "sidebar.item.station" }),
      exact: true,
      keySidebar: 44,
      main: () => <Station />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const CreateSchedule = loadable(
      () => import("../../features/Schedule/Create"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/create-schedule",
      title: "Thêm lịch trình",
      exact: true,
      keySidebar: 45,
      main: () => <CreateSchedule />,
    });

    const EditSchedule = loadable(
      () => import("../../features/Schedule/Edit"),
      {
        fallback: <SpinPage />,
      }
    );
    routesAuth.push({
      path: "/edit-schedule/:scheduleId",
      title: "Chỉnh sửa lịch trình",
      exact: true,
      keySidebar: 45,
      main: () => <EditSchedule />,
    });

    const Schedule = loadable(() => import("../../features/Schedule"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/schedule",
      title: intl.formatMessage({ id: "sidebar.item.schedule" }),
      exact: true,
      keySidebar: 45,
      main: () => <Schedule />,
    });
    // }
    // if(permissions.includes('read_users')) {
    const User = loadable(() => import("../../features/User"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/user",
      title: "Quản lý tài khoản",
      exact: true,
      keySidebar: 71,
      main: () => <User />,
    });

    /* Device */

    const Device = loadable(() => import("../../features/Device"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/device",
      title: intl.formatMessage({ id: "sidebar.item.device" }),
      exact: true,
      keySidebar: 77,
      main: () => <Device />,
    });

    const CreateDevice = loadable(
      () => import("../../features/Device/Create"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/create-device",
      title: intl.formatMessage({ id: "sidebar.item.device.create" }),
      exact: true,
      keySidebar: 77,
      main: () => <CreateDevice />,
    });

    const EditDevice = loadable(
      () => import("../../features/Device/Edit"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/device/:id",
      title: intl.formatMessage({ id: "sidebar.item.device.edit" }),
      exact: true,
      keySidebar: 77,
      main: () => <EditDevice />,
    });


    /* End Device */

    /**
     * Event
     */
    const Event = loadable(() => import("../../features/Event"), {
      fallback: <SpinPage />,
    });

    routesAuth.push({
      path: "/event",
      title: intl.formatMessage({ id: "sidebar.item.create-event" }),
      exact: true,
      keySidebar: 78,
      main: () => <Event />,
    });

    const CreateEvent = loadable(
      () => import("../../features/Event/Create"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/create-event",
      title: intl.formatMessage({ id: "sidebar.item.create-event.create" }),
      exact: true,
      keySidebar: 78,
      main: () => <CreateEvent />,
    });

    const EditEvent = loadable(
      () => import("../../features/Event/Edit"),
      {
        fallback: <SpinPage />,
      }
    );

    routesAuth.push({
      path: "/event/:id",
      title: intl.formatMessage({ id: "sidebar.item.create-event.edit" }),
      exact: true,
      keySidebar: 78,
      main: () => <EditEvent />,
    });
    /**
     * End Event
     */

    routesAuth.push({
      path: "/language/vi",
      title: "Tiếng Việt",
      exact: true,
      keySidebar: 72,
      main: () => {
        localStorage.setItem("language", "vi");
        window.location.href = "/school";
        return <div></div>;
      },
    });
    routesAuth.push({
      path: "/language/en",
      title: "English",
      exact: true,
      keySidebar: 73,
      main: () => {
        localStorage.setItem("language", "en");
        window.location.href = "/school";
        return <div></div>;
      },
    });
    // }

    /*const Profile = loadable(() => import("../../features/Profile"), {
            fallback: <SpinPage />
        });

        routesAuth.push({
            path: "/profile",
            title: "Thông tin tài khoản",
            exact: true,
            main: () => (
                <Profile />
            )
        });

        const Page404 = loadable(() => import("../../features/Page404"), {
            fallback: <SpinPage />
        });
        routesAuth.push({
            path: "",
            title: "Trang không tìm thấy",
            exact: false,
            main: () => (
                <Page404 />
            )
        });*/

    routesAuth.push({
      path: "/",
      title: "",
      exact: true,
      main: () => <Redirect to="/school" />,
    });

    routesAuth.push({
      path: "/login",
      title: "",
      exact: true,
      main: () => <Redirect to="/school" />,
    });

    return routesAuth;
  };

  const handleDataSidebar = (dataUserMe) => {
    // let permissions = dataUserMe.me.role ? dataUserMe.me.role.permissions.map(item => item.name) : [];
    let dataSidebar = [];
    let arrRouterChild = [];
    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 21,
      keyOfParent: 2,
      title: intl.formatMessage({ id: "sidebar.item.campus" }),
      icon: <IconSchool />,
      path: "/school",
    });

    arrRouterChild.push({
      key: 22,
      keyOfParent: 2,
      title: intl.formatMessage({ id: "sidebar.item.class" }),
      icon: <IconClass />,
      path: "/class",
    });

    arrRouterChild.push({
      key: 23,
      keyOfParent: 2,
      title: intl.formatMessage({ id: "sidebar.item.teacher" }),
      icon: <IconTeacher />,
      path: "/teacher",
    });

    arrRouterChild.push({
      key: 24,
      keyOfParent: 2,
      title: intl.formatMessage({ id: "sidebar.item.subject" }),
      icon: <IconSubject />,
      path: "/subject",
    });

    arrRouterChild.push({
      key: 25,
      keyOfParent: 2,
      title: intl.formatMessage({ id: "sidebar.item.notification" }),
      icon: <IconNotification />,
      path: "/notification",
    });
    // }
    if (arrRouterChild.length) {
      dataSidebar.push({
        key: 2,
        title: intl.formatMessage({ id: "sidebar.header.school-manager" }),
        routes: arrRouterChild,
      });
    }
    // ------------------------------------
    arrRouterChild = [];

    // if(permissions.includes('create_custom_report')) {
    arrRouterChild.push({
      key: 26,
      keyOfParent: 3,
      title: intl.formatMessage({ id: "sidebar.item.rollCallDaily" }),
      icon: <IconRollCallDaily />,
      path: "/roll-call-daily",
    });
    arrRouterChild.push({
      key: 31,
      keyOfParent: 3,
      title: intl.formatMessage({ id: "sidebar.item.student" }),
      icon: <IconStudent />,
      path: "/student",
    });
    arrRouterChild.push({
      key: 27,
      keyOfParent: 3,
      title: intl.formatMessage({
        id: "sidebar.item.attendanceStatistics",
      }),
      icon: <IconAttendanceStatistic />,
      path: "/attendance-statistics",
    });
    // }
    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 32,
      keyOfParent: 3,
      title: intl.formatMessage({ id: "sidebar.item.parents" }),
      icon: <IconParents />,
      path: "/parentages",
    });
    // }
    if (arrRouterChild.length) {
      dataSidebar.push({
        key: 3,
        title: intl.formatMessage({ id: "sidebar.header.student-manager" }),
        routes: arrRouterChild,
      });
    }
    // ------------------------------------
    arrRouterChild = [];
    arrRouterChild.push({
      key: 40,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.statistic" }),
      icon: <IconStatistic />,
      path: "/statistic",
    });

    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 41,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.driver" }),
      icon: <IconDriver />,
      path: "/driver",
    });
    // }
    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 42,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.nanny" }),
      icon: <IconNanny />,
      path: "/nanny",
    });
    // }
    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 43,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.vehicle" }),
      icon: <IconVehicle />,
      path: "/vehicle",
    });
    // }
    // if(permissions.includes('read_shops_report')) {
    arrRouterChild.push({
      key: 44,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.station" }),
      icon: <IconSchedule />,
      path: "/station",
    });
    arrRouterChild.push({
      key: 45,
      keyOfParent: 4,
      title: intl.formatMessage({ id: "sidebar.item.schedule" }),
      icon: <IconSchedule />,
      path: "/schedule",
    });
    // }
    if (arrRouterChild.length) {
      dataSidebar.push({
        key: 4,
        title: intl.formatMessage({ id: "sidebar.header.shuttle-manager" }),
        routes: arrRouterChild,
      });
    }
    // ------------------------------------
    arrRouterChild = [];

    // if(permissions.includes('read_users')) {
    arrRouterChild.push({
      key: 71,
      keyOfParent: 7,
      title: intl.formatMessage({ id: "sidebar.item.account" }),
      icon: <IconSchool />,
      path: "/user",
    });

    arrRouterChild.push({
      key: 77,
      keyOfParent: 7,
      title:  intl.formatMessage({ id: "sidebar.item.device" }),
      icon: <IconDevice />,
      path: "/device",
    });

    arrRouterChild.push({
      key: 78,
      keyOfParent: 7,
      title:  intl.formatMessage({ id: "sidebar.item.create-event" }),
      icon: <IconCreateEvent />,
      path: "/event",
    });

    // }
    if (arrRouterChild.length) {
      dataSidebar.push({
        key: 7,
        title: "ADMIN",
        routes: arrRouterChild,
      });
    }

    return dataSidebar;
  };

  return (
    routesAuth && (
      <StoreProvider>
        <LayoutAnt id="components-layout-custom-trigger">
          <FacilityProvider>
            <Sidebar dataSidebar={dataSidebar} />
            <LayoutAnt className="site-layout">
              <div style={{ minHeight: "100%" }}>
                <Content
                  className="site-layout"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100%",
                  }}
                >
                  <Switch>
                    {routesAuth.map((route, index) => (
                      <Route key={index} path={route.path} exact={route.exact}>
                        <WrapperPage route={route}>
                          {route.title && (
                            <Helmet defer={false}>
                              <title>
                                {route.title + (route.title != "" ? " - " : "")}
                                Finki
                              </title>
                            </Helmet>
                          )}
                          <route.main />
                        </WrapperPage>
                      </Route>
                    ))}
                  </Switch>
                </Content>
              </div>
            </LayoutAnt>
          </FacilityProvider>
        </LayoutAnt>
      </StoreProvider>
    )
  );
};

export default LayoutAuth;
