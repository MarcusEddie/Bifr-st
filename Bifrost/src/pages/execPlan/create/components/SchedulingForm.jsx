
import React from 'react';
import {  Tabs, Typography } from 'antd';
import { useIntl } from 'umi';
import Second from './Second';
import Minute from './Minute';
import Hour from './Hour';
import Week from './Week';
import Month from './Month';
import Year from './Year';
import Day from './Day';

const { TabPane } = Tabs;
const { Title } = Typography;

const SchedulingForm = (props) => {
  const intl = useIntl();
  const [cronArr, setCronArr] = React.useState(['*','*','*','*','*','?','*']);
  const component = <><Title level={3} type="success">{"* * * * * ? *"}</Title></>
  const [componentSecond, setComponentSecond] = React.useState(<Second></Second>);
  const [cronVal, setCronVal] = React.useState(component);
  // const [cronCorrect, setCronCorrect] = React.useState(true);
  // const [tabPtr, setTabPtr] = React.useState("second");

  const mapToArray = (value) => {
    let arr = "";
    for( let i= 0; i < value.length; i+=1) {
      arr = arr.concat(value[i], " ");
    }
    return arr;
  }

  const calculateCron = async(value) =>{
    setCronArr(value);
    const valueFinal = mapToArray(value);
    const componentS = <><Title level={3} type="success">{valueFinal}</Title></>
    setCronVal(componentS);
    // setCronCorrect(true);
    props.rtnCron(valueFinal);

  }

  const calculateWrongCron = async(value) =>{
    setCronArr(value);
    const valueFinal = mapToArray(value);
    const componentS = <><Title level={3} type="danger">{valueFinal}</Title></>
    setCronVal(componentS);
    // setCronCorrect(false);
    props.rtnCron('nah');
  }

  const tabChange = async (key) => {
    if (key === "second") {
      // setTabPtr("second");
      setComponentSecond(<Second></Second>);
    } else if (key === "minute") {
      // setTabPtr("minute");
      setComponentSecond(<Minute></Minute>);
    } else if (key === "hour") {
      // setTabPtr("hour");
      setComponentSecond(<Hour sendCron={calculateCron} sendWrongCron={calculateWrongCron} cronArr={cronArr}></Hour>);
    } else if (key === "week") {
      // setTabPtr("week");
      setComponentSecond(<Week></Week>);
    } else if (key === "month") {
      // setTabPtr("month");
      setComponentSecond(<Month sendCron={calculateCron} sendWrongCron={calculateWrongCron} cronArr={cronArr}></Month>);
    } else if (key === "year") {
      // setTabPtr("year");
      setComponentSecond(<Year sendCron={calculateCron} sendWrongCron={calculateWrongCron} cronArr={cronArr}></Year>);
    } else if (key === "day") {
      // setTabPtr("day");
      setComponentSecond(<Day sendCron={calculateCron} sendWrongCron={calculateWrongCron} cronArr={cronArr}></Day>);
    }
  };
  
  return (
    <>
      <Tabs defaultActiveKey="second" onChange={tabChange} size={'large'}   style={{ width: 650 }}>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.second', })} key="second">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.minute', })} key="minute">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.hour', })} key="hour">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.day', })} key="day">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.month', })} key="month">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.week', })} key="week">
          {componentSecond}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.execPlan.cron.year', })} key="year">
          {componentSecond}
        </TabPane>
      </Tabs>
      <br></br>
      {cronVal}
    </>
  );
};

export default SchedulingForm;
