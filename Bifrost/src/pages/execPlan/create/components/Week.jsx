
import { ProFormSelect, StepsForm, ProFormTextArea, ModalForm, ProFormDateTimePicker } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Col, Row, Radio, Checkbox, Space } from 'antd';
import { useIntl } from 'umi';

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const Week = (props) => {
  const intl = useIntl();

  const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  const s1 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  const s2 = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  const s3 = ['1', '2', '3', '4'];


  const s4 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const s5 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const [secondCheckBoxEnable, setSecondCheckBoxEnable] = React.useState(true);
  const [secondVal, setSecondVal] = React.useState(1);
  const [s1Val, setS1Val] = React.useState('Mon');
  const [s2Val, setS2Val] = React.useState('Tue');
  const [s3Val, setS3Val] = React.useState('1');
  const [s4Val, setS4Val] = React.useState('Mon');
  const [s5Val, setS5Val] = React.useState('Mon');

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

  const secondRadionChange = async (e) => {
    setSecondVal(e.target.value);
    if (parseInt(e.target.value, 10) === 6) {
      setSecondCheckBoxEnable(false);
    } else {
      setSecondCheckBoxEnable(true);
    }
  }
  const handleS1Change = async (e) => {

    setS1Val(e)
  }
  return (
    <>
      <Radio.Group value={secondVal} onChange={secondRadionChange}>
        <Space direction="vertical">
          <Row style={{ width: 650 }}>
            <Radio defaultChecked={true} value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.week', })}</Radio>
          </Row>
          <Row >
            <Radio defaultChecked={true} value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.non.required', })}</Radio>
          </Row>
          <Row>
            <Col span={7}>
              <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.period.days', })}&nbsp;
              </Radio>
            </Col>
            <Col span={5}>
              <Select id="s1" name="s1" style={{ width: 70 }} value={s1Val} onChange={handleS1Change}>
                {s1 && s1.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={5}>
              <Select id="s2" name="s2" style={{ width: 70 }} value={s2Val} onChange={handleS1Change}>
                {s2 && s2.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={8}>
              <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.num.to.day.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={5}>

              <Select id="s3" name="s3" style={{ width: 70 }} value={s3Val} onChange={handleS1Change}>
                {s3 && s3.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={5}>

              <Select id="s4" name="s4" style={{ width: 70 }} value={s4Val} onChange={handleS1Change}>
                {s4 && s4.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={6}>
              <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.week.last', })}
              </Radio>
            </Col>
            <Col span={6}>
              <Select id="s5" name="s5" style={{ width: 70 }} value={s5Val} onChange={handleS1Change}>
                {s5 && s5.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={3}>
              <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.second.deconds', })}</Radio>
            </Col>
            {/* <Col span={3}>
              <Checkbox disabled={secondCheckBoxEnable} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox>
            </Col> */}
          </Row>
          <Row >
            <Col span={20}>
              <CheckboxGroup disabled={secondCheckBoxEnable} value={checkedList} onChange={onChange} options={plainOptions} >
              </CheckboxGroup>
            </Col>
          </Row>
          <Row>
          </Row>
        </Space>
      </Radio.Group>
    </>
  );
};

export default Week;
