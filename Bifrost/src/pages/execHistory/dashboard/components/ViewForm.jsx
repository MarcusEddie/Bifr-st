import React from 'react';
import { Modal, Input, Form } from 'antd';
import { Descriptions, Divider } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';

const { TextArea } = Input;

const ViewForm = (props) => {
  const intl = useIntl();
  const StepDescriptions = ({ bordered }) => {
    return (
      <Descriptions column={1} bordered={bordered}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}> {props.values.appName}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}> {props.values.moduleName}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}> {props.values.functionName}</Descriptions.Item>
      </Descriptions>
    );
  };
  return (
    <Modal
      title="新建规则"
      width="600px"
      visible={props.viewModalVisible}
      onCancel={props.onCancel}
      destroyOnClose={true}
      footer={null}
    >
      <div className={styles.result}>
        <StepDescriptions bordered />
        <Divider
          style={{
            margin: '24px 0',
          }}
        />
      </div>
      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} >
        <Input id="caseName" name="caseName" defaultValue={props.values.name} disabled={true} bordered={false}></Input>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.description', })} >
        <TextArea id="caseDesription" name="caseDesription" defaultValue={props.values.description} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} >
        <TextArea id="caseSteps" name="caseSteps" defaultValue={props.values.steps} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} >
        <TextArea id="caseExpectedRs" name="caseExpectedRs" defaultValue={props.values.results} disabled={true} bordered={false} autoSize={true}></TextArea>
      </Form.Item>
    </Modal>
  );
};

export default ViewForm;
