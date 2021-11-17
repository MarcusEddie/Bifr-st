import React from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'umi';

const { TextArea } = Input;

const UiTestCaseInfo = (props) => {
  const intl = useIntl();

  return (
    <>
      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} >
        <Input id="caseName" name="caseName" defaultValue={props.values.name} disabled={true} bordered={false}></Input>
      </Form.Item>

      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} >
        <TextArea id="caseSteps" name="caseSteps" defaultValue={props.values.steps} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>

      <Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.arguments', })} >
        <TextArea id="parameters" name="parameters" defaultValue={props.values.parameters} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>

      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} >
        <TextArea id="caseExpectedRs" name="caseExpectedRs" defaultValue={props.values.expectedResult} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>;
    </>
  );
};

export default UiTestCaseInfo;
