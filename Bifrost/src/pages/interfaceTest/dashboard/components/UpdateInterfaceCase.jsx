
import { ProFormSelect, StepsForm, ProFormTextArea } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, Input, message } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import StepDescriptions from './StepDescriptions';
import ResultInput from './ResultInput';
import { getDBConnById } from '@/services/backend/dbConn'
import { getCasePriority, getCaseCheckMode } from '@/services/backend/generalApis';
import { updateApiTestCaseDetails } from '@/services/backend/apiTest';

const UpdateInterfaceCase = (props) => {

  const { rowSelected } = props;
  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  const [apiHeaders, setApiHeaders] = React.useState([]);
  const [apiHeadersFinal, setApiHeadersFinal] = React.useState([]);
  const [showResultJson, setShowResultJson] = React.useState(true);
  const [headerUpdatedFlag, setHeaderUpdatedFlag] = React.useState(false);

  function parseJsonArray(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat('&nbsp;');
      if (i < space - 3) {
        blockSpace = blockSpace.concat('&nbsp;');
      }
    }
    let dataJson = '[<br/>';
    for (let i = 0; i < data.length; i += 1) {
      let item = '';
      if (Array.isArray(data[i])) {
        item = parseJsonArray(data[i], space + 2);
      } else if (typeof data[i] === 'object') {
        // eslint-disable-next-line no-use-before-define
        item = parseJsonObj(data[i], space + 2);
      } else if (typeof data[i] === 'string') {
        item = item.concat('"', data[i], '"');
      }
      if (i < data.length - 1) {
        dataJson = dataJson.concat(itemSpace, item, ',<br/>');
      } else {
        dataJson = dataJson.concat(itemSpace, item, '<br/>');
      }
    }

    dataJson = dataJson.concat(blockSpace, ']');

    return dataJson;

  }

  function parseJsonObj(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat('&nbsp;');
      if (i < space - 3) {
        blockSpace = blockSpace.concat('&nbsp;');
      }
    }
    let dataJson = '{<br/>';
    const keys = Object.keys(data);
    let suffix = ', <br/>';
    for (let i = 0; i < keys.length; i += 1) {
      if (i === keys.length - 1) {
        suffix = '<br/>';
      }

      if (Array.isArray(data[keys[i]])) {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": ', parseJsonArray(data[keys[i]], space + 2), suffix);
      } else if (typeof data[keys[i]] === 'object') {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": ', parseJsonObj(data[keys[i]], space + 2), suffix);
      } else if (typeof data[keys[i]] === 'string') {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": "', data[keys[i]], '"', suffix);
      }
    }

    dataJson = dataJson.concat(blockSpace, '}');

    return dataJson;
  }

  const checkDiffInApiHeader = async (values) => {
    const headerLengthAfterEdited = values.headers.length;
    const headerLengthBeforeEdited = rowSelected.values.api.header.header.length;
    if (parseInt(headerLengthAfterEdited, 10) !== parseInt(headerLengthBeforeEdited, 10)) {
      setHeaderUpdatedFlag(true);

      setApiHeadersFinal(values);
      setApiHeaders(values.headers);
    } else {
      const originalHeaders = new Map();
      for (let i = 0; i < rowSelected.values.api.header.header.length; i += 1) {
        originalHeaders.set(rowSelected.values.api.header.header[i].headerName, rowSelected.values.api.header.header[i].headerVal);
      }

      if (values && values.headers && values.headers.length > 0) {
        for (let i = 0; i < values.headers.length; i += 1) {
          if (originalHeaders.has(values.headers[i].headerName) && (values.headers[i].headerVal.toString() !== originalHeaders.get(values.headers[i].headerName).toString())) {
            setHeaderUpdatedFlag(true);
            setApiHeadersFinal(values);
            setApiHeaders(values.headers);
            break;
          } else if (!originalHeaders.has(values.headers[i].headerName)) {
            setHeaderUpdatedFlag(true);
            setApiHeadersFinal(values);
            setApiHeaders(values.headers);
            break;
          }
        }
      }
    }
  }

  const isSelectedDBAvailable = async (dbConnId) => {
    const queryRs = await getDBConnById(dbConnId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const toNextStep = async () => {
    return true;
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

  const handleOnModeChange = async (value) => {
    if (value.toString() === 'RESPONSE_DATA') {
      setShowResultJson(true);
    } else if (value.toString() === 'DB_DATA') {
      setShowResultJson(false);
    }
  }

  const loadingCheckMethod = async () => {
    handleOnModeChange(rowSelected.values.resultCheckMode);
    const priorities = await getCaseCheckMode();
    const prios = [];
    if (priorities && priorities.data) {
      for (let i = 0; i < priorities.data.length; i += 1) {
        if (priorities.data[i].toString() === 'RESPONSE_DATA') {
          prios.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.RESPONSE_DATA', }), value: priorities.data[i] });
        } else if (priorities.data[i].toString() === 'DB_DATA') {
          prios.push({ label: intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode.DB_DATA', }), value: priorities.data[i] });
        }
      }
    }

    return prios;
  }


  const handleUpdateCaseSubmit = async (values) => {

    if (values.caseCheckMethod.toString() === "DB_DATA") {
      const availableDBFlag = await isSelectedDBAvailable(values.caseDBConn);
      if (!availableDBFlag) {
        message.error('The selected db connnection is unavailable, check it please');
        return false;
      }
    }

    const kvs = [];
    const obj = Object.create(null);
    if (apiHeadersFinal && apiHeadersFinal.headers && apiHeadersFinal.headers.length > 0) {
      for (let i = 0; i < apiHeadersFinal.headers.length; i += 1) {
        const key = apiHeadersFinal.headers[i].headerName;
        const kv = Object.create(null);
        kv[key] = apiHeadersFinal.headers[i].headerVal;
        kvs.push(kv);
      }
    }
    obj.headers = kvs;

    const rs = await updateApiTestCaseDetails(values, rowSelected.values.id, obj);
    if (rs && rs.success.toString() === 'true') {
      message.success('提交成功');
      return true;
    }
    message.error('失败');
    return false;
  }

  return (
    <StepsForm current={current} onCurrentChange={setCurrent}
      onFinish={async (values) => {
        const success = await handleUpdateCaseSubmit(values);

        if (success) {
          setShowResultJson(true);
          setApiHeaders([]);
          props.onSubmit();
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.create.interface.header.update', })}
        // eslint-disable-next-line no-unused-vars
        onFinish={async (values) => {
          const success = await toNextStep();
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })}>
          <Select defaultValue={rowSelected.values.api.name} disabled={true}></Select>
        </Form.Item >
        {/* <StepDescriptions bordered={true} descriptions={rowSelected.values.api} selfHeaders={rowSelected.values.header} headerUpdated={headerUpdatedFlag} apiHeaders={apiHeaders} onFinish={checkDiffInApiHeader} editVal={apiSelected}></StepDescriptions> */}
        <StepDescriptions bordered={true} descriptions={rowSelected.values.api} selfHeaders={rowSelected.values.header} headerUpdated={headerUpdatedFlag} apiHeaders={apiHeaders} onFinish={checkDiffInApiHeader}></StepDescriptions>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.steps.update', })} style={{ height: 750 }}
        initialValues={{
          caseName: rowSelected.values.name,
          caseSteps: rowSelected.values.steps,
          caseParams: rowSelected.values.parameters,
          casePriority: rowSelected.values.priority,
        }}
      >
        <Form.Item name="caseName" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="caseName" maxLength={255}></Input>
        </Form.Item >
        <ProFormSelect name="casePriority" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', })} width="sm" className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          request={async () => {
            const ops = await loadingPriority();
            return ops;
          }}
          fieldProps={{
            allowClear: false
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
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.rs.update', })} style={{ height: 750 }}
        initialValues={{
          caseCheckMethod: rowSelected.values.resultCheckMode,
        }}
      >
        <ProFormSelect name="caseCheckMethod" label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result.checkMode', })} className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          fieldProps={{
            onChange: (value) => { handleOnModeChange(value) },
            allowClear: false
          }}
          request={async () => {
            const ops = await loadingCheckMethod();
            return ops;
          }}
        />
        <ResultInput showResultJson={showResultJson} values={rowSelected.values} appId={rowSelected.values.appId} dbConnNameVal={rowSelected.values.dbConnName}></ResultInput>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateInterfaceCase;