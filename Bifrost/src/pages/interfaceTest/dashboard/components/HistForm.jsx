import React, { useState}  from 'react';
import { Modal, Tag } from 'antd';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { getLogsByDataIdAndFunc } from '@/services/backend/actionLogs';

const HistForm = (props) => {
  window.console.log(props)
  const intl = useIntl();
  const [priorityFlag, setPriorityFlag] = useState(undefined);

  const loadingData = async (fields, options) => {
    if (!(priorityFlag && priorityFlag.length > 0)) {
      const priority = new Map();
      priority.set('create', 'green');
      priority.set('update', 'yellow');
      priority.set('delete', 'red');
      setPriorityFlag(priority);
    }

    const data = await getLogsByDataIdAndFunc(props.values.id, props.funcTag, options);
    return data;
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist.title.operation.time', }),
      width: 150,
      dataIndex: 'operationTime',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist.title.operator.name', }),
      width: 100,
      dataIndex: 'operatorName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist.title.operation.type', }),
      width: 60,
      dataIndex: 'action',
      hideInSearch: true,
      render: (_, record) => <Tag color={priorityFlag.get(record.action)}>{record.action}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist.title.content.before.edit', }),
      width: 200,
      dataIndex: 'oldData',
      hideInSearch: true,
      valueType: 'jsonCode'
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist.title.content.after.edit', }),
      width: 200,
      dataIndex: 'newData',
      hideInSearch: true,
      // ellipsis: true,
      valueType: 'jsonCode'
    },
  ]

  return (
    <Modal
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist', })}`}
      width="1040px"
      visible={props.histModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      destroyOnClose={true}
      footer={null}
    >
     <ProTable
      columns={columns}
      scroll={{ x: 960, y: 1200 }}
      request={loadingData}
      rowKey="id"
      pagination={{
        pageSize: 20, showSizeChanger: true, showQuickJumper: true,
      }}
      search={false}
      dateFormatter="string"
      toolBarRender={false}
    />
    </Modal>
  );
};

export default HistForm;
