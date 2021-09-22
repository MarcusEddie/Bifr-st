import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import TestCases from './components/TestCases';
import ExecutionDetails from './components/ExecutionDetails';
import AddInterfaceCase from './components/AddInterfaceCase';
import { ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const InterfaceTestCaseCreate = () => {
  const intl = useIntl();
  const actionRef = useRef();
  const initTitle = `${intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })}: - `;
  const [caseName, setCaseName] = useState(initTitle);
  const [generalCaseId, setGeneralCaseId] = useState(0);
  const [btnEnableSwitch, setBtnEnableSwitch] = useState(true);
  const [createModalVisible, handleNewModalVisible] = useState(false);
  const [rowSelected, setRowSelected] = useState(undefined);

  const caseSelected = (row) => {
    // window.console.log(row);
    const titleVal = `${intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })}: ${row.name} `;
    setCaseName(titleVal);
    setRowSelected(row);
    setGeneralCaseId(row.id);
    setBtnEnableSwitch(false);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }

  const handleOpenNew = async () => {
    handleNewModalVisible(true);
  };

  const handleTestCaseTableOnReset = async () => {
    setBtnEnableSwitch(true);
    setCaseName(initTitle);
    setGeneralCaseId(0);
    if (actionRef.current) {
      actionRef.current.reload();
    }
    setRowSelected(undefined);
  }

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="40%" ghost>
          <TestCases onChange={caseSelected} onReset={handleTestCaseTableOnReset} />
        </ProCard>
        <ProCard title={caseName} headerBordered colSpan="60%" ghost
          extra={
            <Button style={{ marginRight: 10, }} key="primary" type="primary" size="large" disabled={btnEnableSwitch} onClick={() => { handleOpenNew(); }} >
              <PlusOutlined />
              {intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}
            </Button>
          }>
          <ExecutionDetails generalCaseId={generalCaseId} actionRef={actionRef} />
        </ProCard>
        <ModalForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase', })} width="1000px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
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
          <AddInterfaceCase rowSelected={rowSelected}></AddInterfaceCase>
        </ModalForm>
      </ProCard>
    </PageContainer>
  );
};

export default InterfaceTestCaseCreate;