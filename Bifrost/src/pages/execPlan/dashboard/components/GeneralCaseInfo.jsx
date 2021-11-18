import React from 'react';
import { Descriptions, } from 'antd';
import { useIntl } from 'umi';

const GeneralCaseInfo = (props) => {
  const intl = useIntl();

  return (
    <>
      <Descriptions column={1} bordered={true}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.basic.info.cron', })}> {props.values.cron || ''}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.execPlan.basic.info.cron.desc', })}> {props.info || ''}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default GeneralCaseInfo;
