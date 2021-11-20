import React, { useState, useRef, useEffect } from 'react';
import { Tag, Form } from 'antd';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { getUiTestCaseByPlanId } from '@/services/backend/testPlan';

const UiCasesDetails = (props) => {
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
      title: intl.formatMessage({ id: 'pages.uiTest.create.newCase.page', }),
      width: 200,
      dataIndex: 'pageName',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => { return (record.page.name) }
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', }),
      dataIndex: 'moduleName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => { return (record.page.moduleName) }
    },
    {
      title: intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', }),
      dataIndex: 'functionName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => { return (record.page.functionName) }
    }
   ]

  const loadingData = async (fields, options) => {

    const data = await getUiTestCaseByPlanId(fields, options, props.values.id);
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

export default UiCasesDetails;
