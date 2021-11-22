import { message, Popconfirm, Divider, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { getHistoryByParams, reEnqueueById } from '@/services/backend/execHistory';
import { getTestType, getTaskStateInHist } from '@/services/backend/generalApis';
import HistForm from './components/HistForm';

const ExecHistoryList = () => {
  const actionRef = useRef();
  const intl = useIntl();

  const [testTypeFlag, setTestTypeFlag] = useState(undefined);
  const [priorityFlag, setPriorityFlag] = useState(undefined);
  const [histModelVisible, handleHistModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();

  const handleBtnClick = async (key, record) => {
    if (key.toString() === 'view') {
      handleViewModalVisible(true);
    } else if (key.toString() === 'hist') {
      handleHistModalVisible(true)
    }

    setCurrentRow(record);
  }

  const reRunCurrentRow = async (value) => {
    const success = await reEnqueueById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Delete failed, try again please");
    }
  }

  const loadingTaskState = async () => {
    const rs = [];
    const states = await getTaskStateInHist();
    rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }) });
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        rs.push({ label: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.'.concat(states.data[i]), }), value: states.data[i] });
      }
    }

    return rs;
  }

  const loadingTestType = async () => {
    const rs = [];
    const states = await getTestType();
    rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }) });
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        rs.push({ label: states.data[i], value: states.data[i] });
      }
    }

    return rs;
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state', }),
      dataIndex: 'taskState',
      width: '5%',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      filters: true,
      onFilter: true,
      request: async () => {
        const rs = await loadingTaskState();
        return rs;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.testType', }),
      dataIndex: 'testType',
      width: '5%',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      request: async () => {
        const rs = await loadingTestType();
        return rs;
      },
      filters: true,
      onFilter: true,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      ellipsis: false,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.execHistory.taskQueue.plan.name', }),
      dataIndex: 'planName',
      width: 200,
      ellipsis: true,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state', }),
      width: 60,
      dataIndex: 'taskState',
      hideInSearch: true,
      valueEnum: {
        Successful: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Successful', }), status: 'Success' },
        Failed: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Failed', }), status: 'Error' },
        Deleted: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Deleted', }), status: 'Default' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.execHistory.result.summary', }),
      dataIndex: 'details',
      width: 80,
      hideInSearch: true,
      valueType: 'jsonCode',
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', }),
      width: 60,
      dataIndex: 'priority',
      hideInSearch: true,
      // fixed: 'left',
      render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.execPlan.defination.trigger.time', }),
      width: 100,
      dataIndex: 'triggerTime',
      hideInSearch: true,
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.testType', }),
      width: 60,
      dataIndex: 'testType',
      hideInSearch: true,
      render: (_, record) => <Tag color={testTypeFlag.get(record.testType)}>{record.testType}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions', }),
      dataIndex: 'option',
      valueType: 'option',
      width: '12%',
      fixed: 'right',
      render: (_, record) => {
        return (
          <span>
            <a key="view" onClick={async () => { await handleBtnClick("view", record) }} >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}
            </a>
            <Divider type="vertical" />
            <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.rerun', })} onConfirm={() => reRunCurrentRow(record.id)}>
              <a>{intl.formatMessage({ id: 'pages.execHistory.result.re.enqueue', })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a key="hist" onClick={async () => { await handleBtnClick("hist", record) }} >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist', })}
            </a>
          </span>
        );
      },
    },
  ];

  const loadingData = async (fields, options) => {
    if (!(priorityFlag && priorityFlag.length > 0)) {
      const priority = new Map();
      priority.set('P1', 'red');
      priority.set('P2', 'yellow');
      priority.set('P3', 'blue');
      priority.set('P4', 'green');
      setPriorityFlag(priority);
    }

    if (!(testTypeFlag && testTypeFlag.length > 0)) {
      const types = new Map();
      types.set('API_Test', 'red');
      types.set('UI_Auto_Test', 'green');
      types.set('Chaos_Test', 'blue');
      setTestTypeFlag(types);
    }

    window.console.log(fields);
    const all = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
    if (fields.app && fields.app.toString() === all.toString()) {
      message.error("Please select an app");
      return false;
    }

    if (fields.module && fields.module.toString() === all.toString()) {
      // eslint-disable-next-line no-param-reassign
      fields.module = null;
    }

    if (fields.function && fields.function.toString() === all.toString()) {
      // eslint-disable-next-line no-param-reassign
      fields.function = null;
    }

    if (fields.taskState && fields.taskState.toString() === all.toString()) {
      // eslint-disable-next-line no-param-reassign
      fields.taskState = null;
    }

    if (fields.testType && fields.testType.toString() === all.toString()) {
      // eslint-disable-next-line no-param-reassign
      fields.testType = null;
    }

    const data = await getHistoryByParams(fields, options);
    return data;
  }

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="key"
        pagination={{
          showSizeChanger: true,
        }}
        size="default"
        request={loadingData}
        dateFormatter="string"
        toolBarRender={false}
      />
      <HistForm
        onCancel={() => {
          handleHistModalVisible(false);
          setCurrentRow(undefined);
        }}
        histModalVisible={histModelVisible}
        values={currentRow || {}}
        funcTag={'execHistory'}
      />
    </PageContainer>
  );
};

export default ExecHistoryList;
