import React from 'react';
import { useIntl } from 'umi';
import { ModalForm } from '@ant-design/pro-form';
import {  Form, Input, message } from 'antd';
import { updatePageById } from '@/services/backend/page';

const UpdateForm = (props) => {
  const intl = useIntl();

  const handleUpdateSubmit = async (values) => {

    const strucObj = Object.create(null);;
    strucObj.app = props.values.appId;
    if (props.values && props.values.moduleId && parseInt(props.values.moduleId, 10) !== 0) {
      strucObj.module = props.values.moduleId;
    }
    if (props.values && props.values.functionId && parseInt(props.values.functionId, 10) !== 0) {
      strucObj.function = props.values.functionId;
    }

    const rs = await updatePageById(props.values.id, values, strucObj);
    if (rs && rs.success.toString() === 'true') {
      message.success('提交成功');
      return true;
    }
    message.error('失败');
    return false;
  }
  return (
    <ModalForm width="1000px" preserve={false} visible={props.updateModalVisible}
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}${intl.formatMessage({ id: 'pages.uiTest.create.newCase.page', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.details', })}`}
      onFinish={async (values) => {
        const success = await handleUpdateSubmit(values);
        if (success) {
          props.onSubmit();
          return true;
        }
        return false;
      }}
      submitter={{
        resetButtonProps: {
          style: {
            color: "#fff",
            borderColor: "#1890ff",
            background: "#1890ff",
          },
        },
        submitButtonProps: {
          style: {
            color: "#ff4d4f",
            borderColor: "#ff4d4f",
            background: "#fff",
          },
        },
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: props.onCancel,
      }}
    >
     <Form.Item name="pageName" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} required={true} rules={[{ required: true, message: 'Please input a name!' }]} initialValue={props.values.name}>
          <Input id="pageName" maxLength={255} ></Input>
        </Form.Item >
        <Form.Item name="pageUrl" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} required={true} rules={[{ required: true, message: 'Please input a url!' }]} initialValue={props.values.url}>
          <Input id="pageUrl" maxLength={255}  ></Input>
        </Form.Item >
     </ModalForm>
  );
};

export default UpdateForm;
