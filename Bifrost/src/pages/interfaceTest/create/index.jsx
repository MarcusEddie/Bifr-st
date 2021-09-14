import React, { useState } from 'react';
import { useIntl } from 'umi';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import TestCases from './components/TestCases';
import ExecutionDetails from './components/ExecutionDetails';
import AddInterfaceCase from './components/AddInterfaceCase';
import { ModalForm, StepsForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Select, Form, Input, message, Descriptions, Divider } from 'antd';

const { Option } = Select;

const InterfaceTestCaseCreate = () => {
  const intl = useIntl();

  const initTitle = `${intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })}: - `;
  const [caseName, setCaseName] = useState(initTitle);
  const [btnEnableSwitch, setBtnEnableSwitch] = useState(true);
  const [createModalVisible, handleNewModalVisible] = useState(false);
  const [rowSelected, setRowSelected] = useState(undefined);
  const caseSelected = (row) => {
    // window.console.log(row);
    const titleVal = `${intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })}: ${row.name} `;
    setCaseName(titleVal);
    setRowSelected(row);
    setBtnEnableSwitch(false);
  }


  const handleOpenNew = async () => {
    handleNewModalVisible(true);
  };

  const handleTestCaseTableOnReset = async () => {
    setBtnEnableSwitch(true);
    setCaseName(initTitle);
    setRowSelected(undefined);
  }

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="40%" ghost>
          <TestCases onChange={caseSelected} onReset={handleTestCaseTableOnReset} />
        </ProCard>
        <ProCard title={caseName} headerBordered
          extra={
            <Button key="primary" type="primary" size="large" disabled={btnEnableSwitch} onClick={() => { handleOpenNew(); }} >
              <PlusOutlined />
              {intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}
            </Button>
          }>
          <ExecutionDetails />
        </ProCard>
        <ModalForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase', })} width="1000px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
          onFinish={async (value) => {
            return false;
          }}
          submitter={false}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
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