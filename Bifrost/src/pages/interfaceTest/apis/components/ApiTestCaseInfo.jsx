import React from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'umi';

const { TextArea } = Input;

const ApiTestCaseInfo = (props) => {
  const intl = useIntl();

  let checkMode = intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.RESPONSE_DATA', });

  let resultBlock = <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} >
    <TextArea id="caseExpectedRs" name="caseExpectedRs" defaultValue={props.values.expectedResult} disabled={true} bordered={false} autoSize={true}></TextArea>
  </Form.Item>;
  if (props && props.values && props.values.resultCheckMode && props.values.resultCheckMode.toString() === 'DB_DATA') {
    checkMode = intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.DB_DATA', });
    resultBlock = <><Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbConnection', })} >
      <Input id="dbConnName" name="dbConnName" defaultValue={props.values.dbConnName} disabled={true} bordered={false}></Input>
    </Form.Item>

      <Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbSQL', })} >
        <TextArea id="querySql" name="querySql" defaultValue={props.values.querySql} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>
    </>
  }

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

      <Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode', })} >
        <TextArea id="resultCheckMode" name="resultCheckMode" defaultValue={checkMode} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>

      {resultBlock}
    </>
  );
};

export default ApiTestCaseInfo;
