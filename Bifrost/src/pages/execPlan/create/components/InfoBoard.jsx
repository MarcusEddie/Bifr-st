import React from 'react';
import { useIntl } from 'umi';
import { Descriptions} from 'antd';

const InfoBoard = (props) => {
  window.console.log('InfoBoard',props);
  const intl = useIntl();

  let comp = <><Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.time', })}> {props.triggerType === 'scheduling' ? props.triggerTime : '-'}</Descriptions.Item></>
  if (props.repeat === 'YES'){
    comp = <><Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.cron', })}> {props.triggerType === 'scheduling' ? props.triggerTime : '-'}</Descriptions.Item><Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.nextTriggerTime', })}> {props.cron}</Descriptions.Item></>
  }
  return (
    <>
      <Descriptions column={1} bordered={true}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}> {props.appVal}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}> {props.moduleVal}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}> {props.funcVal}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.plan.selected.case.size', })}> {props.caseSize}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })}> {props.name}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.testType', })}> {props.testType}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', })}> {props.priority}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.triggerType', })}> {intl.formatMessage({ id: 'pages.execPlan.defination.trigger.triggerType.'.concat(props.triggerType), })}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.defination.is.repeat', })}> {props.triggerType === 'scheduling' ? props.repeat : '-'}</Descriptions.Item>
        {comp}
      </Descriptions>
    </>
  );
};

export default InfoBoard;
