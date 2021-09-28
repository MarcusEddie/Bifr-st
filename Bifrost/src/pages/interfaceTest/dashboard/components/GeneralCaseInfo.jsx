import React from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'umi';

const { TextArea } = Input;

const GeneralCaseInfo = (props) => {
  const intl = useIntl();

  return (
    <>
      {props && props.values && props.values.map((info) => (
        <>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} >
            <Input id="caseName" name="caseName" defaultValue={info.name} disabled={true} bordered={false}></Input>
          </Form.Item>

          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} >
            <TextArea id="caseSteps" name="caseSteps" defaultValue={info.steps} disabled={true} bordered={false} autoSize={true}></TextArea>
          </Form.Item>

          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} >
            <TextArea id="caseExpectedRs" name="caseExpectedRs" defaultValue={info.results} disabled={true} bordered={false} autoSize={true}></TextArea>
          </Form.Item>
        </>
      ))}
    </>
  );
};

export default GeneralCaseInfo;
