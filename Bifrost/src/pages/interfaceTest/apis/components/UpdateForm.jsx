import React from 'react';
import { useIntl } from 'umi';
import { ModalForm } from '@ant-design/pro-form';
import UpdateApiDetails from './UpdateApiDetails';

const UpdateForm = (props) => {
  const intl = useIntl();
  const apiHeaders = [];
  if (props && props.values && props.values.header && props.values.header.headers && props.values.header.headers.length > 0) {
    for (let i = 0; i < props.values.header.headers.length; i += 1) {
      const keys = Object.keys(props.values.header.headers[i]);
      apiHeaders.push({ headerName: keys[0], headerVal: props.values.header.headers[i][keys[0]] });
    }
  } else {
    apiHeaders.push({ headerName: '&nbsp;&nbsp;&nbsp;&nbsp;-', headerVal: '&nbsp;&nbsp;&nbsp;&nbsp;-' });
  }

  return (
    <ModalForm width="1000px" preserve={false} visible={props.updateModalVisible}
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.details', })}`}
      onFinish={async () => {
        return false;
      }}
      submitter={false}
      modalProps={{
        destroyOnClose: true,
        onCancel: props.onCancel,
      }}
    >
      <UpdateApiDetails rowSelected={props} apiHeaders={apiHeaders} onSubmit={props.onSubmit}></UpdateApiDetails>
    </ModalForm>
  );
};

export default UpdateForm;
