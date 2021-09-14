
import { ProFormSelect, StepsForm, ProFormTextArea } from '@ant-design/pro-form';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, Row, Select, Form, Input, message, Descriptions, Divider } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import StepDescriptions from './StepDescriptions';
import { getApisByAppId, getApiById } from '@/services/backend/apis';
import { getCasePriority, getCaseCheckMode } from '@/services/backend/generalApis';

const { Option } = Select;
const { TextArea } = Input;

const AddInterfaceCase = (props) => {
  const { rowSelected } = props;
  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  const actionRef = useRef();
  const [apis, setApis] = React.useState([]);
  const [descriptions, setDescriptions] = React.useState([]);
  const [apiHeaders, setApiHeaders] = React.useState([]);
  const [apiHeadersFinal, setApiHeadersFinal] = React.useState([]);
  const [apiSelected, setApiSelected] = React.useState(undefined);
  const [showResultJson, setShowResultJson] = React.useState(true);
  const [showDBSerial, setShowDBSerial] = React.useState(true);

  const handleDropDownChange = async () => {
    const appsVal = await getApisByAppId(rowSelected.appId);
    setApis(appsVal.data);
  }

  const handleHeader = async (values) => {
    const headers = [];
    if (values && values.header) {
      values.header.forEach(function func(value, key) {
        const keys = Object.keys(value);
        headers.push({ headerName: keys[0], headerVal: value[keys[0]] });
      })
    }
    // window.console.log(headers);
    setApiHeaders(headers);
  }

  const handleAppChangeInNew = async (value) => {
    const apiDetails = await getApiById(value);
    const rs = [];
    if (apiDetails && apiDetails.data) {
      rs.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', }), val: apiDetails.data.name, id: `${apiDetails.data.id}_Name` });
      rs.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', }), val: apiDetails.data.url, id: `${apiDetails.data.id}_URL` });
      rs.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', }), val: apiDetails.data.path, id: `${apiDetails.data.id}_Path` });
      rs.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', }), val: apiDetails.data.method, id: `${apiDetails.data.id}_Method` });
      const header = `${apiDetails.data.id}_Header`;
      setApiSelected(header);
      handleHeader(apiDetails.data.header);
      rs.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', }), val: 'headerVal', id: `${apiDetails.data.id}_Header` });
    }
    if (actionRef.current) {
      actionRef.current.reload();
    }
    setDescriptions(rs);
  }

  const checkDiffInApiHeader = async (values) => {
    window.console.log(`values`);
    setApiHeadersFinal(values);
    window.console.log(values);
  }

  const toNextStep = async () => {
    window.console.log(apiHeadersFinal);
  }

  const loadingPriority = async () => {
    const priorities = await getCasePriority();
    const prios = [];
    if (priorities && priorities.data) {
      for (let i = 0; i < priorities.data.length; i += 1) {
        prios.push({ label: priorities.data[i], value: priorities.data[i] });
      }
    }
    return prios;
  }

  const loadingCheckMethod = async () => {
    const priorities = await getCaseCheckMode();
    const prios = [];
    if (priorities && priorities.data) {
      for (let i = 0; i < priorities.data.length; i += 1) {
        if (priorities.data[i].toString() === 'RESPONSE_DATA') {
          prios.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.response', }), value: priorities.data[i] });
        } else if (priorities.data[i].toString() === 'DB_DATA') {
          prios.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.db', }), value: priorities.data[i] });
        }
      }
    }

    return prios;
  }

  const handleOnModeChange = async (value) => {
    if (value.toString() === 'RESPONSE_DATA') {
      setShowResultJson(false);
      setShowDBSerial(true);
    } else if (value.toString() === 'DB_DATA') {
      setShowDBSerial(false);
      setShowResultJson(true);
    }
  }

  return (
    <StepsForm current={current} onCurrentChange={setCurrent}
      onFinish={async (values) => {
        // const success = await handleSaveNewCaseSubmit(values);

        // if (success) {
        //   message.success('提交成功');
        //   return true;
        // }
        // message.error('失败');
        // return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.create.interface.selection', })}
        // initialValues={stepData}
        onFinish={async (values) => {
          const success = await toNextStep();
          // if (success) {
          return true;
          // }
          // return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item name="apiSelected" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
          <Select id="apiSelected" showSearch style={{ width: '100%' }} placeholder="Please select a app" optionFilterProp="children" onChange={handleAppChangeInNew} onDropdownVisibleChange={handleDropDownChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {apis && apis.map((app) => (
              <Option key={app.id} label={app.id}>{app.name}</Option>
            ))}
          </Select>
        </Form.Item >
        <StepDescriptions bordered={true} descriptions={descriptions} apiHeaders={apiHeaders} onFinish={checkDiffInApiHeader} editVal={apiSelected}></StepDescriptions>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.steps.settup', })} style={{ height: 750 }}>
        <Form.Item name="caseName" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="caseName" maxLength={255}></Input>
        </Form.Item >
        <ProFormSelect name="casePriority" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', })} width="sm" className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          request={async () => {
            const ops = await loadingPriority();
            return ops;
          }}
        />
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} name="caseSteps" id="caseSteps" rules={[{ required: true, message: '请输入您的所在省!', },]}
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        ></ProFormTextArea>
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step.params', })} name="caseParams" id="caseParams"
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        >
        </ProFormTextArea>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.rs.settup', })} style={{ height: 750 }}>
        <ProFormSelect name="caseCheckMethod" label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode', })} className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          fieldProps={{
            onChange: (value) => { handleOnModeChange(value) },
          }}
          request={async () => {
            const ops = await loadingCheckMethod();
            return ops;
          }}
        />
        <Form.Item name="caseResult" hidden={showResultJson} label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <ProFormTextArea name="caseResult" id="caseResult" fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
          ></ProFormTextArea>
        </Form.Item>
        <Form.Item name="caseDBConn" hidden={showDBSerial} label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbConnection', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <ProFormSelect name="caseDBConn" className={styles.item}
            request={async () => {
              const ops = await loadingCheckMethod();
              return ops;
            }}
          />
        </Form.Item>
        <Form.Item name="caseDBSQL" hidden={showDBSerial} label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbSQL', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <ProFormTextArea name="caseDBSQL" id="caseDBSQL" fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
          ></ProFormTextArea>
        </Form.Item>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddInterfaceCase;