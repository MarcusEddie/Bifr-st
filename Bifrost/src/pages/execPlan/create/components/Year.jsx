
import React from 'react';
import { DatePicker, Row, Radio, Space } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Year = (props) => {
  const intl = useIntl();
  const { cronArr } = props;

  const [radioVal, setRadioVal] = React.useState(1);
  const [timePickerEnabled, setTimePickerEnabled] = React.useState(true);
  const [yearStart, setYearStart] = React.useState(2021);
  const [yearEnd, setYearEnd] = React.useState(2024);

  const handleYearChange = async(values, dateString) => {
    setYearStart(dateString[0]);
    setYearEnd(dateString[1]);
    cronArr[6] = dateString[0].toString().concat("-", dateString[1].toString());
    props.sendCron(cronArr);
  }

  const secondRadionChange = async (e) => {
    setRadioVal(e.target.value);
    if (parseInt(e.target.value, 10) === 3) {
      setTimePickerEnabled(false);
    } else {
      setTimePickerEnabled(true);
    }

    if (parseInt(e.target.value, 10) === 1) {
      cronArr[6] = '';
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 2) {
      cronArr[6] = '*';
      props.sendCron(cronArr);
    } else if (parseInt(e.target.value, 10) === 3) {
      cronArr[6] = yearStart.toString().concat("-", yearEnd.toString());
      props.sendCron(cronArr);
    }
  }

  return (
    <>
      <Radio.Group value={radioVal} onChange={secondRadionChange}>
        <Space direction="vertical">
          <Row >
            <Radio value={1}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.not.required', })}</Radio>
          </Row><Row >
            <Radio value={2}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.every.year', })}</Radio>
          </Row><Row >
            <Radio value={3}>{intl.formatMessage({ id: 'pages.execPlan.cron.year.period', })}</Radio>
            <RangePicker defaultValue={[moment(yearStart.toString(), 'YYYY'), moment(yearEnd.toString(), 'YYYY')]} disabled={timePickerEnabled} picker="year" onChange={handleYearChange}/>
          </Row>
        </Space>
      </Radio.Group>
    </>
  );
};

export default Year;
