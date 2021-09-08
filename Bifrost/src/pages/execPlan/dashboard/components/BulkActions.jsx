import { message, Space, Popconfirm } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { delTestCaseByIds, deactivateTestCaseByIds, activateTestCaseByIds } from '@/services/backend/testcase';

const BulkActions = (props) => {

  const intl = useIntl();

  const bulkDeactivate = async () => {
    const rowData = props.values.selectedRows;
    let allEnabled = true;
    for (let i = 0; i < rowData.length; i += 1) {
      if (rowData[i].state.toString() === 'disabled') {
        allEnabled = false;
        break;
      }
    }
    if (!allEnabled) {
      message.error(intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.has.disabled.data.in.enabled.data', }));
      return false;
    }
    
    const keys = props.values.selectedRowKeys;
    const ids = keys.join(',');
    const success = await deactivateTestCaseByIds(ids);
    if (success) {
      const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.success', })}`;
      message.success(msg);
      props.values.onCleanSelected();
      props.onSubmit();
      return true;
    }
    const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.fail', })}`;
    message.error(msg);
    return false;
  }

  const bulkActivate = async () => {
    const rowData = props.values.selectedRows;
    let allEnabled = true;
    for (let i = 0; i < rowData.length; i += 1) {
      if (rowData[i].state.toString() === 'enabled') {
        allEnabled = false;
        break;
      }
    }
    if (!allEnabled) {
      message.error(intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.has.enabled.data.in.disabled.data', }));
      return false;
    }

    const keys = props.values.selectedRowKeys;
    const ids = keys.join(',');
    const success = await activateTestCaseByIds(ids);
    if (success) {
      const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.success', })}`;
      message.success(msg);
      props.values.onCleanSelected();
      props.onSubmit();
      return true;
    }
    const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.fail', })}`;
    message.error(msg);
    return false;
  }

  const bulkDelete = async () => {
    const keys = props.values.selectedRowKeys;
    const ids = keys.join(',');
    const success = await delTestCaseByIds(ids);
    if (success) {
      const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.success', })}`;
      message.success(msg);
      props.values.onCleanSelected();
      props.onSubmit();
      return true;
    }
    const msg = `${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}${intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.result.fail', })}`;
    message.error(msg);
    return false;
  }

  return (
    <Space size={16}>
      <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.deactivate.bulk', })} onConfirm={() => bulkDeactivate()}>
        <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}</a>
      </Popconfirm>

      <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.activate.bulk', })} onConfirm={() => bulkActivate()}>
        <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.activate', })}</a>
      </Popconfirm>

      <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.delete.bulk', })} onConfirm={() => bulkDelete()}>
        <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.bulk', })}{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}</a>
      </Popconfirm>

      <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.export', })}</a>
    </Space>
  );
};

export default BulkActions;