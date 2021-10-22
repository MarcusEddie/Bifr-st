import { Select, message, Table, Space, Popconfirm, Divider, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import ViewForm from './components/ViewForm';
import BulkActions from './components/BulkActions';
import AddOneApi from './components/AddOneApi';
import { getFunctions, getModules, getApps } from '@/services/backend/app';
import { getTestCaseState } from '@/services/backend/testcase';
import { getHttpMethods } from '@/services/backend/generalApis';
import { getApisByParams, deleteApiById, activateApiById, deactivateApiById } from '@/services/backend/apis'

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

const loadingModules = async (rootId) => {
  const rs = [];
  const modules = await getModules(rootId);
  if (modules && modules.data) {
    return modules.data;
  }
  return rs;
}

const loadingFuncs = async (rootId) => {
  const rs = [];
  const funcs = await getFunctions(rootId);
  if (funcs && funcs.data) {
    return funcs.data;
  }
  return rs;
}

const ApisList = () => {
  const intl = useIntl();
  const actionRef = useRef();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();
  const [createModalVisible, handleNewModalVisible] = useState(false);

  const ModuleSelect = (props) => {
    const { state } = props;
    const [innerOptions, setOptions] = useState([]);
    useEffect(() => {
      const { rootId } = state || {};
      const modules = loadingModules(rootId);
      const rs = [];
      rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }) });
      modules.then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          rs.push({ label: data[i].name, value: data[i].id });
        }
        setOptions(rs);
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(state)]);
    return <Select options={innerOptions} defaultValue={intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', })} onChange={props.onChange} />;
  };

  const FuncSelect = (props) => {
    const { state } = props;
    const [innerOptions, setOptions] = useState([]);
    useEffect(() => {
      const { rootId } = state || {};
      const funcs = loadingFuncs(rootId);
      const rs = [];
      rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }) });
      funcs.then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          rs.push({ label: data[i].name, value: data[i].id });
        }
        setOptions(rs);
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(state)]);
    return <Select options={innerOptions} defaultValue={intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', })} onChange={props.onChange} />;
  };

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

  const loadingApiMethod = async () => {
    const rs = [];
    const states = await getHttpMethods();
    rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }) });
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        rs.push({ label: states.data[i], value: states.data[i] });
      }
    }

    return rs;
  }

  const deactivateCurrentRow = async (value) => {
    const success = await deactivateApiById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const activateCurrentRow = async (value) => {
    const success = await activateApiById(value);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error("Disable failed, try again please");
    }
  }

  const delCurrentRow = async (value) => {
    const success = await deleteApiById(value);
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
    if (!fields.app) {
      return false;
    }
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

    if (fields.method && fields.method.toString() === all.toString()) {
      // eslint-disable-next-line no-param-reassign
      fields.method = null;
    }

    const data = await getApisByParams(fields, options);
    return data;
  }

  const handleBtnClick = async (key, record) => {
    if (key.toString() === 'view') {
      handleViewModalVisible(true);
    } else if (key.toString() === 'update') {
      handleUpdateModalVisible(true);
    }

    setCurrentRow(record);
  }

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
        return (<ModuleSelect {...rest} state={{ rootId: pAppId }} />);
      },
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
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', }),
      dataIndex: 'path',
      width: '20%',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', }),
      dataIndex: 'method',
      width: '5%',
      initialValue: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }),
      hideInTable: true,
      request: async () => {
        const rs = await loadingApiMethod();
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
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', }),
      width: 200,
      dataIndex: 'path',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', }),
      width: 200,
      dataIndex: 'method',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', }),
      width: 200,
      dataIndex: 'url',
      hideInSearch: true,
      ellipsis: true,
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
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'appName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'moduleName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'functionName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
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
            <a key="view" onClick={async () => { await handleBtnClick("view", record) }} >
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}
            </a>
            <Divider type="vertical" />
            <a key="update" disabled={updateFlag} onClick={async () => { await handleBtnClick("update", record) }}>
              {intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.update', })}
            </a>
            <Divider type="vertical" />
            {stateSwitch}
            <Divider type="vertical" />
            <Popconfirm title={intl.formatMessage({ id: 'ui.msg.caseMaintain.dashboard.actions.sure.delete', })} onConfirm={() => delCurrentRow(record.id)}>
              <a>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.delete', })}</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const handleOpenNew = async () => {
    handleNewModalVisible(true);
  };

  return (
    <PageContainer>
      <ProTable columns={columns} scroll={{ x: 1500, y: 600 }}
        actionRef={actionRef}
        request={loadingData}
        rowKey="id"
        manualRequest={true}
        options={{ density: false, fullScreen: true }}
        search={{ labelWidth: '10%', collapseRender: true, }}
        form={{ ignoreRules: false, }} dateFormatter="string"
        pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true, }}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
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
      <ModalForm title={intl.formatMessage({ id: 'pages.interfaceTest.apis.action.new', })} width="1000px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
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
        <AddOneApi ></AddOneApi>
      </ModalForm>
      <UpdateForm
        onSubmit={async () => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);

          if (actionRef.current) {
            actionRef.current.reload();
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
    </PageContainer>
  );
};

export default ApisList;
