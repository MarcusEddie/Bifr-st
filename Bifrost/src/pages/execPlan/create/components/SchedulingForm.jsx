
import { ProFormSelect, StepsForm, ProFormTextArea, ModalForm, ProFormDateTimePicker } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Tabs, DatePicker, Typography, Col, Row, Radio, Checkbox, Descriptions, Space } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import GeneralCaseInfo from './GeneralCaseInfo';
import Second from './Second';

const CheckboxGroup = Checkbox.Group;

const { RangePicker } = DatePicker;

const { TabPane } = Tabs;

const { Option } = Select;
const { Paragraph } = Typography;
// function callback(key) {
//   console.log(key);
// }

const SchedulingForm = (props) => {
  const intl = useIntl();

  const plainOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plainOptionsMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const [component, setComponent] = React.useState(undefined);

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

  const callback = async(key) => {
    console.log(key);
    if(key === "second") {
      setComponent(<Second></Second>);
    }
  };

  <Descriptions bordered={false}>
        <Descriptions.Item> sdfsfsf</Descriptions.Item>
      </Descriptions>


  const com1 = <><Col span={32}><Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option></Select> </Col>
  <Col span>afafafaf</Col>{'sfsfsf'}</>
  return (
    <>
      <Tabs defaultActiveKey="second" onChange={callback}>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.second', })} key="second">
        <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.seconds', })}</Radio>
              </Row>
              <Row gutter={32}>
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.one', })}</Radio> </Col> {com1}<Col span={32}>fasafafafas</Col>
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
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.minute', })} key="minute">
        <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.minutes.min', })}</Radio>
              </Row>
              <Row >
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.one', })}</Radio> </Col> {com1}
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.min.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.min.mins', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptionsMonth} value={checkedList} onChange={onChange} />
              </Row>
            </Space>
          </Radio.Group>

        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.hour', })} key="hour">
        <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.hours', })}</Radio>
              </Row>
              <Row >
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.period.one', })}</Radio> </Col> {com1}
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.period.hours.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.period.hours', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptionsMonth} value={checkedList} onChange={onChange} />
              </Row>
            </Space>
          </Radio.Group>

        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.day', })} key="day">
        <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.days', })}</Radio>
              </Row>
              <Row >
                <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.no.required', })}</Radio>
              </Row>
              <Row >
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.one', })}</Radio> </Col> {com1}
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.days.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.workday.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.last.day', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.last.days', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptionsMonth} value={checkedList} onChange={onChange} />
              </Row>
            </Space>
          </Radio.Group>

        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.month', })} key="month">

        <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.months', })}</Radio>
              </Row>
              <Row >
                <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.no.required', })}</Radio>
              </Row>
              <Row >
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.period.month.one', })}</Radio> </Col> {com1}
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.period.days.one', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.period.days', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptionsMonth} value={checkedList} onChange={onChange} />
              </Row>
            </Space>
          </Radio.Group>
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.week', })} key="week">
          <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.week', })}</Radio>
              </Row>
              <Row >
                <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.non.required', })}</Radio>
              </Row>
              <Row >
                <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.period.days', })}</Radio>
                <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select> &nbsp; <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Col >
                <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.num.to.day.one', })}</Radio> </Col> {com1}
              </Row>
              <Row >
                <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.last', })}</Radio> <Select defaultValue="1" style={{ width: 120 }} onChange={onCheckAllChange}><Option value="1">一</Option><Option value="2">二</Option><Option value="3">三</Option><Option value="4">四</Option><Option value="5">五</Option><Option value="7">七</Option></Select>
              </Row>
              <Row >
                <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.point', })}</Radio><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox><CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
                
              </Row>
            </Space>
          </Radio.Group>
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.year', })} key="year">
          <Radio.Group >
            <Space direction="vertical">
              <Row >
                <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.not.required', })}</Radio>
              </Row><Row >
                <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.every.year', })}</Radio>
              </Row><Row >
                <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.period', })}</Radio><RangePicker picker="year" />
              </Row>
            </Space>
          </Radio.Group>
        </TabPane>
      </Tabs>
    </>
  );
};


// pages.execPlan.cron.week.week':'周 允许的通配符[, - * / L #]  ',
//   'pages.execPlan.cron.week.non.required':'不指定',
//   'pages.execPlan.cron.week.period.days':'周期 从星期',
//   'pages.execPlan.cron.week.num.to.day.one':'第',
//   'pages.execPlan.cron.week.num.to.day.two':'周 的星期',
//   'pages.execPlan.cron.week.last':'本月最后一个星期',
//   'pages.execPlan.cron.week.point':'指定',


export default SchedulingForm;
