import { Button, message, Popconfirm, Divider, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import { getQueueByParams, deleteById, deactivateById, activateById } from '@/services/backend/taskQueue';
import { getTestType, getTaskStateInQueue } from '@/services/backend/generalApis';
import HistForm from './components/HistForm';

const TaskQueue = () => {
  const intl = useIntl();
  const actionRef = useRef();
  const timeAwait = (waitTime) => new Promise((res) => window.setTimeout(() => {
    res();
  }, waitTime));

  const [time, setTime] = useState(() => Date.now());
  const [polling, setPolling] = useState(2000);
  const [testTypeFlag, setTestTypeFlag] = useState(undefined);
  const [priorityFlag, setPriorityFlag] = useState(undefined);
  const [histModelVisible, handleHistModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();

  const loadingTaskState = async () => {
    const rs = [];
    const states = await getTaskStateInQueue();
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
  const handleBtnClick = async (key, record) => {
    if (key.toString() === 'view') {
      handleViewModalVisible(true);
    } else if (key.toString() === 'hist') {
      handleHistModalVisible(true)
    }

    setCurrentRow(record);
  }

  const deactivateCurrentRow = async (value) => {
    const success = await deactivateById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const activateCurrentRow = async (value) => {
    const success = await activateById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const delCurrentRow = async (value) => {
    const success = await deleteById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Delete failed, try again please");
    }
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
        Ready: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Ready', }), status: 'Success' },
        Running: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Running', }), status: 'Processing' },
        Delay: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Delay', }), status: 'Error' },
        Canceled: { text: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.Canceled', }), status: 'Default' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.execHistory.taskQueue.state.progress', }),
      dataIndex: 'progress',
      width: 60,
      hideInSearch: true,
      valueType: (item) => ({
        type: 'progress',
        status: item.status !== 'error' ? 'active' : 'exception',
      }),
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
      title: intl.formatMessage({ id: 'pages.execPlan.defination.trigger.nextTriggerTime', }),
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
        let stateSwitch = <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.deactivate', })} onConfirm={() => deactivateCurrentRow(record.id)}>
          <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}</a>
        </Popconfirm>
        if (record.state === 'disabled') {
          stateSwitch = <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.activate', })} onConfirm={() => activateCurrentRow(record.id)}>
            <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.activate', })}</a>
          </Popconfirm>
        }
        return (
          <span>
            <a key="view" onClick={async () => { await handleBtnClick("view", record) }} >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}
            </a>
            <Divider type="vertical" />
            {stateSwitch}
            <Divider type="vertical" />
            <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.delete', })} onConfirm={() => delCurrentRow(record.id)}>
              <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}</a>
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
    await timeAwait(2000);
    setTime(Date.now());
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

    const data = await getQueueByParams(fields, options);
    return data;
  }

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1000, y: 800 }} 
        rowKey="key"
        pagination={{
          showSizeChanger: true,
        }}
        size="default"
        polling={polling || undefined}
        request={loadingData}
        dateFormatter="string"
        headerTitle={`上次更新时间：${moment(time).format('HH:mm:ss')}`}
        toolBarRender={() => [
          <Button
            key="3"
            type="primary"
            onClick={() => {
              if (polling) {
                setPolling(undefined);
                return;
              }
              setPolling(2000);
            }}
          >
            {polling ? <LoadingOutlined /> : <ReloadOutlined />}
            {polling ? '停止轮询' : '开始轮询'}
          </Button>,
        ]}
      />
      <HistForm
        onCancel={() => {
          handleHistModalVisible(false);
          setCurrentRow(undefined);
        }}
        histModalVisible={histModelVisible}
        values={currentRow || {}}
        funcTag={'taskQueue'}
      />
    </PageContainer>
  );
};

export default TaskQueue;
