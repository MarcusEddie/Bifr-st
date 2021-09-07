import React from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Descriptions, Divider } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';

const UpdateForm = (props) => {
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

  const title = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.testcase', })}`;
  return (
    <ModalForm
      title={title}
      width="600px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        destroyOnClose: true,
        onCancel: props.onCancel,
      }}
      initialValues={{
        caseName: props.values.name,
        caseDesription: props.values.description,
        caseSteps: props.values.steps,
        caseExpectedRs: props.values.results,
      }}
    >
      <div className={styles.result}>
        <StepDescriptions bordered />
        <Divider
          style={{
            margin: '24px 0',
          }}
        />
      </div>
      <ProFormText label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} id="caseName" name="caseName"
        required={true} rules={[{ required: true, message: 'Please input the case name!' }]}></ProFormText>

      <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.description', })} id="caseDesription" name="caseDesription"
        fieldProps={{ maxLength: 500, autoSize: true, showCount: true, allowClear: true }}
        required={true} rules={[{ required: true, message: 'Please input the case description!' }]}></ProFormTextArea>

      <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} id="caseSteps" name="caseSteps"
        fieldProps={{ maxLength: 2000, autoSize: true, showCount: true, allowClear: true }}
        required={true} rules={[{ required: true, message: 'Please input the case steps!' }]}></ProFormTextArea>

      <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} id="caseExpectedRs" name="caseExpectedRs"
        fieldProps={{ maxLength: 255, autoSize: true, showCount: true, allowClear: true }}
        required={true} rules={[{ required: true, message: 'Please input the case result!' }]}></ProFormTextArea>
    </ModalForm>
  );
};

export default UpdateForm;
