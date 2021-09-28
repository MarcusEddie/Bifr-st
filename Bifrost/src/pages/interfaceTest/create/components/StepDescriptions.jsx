
import { Descriptions } from 'antd';
import { isNotBlank } from '@/utils/StringUtils';
import { useIntl } from 'umi';
import { ModalForm } from '@ant-design/pro-form';
import React, { useState } from 'react';
import HeaderArea from './HeaderArea';

const StepDescriptions = (props) => {
  const { bordered, descriptions, editVal, apiHeaders } = props;
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const calculateVal = async (value) => {
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
        {descriptions && descriptions.map((description) => (
          <Descriptions.Item label={description.label} key={description.id}> {(isNotBlank(editVal) && editVal === description.id) ? <a onClick={() => { calculateVal(description.val) }}>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}</a> : description.val}</Descriptions.Item>
        ))}
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
          <HeaderArea headers={apiHeaders} handleSubmit={handleSubmit}></HeaderArea>
        </div>
      </ModalForm>
    </>
  );
};

export default StepDescriptions;