
import { Descriptions } from 'antd';
import { useIntl } from 'umi';
import { ModalForm } from '@ant-design/pro-form';
import React, { useState } from 'react';
import HeaderArea from './HeaderArea';

const StepDescriptions = (props) => {
  const { bordered, descriptions, apiHeaders, headerUpdated, selfHeaders } = props;
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiHeadersFinal, setApiHeadersFinal] = useState([]);

  const handleHeader = async (values) => {
    const headers = [];
    if (values && values.length > 0) {
      // eslint-disable-next-line no-unused-vars
      values.forEach(function func(value, key) {
        const keys = Object.keys(value);
        headers.push({ headerName: keys[0], headerVal: value[keys[0]] });
      })
    }

    return headers;
  }

  const calculateVal = async () => {
    if (headerUpdated) {
      setApiHeadersFinal(apiHeaders);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selfHeaders && selfHeaders.headers && selfHeaders.headers.length > 0) {
        const headers = await handleHeader(selfHeaders.headers);
        setApiHeadersFinal(headers);
      } else {
        const headers = await handleHeader(descriptions.header.header);
        setApiHeadersFinal(headers);
      }
    }
    setIsModalVisible(true);
  }

  const handleSubmit = async (value) => {
    props.onFinish(value);
    setIsModalVisible(false);
  }

  const handleCancel = async () => {
    setIsModalVisible(false);
  }

  return (
    <>
      <Descriptions column={1} bordered={bordered} size={'small'}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} key={`${descriptions.id}_Name`}> {descriptions.name}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} key={`${descriptions.id}_Url`}> {descriptions.url}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', })} key={`${descriptions.id}_Path`}> {descriptions.path}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', })} key={`${descriptions.id}_Method`}> {descriptions.method}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', })} key={`${descriptions.id}_Header`}> <a onClick={() => { calculateVal() }}>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}</a></Descriptions.Item>
      </Descriptions>
      <ModalForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', })} visible={isModalVisible}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleCancel();
          },
          centered: true
        }}
        onFinish={handleSubmit}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <div style={{ height: 700, overflowY: 'auto' }}>
          <HeaderArea headers={apiHeadersFinal} handleSubmit={handleSubmit}></HeaderArea>
        </div>
      </ModalForm>
    </>
  );
};

export default StepDescriptions;
