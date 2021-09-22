import { useIntl } from 'umi';
import { getApps } from '@/services/backend/app';
import React from 'react';
import { message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getTestCasesByParams } from '@/services/backend/testcase';
import ModuleSelect from './ModuleSelect';
import FuncSelect from './FuncSelect';
import 'antd/dist/antd.css';

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

const TestCases = (props) => {
  const intl = useIntl();
  const { onChange, onReset } = props;

  const loadingData = async (fields, options) => {
    const all = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
    if (fields.app && fields.app.toString() === all.toString()) {
      message.error("Please select an app");
      return false;
    }

    if ((parseInt(fields.module, 10) === 0)) {
      // eslint-disable-next-line no-param-reassign
      fields.module = undefined;
    }

    if ((parseInt(fields.function, 10) === 0)) {
      // eslint-disable-next-line no-param-reassign
      fields.function = undefined;
    }
    const data = await getTestCasesByParams(fields, options);

    return data;
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

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'app',
      colSize: 1,
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
        style: {
          width: '80%',
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'module',
      width: 200,
      initialValue: 0,
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
      formItemProps: {
        style: {
          width: '80%',
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'function',
      width: 200,
      initialValue: 0,
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
      formItemProps: {
        style: {
          width: '80%',
        }
      },
    },

    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: false,
      fixed: 'left',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', }),
      dataIndex: 'name',
      width: 60,
      ellipsis: true,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }),
      dataIndex: 'appName',
      width: 90,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'moduleName',
      width: 90,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'functionName',
      width: 90,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', }),
      dataIndex: 'results',
      width: 90,
      ellipsis: true,
      hideInSearch: true,
    },
  ];
  return (
    <ProTable columns={columns} scroll={{ x: 784, y: 650 }}
      request={loadingData}
      rowKey="id"
      manualRequest={true}
      options={{ density: false, fullScreen: false, setting:true }}
      search={{ collapseRender: true, layout: "vertical" }}
      table-layout="fixed"
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      onReset={onReset}
      onRow={(record) => {
        return {
          onClick: () => {
              onChange(record);
          },
        };
      }}
    />);
};

export default TestCases;