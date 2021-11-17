import { PageContainer } from '@ant-design/pro-layout';
import { message, Table, Space, Popconfirm, Divider, Button } from 'antd';
import React, { useState, useRef } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { getApps } from '@/services/backend/app';
import { getDBConnByParams, deleteDBConnById, activateDBConnById, deactivateDBConnById } from '@/services/backend/dbConn'
import { getTestCaseState } from '@/services/backend/testcase';
import BulkActions from './components/BulkActions';
import AddOneDBConn from './components/AddOneDBConn';
import UpdateDBConnDetails from './components/UpdateDBConnDetails';
import HistForm from './components/HistForm';
import { getDBType } from '@/services/backend/generalApis';

const DbConnList = () => {
  const intl = useIntl();
  const actionRef = useRef();

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();
  const [createModalVisible, handleNewModalVisible] = useState(false);
  const [histModelVisible, handleHistModalVisible] = useState(false);

  const loadingTestCaseState = async () => {
    const rs = [];
    const states = await getTestCaseState();
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        const labelId = `pages.caseMaintain.dashboard.status.${states.data[i]}`;
        rs.push({ label: intl.formatMessage({ id: labelId, }), value: states.data[i] });
      }
    }

    return rs;
  }

  const loadingDBType = async () => {
    const rs = [];
    rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status.all', }), value: 'all' });
    const states = await getDBType();
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        if (states.data[i].toString() !== 'all') {
          rs.push({ label: states.data[i], value: states.data[i] });
        }
      }
    }

    return rs;
  }

  const loadingApps = async () => {
    const rs = [];
    const appsRs = await getApps();
    if (appsRs && appsRs.data) {
      for (let i = 0; i < appsRs.data.length; i += 1) {
        rs.push({ label: appsRs.data[i].name, value: appsRs.data[i].id });
      }
    }
    return rs;
  }

  const deactivateCurrentRow = async (value) => {
    const success = await deactivateDBConnById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const activateCurrentRow = async (value) => {
    const success = await activateDBConnById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const delCurrentRow = async (value) => {
    const success = await deleteDBConnById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Delete failed, try again please");
    }
  }

  const handleBtnClick = async (key, record) => {
    if (key.toString() === 'update') {
      handleUpdateModalVisible(true);
    } else if (key.toString() === 'hist') {
      handleHistModalVisible(true)
    }


    setCurrentRow(record);
  }

  const loadingData = async (fields, options) => {
    const all = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
    if (!fields.app) {
      return false;
    }
    if (fields.app && fields.app.toString() === all.toString()) {
      message.error("Please select an app");
      return false;
    }

    if (fields.dbType && fields.dbType.toString() === 'all') {
      // eslint-disable-next-line no-param-reassign
      fields.dbType = null;
    }

    const data = await getDBConnByParams(fields, options);
    return data;
  }

  const handleOpenNew = async () => {
    handleNewModalVisible(true);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'app',
      width: '15%',
      valueType: 'select',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      request: async () => {
        const rs = await loadingApps();
        return rs;
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', }),
      dataIndex: 'name',
      width: '5%',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.db.type', }),
      dataIndex: 'dbType',
      width: '20%',
      initialValue: 'all',
      hideInTable: true,
      request: async () => {
        const rs = await loadingDBType();
        return rs;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status', }),
      dataIndex: 'state',
      width: '5%',
      initialValue: 'all',
      hideInTable: true,
      request: async () => {
        const rs = await loadingTestCaseState();
        return rs;
      },
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
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', }),
      width: 200,
      dataIndex: 'name',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status', }),
      dataIndex: 'state',
      width: 60,
      hideInSearch: true,
      valueEnum: {
        enabled: {
          text: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status.enabled', }),
          status: 'Success',
        },
        disabled: {
          text: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status.disabled', }),
          status: 'Error',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.db.type', }),
      width: 70,
      dataIndex: 'dbType',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', }),
      width: 400,
      dataIndex: 'url',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.db.connection.username', }),
      width: 80,
      dataIndex: 'userName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions', }),
      dataIndex: 'option',
      valueType: 'option',
      idth: '10%',
      fixed: 'right',
      render: (_, record) => {
        let updateFlag = false;
        let stateSwitch = <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.deactivate', })} onConfirm={() => deactivateCurrentRow(record.id)}>
          <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.deactivate', })}</a>
        </Popconfirm>
        if (record.state === 'disabled') {
          stateSwitch = <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.activate', })} onConfirm={() => activateCurrentRow(record.id)}>
            <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.activate', })}</a>
          </Popconfirm>
          updateFlag = true;
        }
        return (
          <span>
            <a key="update" disabled={updateFlag} onClick={async () => { await handleBtnClick("update", record) }}>
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}
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

  const clearData = async () => {
    setCurrentRow(undefined);
    if (actionRef.current) {
      actionRef.current.reload();
    }
    handleUpdateModalVisible(false);
  };
  return (
    <PageContainer
    >
      <ProTable columns={columns} scroll={{ x: 1500, y: 600 }}
        actionRef={actionRef}
        request={loadingData}
        rowKey="id"
        manualRequest={true}
        options={{ density: false, fullScreen: true }}
        search={{ labelWidth: '10%', collapseRender: true, }} // collapseRender - the up arrow and down arrow right of the query btn in the search part
        form={{ ignoreRules: false, }} dateFormatter="string"
        pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true, }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { handleOpenNew(); }} >
            {intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}
          </Button>,
        ]}
        // eslint-disable-next-line no-unused-vars
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.has.select', })} {selectedRowKeys.length} {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.items', })}
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.clean.all.select', })}
              </a>
            </span>
          </Space>
        )}
        // eslint-disable-next-line no-unused-vars
        tableAlertOptionRender={(selectedRowKeys, selectedRows, onCleanSelected) => {
          return (
            // eslint-disable-next-line no-unused-vars
            <BulkActions values={selectedRowKeys} onSubmit={async (value) => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }} />
          );
        }}
      />
      <ModalForm title={`${intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}${intl.formatMessage({ id: 'pages.interfaceTest.db.connection', })}`} width="1000px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
        onFinish={async () => {
          return false;
        }}
        submitter={false}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          },
        }}
      >
        <AddOneDBConn ></AddOneDBConn>
      </ModalForm>
      <ModalForm title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}${intl.formatMessage({ id: 'pages.interfaceTest.db.connection', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.details', })}`} width="1000px" preserve={false}
        visible={updateModalVisible} onVisibleChange={handleUpdateModalVisible}
        onFinish={async () => {
          return false;
        }}
        submitter={false}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            clearData();
            if (actionRef.current) {
              actionRef.current.reload();
            }

          },
        }}
      >
        <UpdateDBConnDetails data={currentRow || {}} onSubmit={clearData}></UpdateDBConnDetails>
      
      </ModalForm>
      <HistForm
        onCancel={() => {
          handleHistModalVisible(false);
          setCurrentRow(undefined);
        }}
        histModalVisible={histModelVisible}
        values={currentRow || {}}
        funcTag={'testDBConnectionInfo'}
      />


    </PageContainer>
  );
};

export default DbConnList;
