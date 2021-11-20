
import React from 'react';
import { Select, Col, Row, Radio, Checkbox, Space } from 'antd';
import { useIntl } from 'umi';

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const Day = (props) => {
  const { cronArr } = props;

  const intl = useIntl();
  const s1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const s2 = ['2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const s3 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const s4 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const s5 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const [checkedList, setCheckedList] = React.useState(['1']);
  const [checkBoxEnable, setCheckBoxEnable] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState(1);
  const [s1Val, setS1Val] = React.useState(1);
  const [s2Val, setS2Val] = React.useState(2);
  const [s3Val, setS3Val] = React.useState(1);
  const [s4Val, setS4Val] = React.useState(1);
  const [s5Val, setS5Val] = React.useState(1);

  const handleS7Change = list => {
    setCheckedList(list);
    if (list.length === 0) {
      cronArr[3] = '?';
      props.sendWrongCron(cronArr);
    } else {
      cronArr[3] = list.join(",");
      props.sendCron(cronArr);
    }
  };

  const radionChange = async (e) => {
    setRadioVal(e.target.value);
    if (parseInt(e.target.value, 10) === 7) {
      if (checkedList.length === 0) {
        cronArr[3] = '?';
        props.sendWrongCron(cronArr);
      } else {
        cronArr[3] = checkedList.join(",");
        props.sendCron(cronArr);
      }

      setCheckBoxEnable(false);
    } else {
      setCheckBoxEnable(true);
    }

    if (parseInt(e.target.value, 10) === 1) {
      cronArr[3] = '*';
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 2) {
      cronArr[3] = '?';
      props.sendWrongCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 3) {
      cronArr[3] = s1Val.toString().concat("-", s2Val);
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 4) {
      cronArr[3] = s3Val.toString().concat("/", s4Val);
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 5) {
      cronArr[3] = s5Val.toString().concat('W');
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 6) {
      cronArr[3] = 'L';
      props.sendCron(cronArr);
    }
  }

  const handleS1Change = async (value) => {
    setS1Val(value);
    if (parseInt(radioVal, 10) === 3) {
      cronArr[3] = value.toString().concat("-", s2Val);
      props.sendCron(cronArr);
    }
  }

  const handleS2Change = async (value) => {
    setS2Val(value);
    if (parseInt(radioVal, 10) === 3) {
      cronArr[3] = s1Val.toString().concat("-", value);
      props.sendCron(cronArr);
    }
  }

  const handleS3Change = async (value) => {
    setS3Val(value)
    if (parseInt(radioVal, 10) === 4) {
      cronArr[3] = value.toString().concat("/", s4Val);
      props.sendCron(cronArr);
    }
  }

  const handleS4Change = async (value) => {
    setS4Val(value)
    if (parseInt(radioVal, 10) === 4) {
      cronArr[3] = s3Val.toString().concat("/", value);
      props.sendCron(cronArr);
    }
  }

  const handleS5Change = async (value) => {
    setS5Val(value)
    if (parseInt(radioVal, 10) === 5) {
      cronArr[3] = value.toString().concat("W");
      props.sendCron(cronArr);
    }
  }

  return (
    <>
      <Radio.Group value={radioVal} onChange={radionChange}>
        <Space direction="vertical">
          <Row >
            <Radio defaultChecked={true} value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.days', })}</Radio>
          </Row>
          <Row >
            <Radio defaultChecked={true} value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.no.required', })}</Radio>
          </Row>
          <Row>
            <Col span={6}>
              <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={4}>
              <Select id="s1" name="s1" style={{ width: 70 }} value={s1Val} onChange={handleS1Change}>
                {s1 && s1.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select id="s2" name="s2" style={{ width: 70 }} value={s2Val} onChange={handleS2Change}>
                {s2 && s2.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={9}>
              <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.days.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={4}>
              <Select id="s3" name="s3" style={{ width: 70 }} value={s3Val} onChange={handleS3Change}>
                {s3 && s3.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select id="s4" name="s4" style={{ width: 70 }} value={s4Val} onChange={handleS4Change}>
                {s4 && s4.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={10}>
              <Radio value={5}>{intl.formatMessage({ id: 'pages.execPlan.cron.day.period.workday.one', })}&nbsp;
              </Radio>
            </Col>
            <Col span={4}>
              <Select id="s5" name="s5" style={{ width: 70 }} value={s5Val} onChange={handleS5Change}>
                {s5 && s5.map((app) => (
                  <Option key={app} label={app}>{app}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={9}>
              <Radio value={6}>{intl.formatMessage({ id: 'pages.execPlan.cron.month.last', })}&nbsp;
              </Radio>
            </Col>
          </Row>
          <Row >
            <Radio value={7}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.second.deconds', })}</Radio>
            {/* <Checkbox disabled={secondCheckBoxEnable} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>ALL</Checkbox> */}
          </Row>
          <Row>
            <CheckboxGroup disabled={checkBoxEnable} value={checkedList} onChange={handleS7Change} >
              <Row>
                <Col> <Checkbox value="1">01</Checkbox> </Col>
                <Col> <Checkbox value="2">02</Checkbox> </Col>
                <Col> <Checkbox value="3">03</Checkbox> </Col>
                <Col> <Checkbox value="4">04</Checkbox> </Col>
                <Col> <Checkbox value="5">05</Checkbox> </Col>
                <Col> <Checkbox value="6">06</Checkbox> </Col>
                <Col> <Checkbox value="7">07</Checkbox> </Col>
                <Col> <Checkbox value="8">08</Checkbox> </Col>
                <Col> <Checkbox value="9">09</Checkbox> </Col>
                <Col> <Checkbox value="10">10</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="11">11</Checkbox> </Col>
                <Col> <Checkbox value="12">12</Checkbox> </Col>
                <Col> <Checkbox value="13">13</Checkbox> </Col>
                <Col> <Checkbox value="14">14</Checkbox> </Col>
                <Col> <Checkbox value="15">15</Checkbox> </Col>
                <Col> <Checkbox value="16">16</Checkbox> </Col>
                <Col> <Checkbox value="17">17</Checkbox> </Col>
                <Col> <Checkbox value="18">18</Checkbox> </Col>
                <Col> <Checkbox value="19">19</Checkbox> </Col>
                <Col> <Checkbox value="20">20</Checkbox> </Col>
              </Row>
              <Row>
                <Col> <Checkbox value="21">21</Checkbox> </Col>
                <Col> <Checkbox value="22">22</Checkbox> </Col>
                <Col> <Checkbox value="23">23</Checkbox> </Col>
                <Col> <Checkbox value="24">24</Checkbox> </Col>
                <Col> <Checkbox value="25">25</Checkbox> </Col>
                <Col> <Checkbox value="26">26</Checkbox> </Col>
                <Col> <Checkbox value="27">27</Checkbox> </Col>
                <Col> <Checkbox value="28">28</Checkbox> </Col>
                <Col> <Checkbox value="29">29</Checkbox> </Col>
                <Col> <Checkbox value="30">30</Checkbox> </Col>
                <Col> <Checkbox value="31">31</Checkbox> </Col>
              </Row>
            </CheckboxGroup>,
          </Row>
        </Space>
      </Radio.Group>
    </>
  );
};

export default Day;
