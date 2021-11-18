import React from 'react';
import { useIntl } from 'umi';
import { ModalForm } from '@ant-design/pro-form';
// import UpdatePageCase from './UpdatePageCase';

const UpdateForm = (props) => {
  const intl = useIntl();

  return (
    <ModalForm width="1000px" preserve={false} visible={props.updateModalVisible}
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}${intl.formatMessage({ id: 'pages.uiTest.dashboard.action.viewDetails', })}`}
      onFinish={async () => {
        return false;
      }}
      submitter={false}
      modalProps={{
        destroyOnClose: true,
        onCancel: props.onCancel,
      }}
    >
      {/* <UpdatePageCase rowSelected={props} onSubmit={props.onSubmit}></UpdatePageCase> */}
    </ModalForm>
  );
};

export default UpdateForm;
