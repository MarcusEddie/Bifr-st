import React, { useState, useRef, useEffect } from 'react';
import { Tag, Form } from 'antd';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { getAPITestCaseByPlanId } from '@/services/backend/testPlan';

const APICasesDetails = (props) => {
  window.console.log('APICasesDetails', props.prio);
  const intl = useIntl();
  const actionRef = useRef();

  const columns = [
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
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', }),
      width: 60,
      dataIndex: 'priority',
      hideInSearch: true,
      fixed: 'left',
      render: (_, record) => <Tag color={props.prio.get(record.priority)}>{record.priority}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', }),
      width: 200,
      dataIndex: 'apiName',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => { return (record.api.name) }
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'moduleName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => { return (record.api.moduleName) }
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'functionName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => { return (record.api.functionName) }
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode', }),
      width: 130,
      dataIndex: 'resultCheckMode',
      hideInSearch: true,
      valueEnum: {
        RESPONSE_DATA: {
          text: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.RESPONSE_DATA', }),
        },
        DB_DATA: {
          text: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.DB_DATA', }),
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbConnection', }),
      width: 200,
      dataIndex: 'dbConnName',
      hideInSearch: true,
      ellipsis: true,
    }
   ]

  const loadingData = async (fields, options) => {

    const data = await getAPITestCaseByPlanId(fields, options, props.values.id);
    window.console.log(data);
    return data;
  }

  return (
    <>
      <ProTable columns={columns} scroll={{ x: 1500, y: 600 }}
        actionRef={actionRef}
        request={loadingData}
        rowKey="id"
        manualRequest={false}
        toolBarRender={false}
        search={false}
        // options={{ density: false, fullScreen:false }}
        form={{ ignoreRules: false, }} dateFormatter="string"
        pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true, }}
      />
    </>
  );
};

export default APICasesDetails;
