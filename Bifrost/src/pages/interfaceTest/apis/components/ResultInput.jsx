import React from 'react';
import { useIntl } from 'umi';
import { ProFormTextArea } from '@ant-design/pro-form';

const ResultInput = (props) => {
  const intl = useIntl();

  const { argumentsVal, responseVal } = props;

  let component = '';

  component = <> <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.arguments', })} name="arguments" id="arguments"
    fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }} initialValue={argumentsVal}
  ></ProFormTextArea>
    <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.response', })} name="response" id="response"
      fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}  initialValue={responseVal}    >
    </ProFormTextArea> </>

  return (
    component
  );
};

export default ResultInput;