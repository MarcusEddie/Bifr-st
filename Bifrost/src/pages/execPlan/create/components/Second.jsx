
import { ProFormSelect, StepsForm, ProFormTextArea, ModalForm, ProFormDateTimePicker } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Tabs, DatePicker, Typography, Col, Row, Radio, Checkbox, Descriptions, Space } from 'antd';
import { useIntl } from 'umi';


const { TabPane } = Tabs;

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const Second = (props) => {
  const intl = useIntl();

  const plainOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plainOptionsMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  return (
    <>
      <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.second', })} key="second">
        <Radio.Group >
          <Space direction="vertical">
            <Row >
              <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.seconds', })}</Radio>
            </Row>
            <Row >
              <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.one', })}</Radio> </Col> ssssscond
            </Row>
            <Row >
              <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.min.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
            </Row>
            <Row >
              <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.second.deconds', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptionsMonth} value={checkedList} onChange={onChange} />
            </Row>
          </Space>
        </Radio.Group>
      </TabPane>
    </>
  );
};

export default Second;
