import React, { useCallback, useState } from 'react';
import { useIntl} from "react-intl";
import { Row, Col, Menu  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

import Form from "../../../components/Common/Form";
import Panel from "../../../components/Common/Panel";
import FacilitiesSelect from '../../../components/Common/FacilitiesSelect';
import Input from '../../../components/Common/Input';
import Button from '../../../components/Common/Button';

import StatusDropdown from './StatusDropdown';

import {
    CSS_PREFIX,
    EVENT_FILTER_TYPE,
} from '../constants';

import './style.scss';

const { SearchFilter } = Input;

const FilterForm = ({ loading, onSearch }) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const intl = useIntl();
    const [filterType, setFilterType] = useState("ALL");
    const [searchValue, setSearchValue] = useState("");

    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `event.view.search.${suffix}`,
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
            <Menu.Item key="ALL">{getText('event.filter.all')}</Menu.Item>
            <Menu.Item key={EVENT_FILTER_TYPE.CODE}>{getText('event.filter.code')}</Menu.Item>
            <Menu.Item key={EVENT_FILTER_TYPE.TITLE}>{getText('event.filter.title')}</Menu.Item>
            <Menu.Item key={EVENT_FILTER_TYPE.AUTHOR}>{getText('event.filter.createdBy')}</Menu.Item>
        </Menu>
    ), [getText, handleMenuClick, filterType]);

    const handleOnSearch = useCallback(() => {
        const values = form.getFieldsValue();
        onSearch({
            ...values,
            event: searchValue,
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
        history.push(`/create-event`);
    }, [history]);

    return (
        <div className={`${CSS_PREFIX}__filter-form`}>
            <Panel className="filter-form__panel" loading={loading}>
                <Form
                    colon={false}
                    form={form}
                    initialValues={{
                        status: ''
                    }}
                    onFieldsChange={handleOnFieldsChange}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                labelAlign="left"
                                label={getText('campus')}
                                name="campusId"
                                className="first-col"
                            >
                                <FacilitiesSelect
                                    allLabel={false}
                                    style={{ width: 180 }}
                                    defaultMainCampus
                                    dropdownMatchSelectWidth={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ marginTop: 16 }}>
                        <Col span={8}>
                            <Form.Item
                                labelAlign="left"
                                label={getText('status')}
                                name="status"
                                className="first-col"
                            >
                                <StatusDropdown style={{ width: 180 }}/>
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
                                                placeholder: getText('event.placeholder'),
                                                enterButton: getText('event.button'),
                                                onSearch: handleOnSearch,
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col style={{ marginLeft: 5 }}>
                                    <Button
                                        type="primary"
                                        onClick={handleAddClick}
                                        icon={<PlusOutlined />}
                                    >
                                        {getText('addEvent')}
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
