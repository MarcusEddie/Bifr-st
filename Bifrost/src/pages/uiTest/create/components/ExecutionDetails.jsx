import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { getUiTestCaseByGeneralCaseId } from '@/services/backend/uiTest';
import { useIntl } from 'umi';
import { Tag } from 'antd';

const ExecutionDetails = (props) => {
  const intl = useIntl();

  const { generalCaseId, actionRef } = props;
  const [priorityFlag, setPriorityFlag] = useState(undefined);

  // eslint-disable-next-line no-unused-vars
  const loadingData = async (fields, options) => {
    const priority = new Map();
    priority.set('P1', 'red');
    priority.set('P2', 'yellow');
    priority.set('P3', 'blue');
    priority.set('P4', 'green');
    setPriorityFlag(priority);

    const data = await getUiTestCaseByGeneralCaseId(fields, generalCaseId);
    window.console.log(data);
    return data;
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', }),
      width: 100,
      dataIndex: 'name',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', }),
      width: 45,
      dataIndex: 'priority',
      hideInSearch: true,
      render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.uiTest.create.newCase.page', }),
      width: 100,
      dataIndex: 'pageName',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => { return (record.page.name) }
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', }),
      width: 100,
      dataIndex: 'steps',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result', }),
      width: 100,
      dataIndex: 'expectedResult',
      hideInSearch: true,
      ellipsis: true,
    },

  ];

  return (
    <ProTable columns={columns} scroll={{ x: 1000, y: 650 }} table-layout="fixed"
      request={loadingData}
      rowKey="id"
      actionRef={actionRef}
      options={{ density: false, fullScreen: false, setting: true }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      search={false}
    />
  );
};

export default ExecutionDetails;