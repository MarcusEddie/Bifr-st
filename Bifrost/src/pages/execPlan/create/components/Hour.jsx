
import React from 'react';
import { Select, Col, Row, Radio, Checkbox, Space } from 'antd';
import { useIntl } from 'umi';

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const Hour = (props) => {

  const { cronArr } = props;
  const intl = useIntl();

  const s1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23'];

  const s2 = ['2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23'];

  const s3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23',];

  const s4 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23'];

  const [checkedList, setCheckedList] = React.useState(['0']);
  const [checkBoxEnable, setCheckBoxEnable] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState(1);
  const [s1Val, setS1Val] = React.useState(0);
  const [s2Val, setS2Val] = React.useState(2);
  const [s3Val, setS3Val] = React.useState(0);
  const [s4Val, setS4Val] = React.useState(1);

  const handleS5Change = list => {
    setCheckedList(list);
    cronArr[0] = '0';
    cronArr[1] = '0';
    if (list.length === 0) {
      cronArr[2] = '?';
      props.sendWrongCron(cronArr);
    } else {
      cronArr[2] = list.join(",");
      props.sendCron(cronArr);
    }
  };

  const radioChange = async (e) => {
    setRadioVal(e.target.value);
    if (parseInt(e.target.value, 10) === 4) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      if (checkedList.length === 0) {
        cronArr[2] = '?';
        props.sendWrongCron(cronArr);
      } else {
        cronArr[2] = checkedList.join(",");
        props.sendCron(cronArr);
      }
      setCheckBoxEnable(false);
    } else {
      setCheckBoxEnable(true);
    }

    if (parseInt(e.target.value, 10) === 2) {
      // let cron = "0 0 ";
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = s1Val.toString().concat("-", s2Val);
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 3) {
      // let cron = "0 0 ";
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = s3Val.toString().concat("/", s4Val);
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 1) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = '*';
      props.sendCron(cronArr);
    }
  }

  const handleS1Change = async (value) => {
    setS1Val(value);
    if (parseInt(radioVal, 10) === 2) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = value.toString().concat("-", s2Val);
      props.sendCron(cronArr);
    }
  }

  const handleS2Change = async (value) => {
    setS2Val(value);
    if (parseInt(radioVal, 10) === 2) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = s1Val.toString().concat("-", value);
      props.sendCron(cronArr);
    }
  }

  const handleS3Change = async (value) => {
    setS3Val(value)
    if (parseInt(radioVal, 10) === 3) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = value.toString().concat("/", s4Val);
      props.sendCron(cronArr);
    }
  }

  const handleS4Change = async (value) => {
    setS4Val(value)
    if (parseInt(radioVal, 10) === 3) {
      cronArr[0] = '0';
      cronArr[1] = '0';
      cronArr[2] = s3Val.toString().concat("/", value);
      props.sendCron(cronArr);
    }
  }

  return (
    <>
      <Radio.Group value={radioVal} onChange={radioChange}>
        <Space direction="vertical">
          <Row >
            <Radio defaultChecked={true} value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.hours', })}</Radio>
          </Row>
          <Row>
            <Col span={6}>
              <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.period.one', })}&nbsp;
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
              <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.hour.period.hours.one', })}&nbsp;
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
            <Radio value={4}>{intl.formatMessage({ id: 'pages.execPlan.cron.second.period.second.deconds', })}</Radio>
          </Row>
          <Row>
            <CheckboxGroup disabled={checkBoxEnable} value={checkedList} onChange={handleS5Change} >
              <Row><Col> AM &nbsp;&nbsp;</Col>
                <Col> <Checkbox value="0" checked={true}>00</Checkbox> </Col>
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
                <Col> <Checkbox value="11">11</Checkbox> </Col>
              </Row>
              <Row><Col> PM &nbsp;&nbsp;</Col>
                <Col> <Checkbox value="12">12</Checkbox> </Col>
                <Col> <Checkbox value="13">13</Checkbox> </Col>
                <Col> <Checkbox value="14">14</Checkbox> </Col>
                <Col> <Checkbox value="15">15</Checkbox> </Col>
                <Col> <Checkbox value="16">16</Checkbox> </Col>
                <Col> <Checkbox value="17">17</Checkbox> </Col>
                <Col> <Checkbox value="18">18</Checkbox> </Col>
                <Col> <Checkbox value="19">19</Checkbox> </Col>
                <Col> <Checkbox value="20">20</Checkbox> </Col>
                <Col> <Checkbox value="21">21</Checkbox> </Col>
                <Col> <Checkbox value="22">22</Checkbox> </Col>
                <Col> <Checkbox value="23">23</Checkbox> </Col>
              </Row>
            </CheckboxGroup>,
          </Row>
        </Space>
      </Radio.Group>
    </>
  );
};

export default Hour;
