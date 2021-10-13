import React from 'react';
import { useIntl } from 'umi';
import { ProFormTextArea } from '@ant-design/pro-form';

const GeneralCaseInfo = (props) => {
  const intl = useIntl();

  return (
    <>
      <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.arguments', })} id="arguments"
        fieldProps={{ autoSize: { minRows: 10, maxRows: 10 }, showCount: false, allowClear: false, defaultValue: props.arguments}}
      ></ProFormTextArea>
      <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.response', })} id="response"
        fieldProps={{ autoSize: { minRows: 10, maxRows: 10 }, showCount: false, allowClear: false, defaultValue: props.response }}
      >
      </ProFormTextArea>
    </>
  );
};

export default GeneralCaseInfo;
