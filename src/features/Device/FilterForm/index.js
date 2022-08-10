import React, { useCallback, useState } from 'react';
import { useIntl} from "react-intl";
import { Row, Col, Menu  } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

import Form from "../../../components/Common/Form";
import Panel from "../../../components/Common/Panel";
import FacilitiesSelect from '../../../components/Common/FacilitiesSelect';
import Input from '../../../components/Common/Input';
import Button from '../../../components/Common/Button';


import { ReactComponent as DownloadIcon } from "../images/icon-export-24px.svg";

import {
    CSS_PREFIX,
    CAMERA_TYPES,
} from '../constants';

import './style.scss';

const { SearchFilter } = Input;

const FilterForm = ({ loading, onSearch, onDownload, downloadLoading }) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const intl = useIntl();
    const [filterType, setFilterType] = useState("ALL");
    const [searchValue, setSearchValue] = useState("");

    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.view.search.${suffix}`,
        });
    }, [intl]);

    const handleMenuClick = useCallback(({ key }) => {
        setFilterType(key);
    }, []);

    const menu = useCallback(() => (
        <Menu
            selectedKeys={[filterType]}
            onClick={handleMenuClick}
            style={{ width: 180 }}
        >
            <Menu.Item key="ALL">{getText('device.filter.all')}</Menu.Item>
            <Menu.Item key={CAMERA_TYPES.IN_VEHICLE}>{getText('device.filter.onCar')}</Menu.Item>
            <Menu.Item key={CAMERA_TYPES.IN_CLASSROOM}>{getText('device.filter.onClass')}</Menu.Item>
            <Menu.Item key={CAMERA_TYPES.IN_CAMPUS}>{getText('device.filter.onCampus')}</Menu.Item>
        </Menu>
    ), [getText, handleMenuClick, filterType]);

    const handleOnSearch = useCallback(() => {
        const values = form.getFieldsValue();
        onSearch({
            ...values,
            device: searchValue,
            type: filterType,
        });
    }, [onSearch, form, filterType, searchValue]);

    const handleOnFieldsChange = useCallback(() => {
        handleOnSearch()
    }, [handleOnSearch]);

    const handleSearchInputChange = useCallback((e) => {
        setSearchValue(e.target.value);
    }, []);

    const handleAddClick = useCallback(() => {
        if (form.getFieldValue('campusId')) {
            history.push(`/create-device?campusId=${form.getFieldValue('campusId')}`);
        } else {
            history.push(`/create-device`);
        }
    }, [history, form]);

    const handleOnDownload = useCallback(() => {
        const values = form.getFieldsValue();
        onDownload({
            ...values,
            device: searchValue,
            type: filterType,
        });
    }, [onDownload, form, filterType, searchValue])

    return (
        <div className={`${CSS_PREFIX}__filter-form`}>
            <Panel className="filter-form__panel" loading={loading}>
                <Form
                    colon={false}
                    form={form}
                    onFieldsChange={handleOnFieldsChange}
                >
                    <Row gutter={24}>
                        <Col>
                            <Form.Item
                                labelAlign="left"
                                label={getText('campus')}
                                name="campusId"
                            >
                                <FacilitiesSelect
                                    defaultMainCampus
                                    dropdownMatchSelectWidth={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col flex="auto">
                            <Row justify="end">
                                <Col flex="320px">
                                    <Form.Item
                                        onChange={handleSearchInputChange}
                                    >
                                        <SearchFilter
                                            overlay={menu}
                                            input={{
                                                placeholder: getText('device.placeholder'),
                                                enterButton: getText('device.button'),
                                                // allowClear: true,
                                                onSearch: handleOnSearch,
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col style={{ marginLeft: 5 }}>
                                    <Button
                                        suffix={<Icon component={DownloadIcon} style={{ fontSize: 16, color: 'transparent' }} />}
                                        onClick={handleOnDownload}
                                        loading={downloadLoading}
                                    >
                                        {getText('download')}
                                    </Button>
                                </Col>
                                <Col style={{ marginLeft: 5 }}>
                                    <Button
                                        type="primary"
                                        onClick={handleAddClick}
                                        icon={<PlusOutlined />}
                                    >
                                        {getText('addDevice')}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Panel>
        </div>
    );
}

export default FilterForm;
