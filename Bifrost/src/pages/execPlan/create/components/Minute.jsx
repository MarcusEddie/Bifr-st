
import { ProFormSelect, StepsForm, ProFormTextArea, ModalForm, ProFormDateTimePicker } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Tabs, DatePicker, Typography, Col, Row, Radio, Checkbox, Descriptions, Space } from 'antd';
import { useIntl } from 'umi';

const { Text, Link } = Typography;
const { TabPane } = Tabs;

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const Minute = (props) => {
  const intl = useIntl();

  const plainOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  const plainOptionsN1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58'];

  const plainOptionsN2 = ['2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  const plainOptionsN3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  const plainOptionsN4 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const [secondCheckBoxEnable, setSecondCheckBoxEnable] = React.useState(true);
  const [secondVal, setSecondVal] = React.useState(1);
  const [s1, setS1] = React.useState(plainOptionsN1);
  const [s1Val, setS1Val] = React.useState(1);
  const [s2, setS2] = React.useState(plainOptionsN2);
  const [s2Val, setS2Val] = React.useState(2);
  const [s3, setS3] = React.useState(plainOptionsN3);
  const [s3Val, setS3Val] = React.useState(0);
  const [s4, setS4] = React.useState(plainOptionsN4);
  const [s4Val, setS4Val] = React.useState(1);

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
    if (parseInt(e.target.value, 10) === 4) {
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
          <Row >
            <Radio defaultChecked={true} value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.minutes.min', })}</Radio>
          </Row>
          <Row>
            <Col span={8}>
              <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={6}>
              <Select id="s1" name="s1" style={{ width: 70 }} value={s1Val} onChange={handleS1Change}>
                {s1 && s1.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select id="s2" name="s2" style={{ width: 70 }} value={s2Val} onChange={handleS1Change}>
                {s2 && s2.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={11}>
              <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.minute.period.min.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={6}>

              <Select id="s3" name="s3" style={{ width: 70 }} value={s3Val} onChange={handleS1Change}>
                {s3 && s3.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>

              <Select id="s4" name="s4" style={{ width: 70 }} value={s4Val} onChange={handleS1Change}>
                {s4 && s4.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.second.deconds', })}</Radio>
            {/* <Checkbox disabled={secondCheckBoxEnable} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox> */}
          </Row>
          <Row>
            <CheckboxGroup disabled={secondCheckBoxEnable} value={checkedList} onChange={onChange} >
              <Row>
                <Col> <Checkbox value="0">00</Checkbox> </Col>
                <Col> <Checkbox value="1">01</Checkbox> </Col>
                <Col> <Checkbox value="2">02</Checkbox> </Col>
                <Col> <Checkbox value="3">03</Checkbox> </Col>
                <Col> <Checkbox value="4">04</Checkbox> </Col>
                <Col> <Checkbox value="5">05</Checkbox> </Col>
                <Col> <Checkbox value="6">06</Checkbox> </Col>
                <Col> <Checkbox value="7">07</Checkbox> </Col>
                <Col> <Checkbox value="8">08</Checkbox> </Col>
                <Col> <Checkbox value="9">09</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="10">10</Checkbox> </Col>
                <Col> <Checkbox value="11">11</Checkbox> </Col>
                <Col> <Checkbox value="12">12</Checkbox> </Col>
                <Col> <Checkbox value="13">13</Checkbox> </Col>
                <Col> <Checkbox value="14">14</Checkbox> </Col>
                <Col> <Checkbox value="15">15</Checkbox> </Col>
                <Col> <Checkbox value="16">16</Checkbox> </Col>
                <Col> <Checkbox value="17">17</Checkbox> </Col>
                <Col> <Checkbox value="18">18</Checkbox> </Col>
                <Col> <Checkbox value="19">19</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="20">20</Checkbox> </Col>
                <Col> <Checkbox value="21">21</Checkbox> </Col>
                <Col> <Checkbox value="22">22</Checkbox> </Col>
                <Col> <Checkbox value="23">23</Checkbox> </Col>
                <Col> <Checkbox value="24">24</Checkbox> </Col>
                <Col> <Checkbox value="25">25</Checkbox> </Col>
                <Col> <Checkbox value="26">26</Checkbox> </Col>
                <Col> <Checkbox value="27">27</Checkbox> </Col>
                <Col> <Checkbox value="28">28</Checkbox> </Col>
                <Col> <Checkbox value="29">29</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="30">30</Checkbox> </Col>
                <Col> <Checkbox value="31">31</Checkbox> </Col>
                <Col> <Checkbox value="32">32</Checkbox> </Col>
                <Col> <Checkbox value="33">33</Checkbox> </Col>
                <Col> <Checkbox value="34">34</Checkbox> </Col>
                <Col> <Checkbox value="35">35</Checkbox> </Col>
                <Col> <Checkbox value="36">36</Checkbox> </Col>
                <Col> <Checkbox value="37">37</Checkbox> </Col>
                <Col> <Checkbox value="38">38</Checkbox> </Col>
                <Col> <Checkbox value="39">39</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="40">40</Checkbox> </Col>
                <Col> <Checkbox value="41">41</Checkbox> </Col>
                <Col> <Checkbox value="42">42</Checkbox> </Col>
                <Col> <Checkbox value="43">43</Checkbox> </Col>
                <Col> <Checkbox value="44">44</Checkbox> </Col>
                <Col> <Checkbox value="45">45</Checkbox> </Col>
                <Col> <Checkbox value="46">46</Checkbox> </Col>
                <Col> <Checkbox value="47">47</Checkbox> </Col>
                <Col> <Checkbox value="48">48</Checkbox> </Col>
                <Col> <Checkbox value="49">49</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="50">50</Checkbox> </Col>
                <Col> <Checkbox value="51">51</Checkbox> </Col>
                <Col> <Checkbox value="52">52</Checkbox> </Col>
                <Col> <Checkbox value="53">53</Checkbox> </Col>
                <Col> <Checkbox value="54">54</Checkbox> </Col>
                <Col> <Checkbox value="55">55</Checkbox> </Col>
                <Col> <Checkbox value="56">56</Checkbox> </Col>
                <Col> <Checkbox value="57">57</Checkbox> </Col>
                <Col> <Checkbox value="58">58</Checkbox> </Col>
                <Col> <Checkbox value="59">59</Checkbox> </Col>
              </Row>
            </CheckboxGroup>,
          </Row>
        </Space>
      </Radio.Group>
    </>
  );
};

export default Minute;
