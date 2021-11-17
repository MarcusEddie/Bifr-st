import { message, Table, Space, Popconfirm, Divider } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import ViewForm from './components/ViewForm';
import BulkActions from './components/BulkActions';
import ModuleSelect from './components/ModuleSelect';
import HistForm from './components/HistForm';
import FuncSelect from './components/FuncSelect';
import { getApps } from '@/services/backend/app';
import { getTestCaseState, getTestCasesByParams, deactivateTestCaseById, delTestCaseById, updateTestCase, activateTestCaseById } from '@/services/backend/testcase';

/* eslint no-underscore-dangle: 0 */
// eslint-disable-next-line func-names
const __rest = (this && this.__rest) || function (s, e) {
  const t = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i += 1) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};

const TestCasesList = () => {
  const intl = useIntl();
  const actionRef = useRef();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();
  const [histModelVisible, handleHistModalVisible] = useState(false);

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

  const handleUpdateTestCases = async (fields) => {
    const success = await updateTestCase(fields, currentRow.id);
    if (success) {
      return true;
    }
    message.error('更新失败请重试！');
    return false;
  };

  const deactivateCurrentRow = async (value) => {
    const success = await deactivateTestCaseById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const activateCurrentRow = async (value) => {
    const success = await activateTestCaseById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const delCurrentRow = async (value) => {
    const success = await delTestCaseById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Delete failed, try again please");
    }
  }

  const loadingData = async (fields, options) => {
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
    const data = await getTestCasesByParams(fields, options);

    return data;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      ellipsis: false,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', }),
      dataIndex: 'name',
      width: '17%',
      ellipsis: true,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status', }),
      dataIndex: 'state',
      width: '5%',
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
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'app',
      width: '15%',
      valueType: 'select',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      request: async () => {
        const rs = await loadingApps()
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
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'appName',
      width: '15%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'module',
      width: '15%',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      renderFormItem: (item, _a, form) => {
        // eslint-disable-next-line no-unused-vars
        const { type, defaultRender } = _a;
        const rest = __rest(_a, ["type", "defaultRender"]);
        if (type === 'form') {
          return null;
        }
        const pAppId = form.getFieldValue('app');
        // form.resetFields(['function', ['ALL']]);
        // form.setFieldsValue({function:['ALL']});
        return (<ModuleSelect {...rest} state={{ rootId: pAppId }} />);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'moduleName',
      width: '15%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'function',
      width: '15%',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      renderFormItem: (item, _a, form) => {
        // eslint-disable-next-line no-unused-vars
        const { type, defaultRender } = _a;
        const rest = __rest(_a, ["type", "defaultRender"]);
        if (type === 'form') {
          return null;
        }
        const pModuleId = form.getFieldValue('module');
        return (<FuncSelect {...rest} state={{ rootId: pModuleId }} />);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'functionName',
      width: '15%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.status', }),
      dataIndex: 'state',
      width: '5%',
      initialValue: 'all',
      hideInTable: true,
      request: async () => {
        const rs = await loadingTestCaseState()
        return rs;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', }),
      dataIndex: 'name',
      width: '20%',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.description', }),
      dataIndex: 'description',
      width: '20%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', }),
      dataIndex: 'results',
      width: '20%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions', }),
      dataIndex: 'option',
      valueType: 'option',
      width: '13%',
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
            <a
              key="view"
              onClick={() => {
                handleViewModalVisible(true);
                setCurrentRow(record);
              }}
            >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}
            </a>
            <Divider type="vertical" />
            <a
              key="update"
              disabled={updateFlag}
              onClick={() => {
                handleUpdateModalVisible(true);
                setCurrentRow(record);
              }}
            >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}
            </a>
            <Divider type="vertical" />
            {stateSwitch}
            <Divider type="vertical" />
            <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.delete', })} onConfirm={() => delCurrentRow(record.id)}>
              <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a key="hist" onClick={async () => { 
                handleHistModalVisible(true);
                setCurrentRow(record);}} >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.hist', })}
            </a>
          </span>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable columns={columns} scroll={{ x: 1500, y: 600 }}
        actionRef={actionRef}
        request={loadingData}
        rowKey="id"
        manualRequest={true}
        options={{ density: false, fullScreen: true }}
        search={{
          labelWidth: '10%', collapseRender: true, layout: "vertical"
        }}
        // search={false}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
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
        form={{
          ignoreRules: false,
        }} pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }} dateFormatter="string" />
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdateTestCases(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
      <ViewForm
        onCancel={() => {
          handleViewModalVisible(false);
          setCurrentRow(undefined);
        }}
        viewModalVisible={viewModalVisible}
        values={currentRow || {}}
      />
      <HistForm
        onCancel={() => {
          handleHistModalVisible(false);
          setCurrentRow(undefined);
        }}
        histModalVisible={histModelVisible}
        values={currentRow || {}}
        funcTag={'caseGeneralInfo'}
      />
    </PageContainer>
  );
};

export default TestCasesList;
