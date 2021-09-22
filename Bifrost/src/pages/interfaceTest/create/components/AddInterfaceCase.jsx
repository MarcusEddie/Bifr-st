
import { ProFormSelect, StepsForm, ProFormTextArea } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Card, Select, Form, Input, message } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import StepDescriptions from './StepDescriptions';
import ResultInput from './ResultInput';
import { getApisByAppId, getApiById } from '@/services/backend/apis';
import {getDBConnById } from '@/services/backend/dbConn'
import { getCasePriority, getCaseCheckMode } from '@/services/backend/generalApis';
import { saveOneApiTestCase } from '@/services/backend/apiTest';

const { Option } = Select;

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
  const [apiArguments, setApiArguments] = React.useState('N/A');
  const [apiResponse, setApiResponse] = React.useState('N/A');

  const handleDropDownChange = async () => {
    const appsVal = await getApisByAppId(rowSelected.appId);
    setApis(appsVal.data);
  }

  const handleHeader = async (values) => {
    const headers = [];
    if (values && values.header) {
      // eslint-disable-next-line no-unused-vars
      values.header.forEach(function func(value, key) {
        const keys = Object.keys(value);
        headers.push({ headerName: keys[0], headerVal: value[keys[0]] });
      })
    }
    setApiHeaders(headers);
  }

  const parseApiArguments = async (data) => {
    let argumentJson = 'N/A';
    if (data && data.arguments && data.arguments.length > 0) {
      argumentJson = '{';
      // eslint-disable-next-line no-unused-vars
      data.arguments.forEach(function func(value, key) {
        const keys = Object.keys(value);
        let paramKV = '';
        let typeVal = '';
        let requireVal = '';
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i].toString() === 'type') {
            typeVal = typeVal.concat('"type" : "', value[keys[i]], '"');
          } else if (keys[i].toString() === 'required') {
            requireVal = requireVal.concat('"required" : "', value[keys[i]], '"');
          } else {
            paramKV = paramKV.concat('"', keys[i], '" : "', value[keys[i]], '"')
          }
        }
        argumentJson = argumentJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;{', paramKV, ', ', typeVal, ', ', requireVal, '},');
      })
      argumentJson = argumentJson.substring(0, argumentJson.length - 1);
      argumentJson = argumentJson.concat('<br/>}');
    }

    setApiArguments(argumentJson);
  }

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

  const parseResponseData = async (data) => {
    let dataJson = '';

    if (Array.isArray(data)) {
      dataJson = parseJsonArray(data, 8);
    } else if (typeof data === 'object') {
      dataJson = parseJsonObj(data, 8);
    }

    return dataJson;
  }


  const parseApiResponse = async (data) => {
    let responseJson = 'N/A';
    if (data) {
      responseJson = '{';
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"success" : "', data.success, '",');
      const dataJson = await parseResponseData(data.data);
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"data" : ', dataJson, ',');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"errorCode" : "', data.errorCode, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"errorMsg" : "', data.errorMsg, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"host" : "', data.host, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"traceId" : "', data.traceId, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"timeStamp" : "', data.timeStamp, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"total" : "', data.total, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"current" : "', data.current, '",');
      responseJson = responseJson.concat('<br/>&nbsp;&nbsp;&nbsp;&nbsp;', '"pageSize" : "', data.pageSize, '"');
      responseJson = responseJson.concat('<br/>}');
    }
    setApiResponse(responseJson);
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
      parseApiArguments(apiDetails.data.arguments);
      parseApiResponse(apiDetails.data.response);
      setApiHeadersFinal([]);
    }
    if (actionRef.current) {
      actionRef.current.reload();
    }
    setDescriptions(rs);
  }

  const checkDiffInApiHeader = async (values) => {
    const headerLengthAfterEdited = values.headers.length;
    const headerLengthBeforeEdited = apiHeaders.length;
    if (parseInt(headerLengthAfterEdited, 10) !== parseInt(headerLengthBeforeEdited, 10)) {
      setApiHeadersFinal(values);
      setApiHeaders(values.headers);
    } else {
      const originalHeaders = new Map();
      for (let i = 0; i < apiHeaders.length; i += 1) {
        originalHeaders.set(apiHeaders[i].headerName, apiHeaders[i].headerVal);
      }

      if (values && values.headers && values.headers.length > 0) {
        for (let i = 0; i < values.headers.length; i += 1) {
          if (originalHeaders.has(values.headers[i].headerName) && (values.headers[i].headerVal.toString() !== originalHeaders.get(values.headers[i].headerName).toString())) {
            setApiHeadersFinal(values);
            setApiHeaders(values.headers);
            break;
          } else if (!originalHeaders.has(values.headers[i].headerName)) {
            setApiHeadersFinal(values);
            setApiHeaders(values.headers);
            break;
          }
        }
      }
    }
  }

  const isSelectedApiAvailable = async (apiId) => {
    const queryRs = await getApiById(apiId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedDBAvailable = async (dbConnId) => {
    const queryRs = await getDBConnById(dbConnId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const toNextStep = async (values) => {
    window.console.log(values);
    const availableFlag = await isSelectedApiAvailable(values.apiSelected);
    if (!availableFlag) {
      message.error('The selected api is unavailable, check it please');
      return false;
    }

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

  const loadingCheckMethod = async () => {
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

  const handleOnModeChange = async (value) => {
    if (value.toString() === 'RESPONSE_DATA') {
      setShowResultJson(false);
      setShowDBSerial(true);
    } else if (value.toString() === 'DB_DATA') {
      setShowDBSerial(false);
      setShowResultJson(true);
    }
  }

  const handleSaveNewCaseSubmit = async (values) => {
    window.console.log(values);
    const availableFlag = await isSelectedApiAvailable(values.apiSelected);
    if (!availableFlag) {
      message.error('The selected api is unavailable, check it please');
      return false;
    }

    if(values.caseCheckMethod.toString() === "DB_DATA"){
      const availableDBFlag = await isSelectedDBAvailable(values.caseDBConn);
      if (!availableDBFlag) {
        message.error('The selected db connnection is unavailable, check it please');
        return false;
      }
    }

    const kvs = [];
    let obj;
    if (apiHeadersFinal && apiHeadersFinal.headers && apiHeadersFinal.headers.length > 0) {
      for (let i = 0; i < apiHeadersFinal.headers.length; i += 1) {
        const key = apiHeadersFinal.headers[i].headerName;
        const kv = Object.create(null);
        kv[key] = apiHeadersFinal.headers[i].headerVal;
        kvs.push(kv);
      }
      obj = Object.create(null);
      obj.headers = kvs;
    }


    const rs = await saveOneApiTestCase(values, rowSelected.id, obj);
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
        const success = await handleSaveNewCaseSubmit(values);

        if (success) {
          setApiArguments('N/A');
          setApiResponse('N/A');
          setShowResultJson(true);
          setShowDBSerial(true);
          setDescriptions([]);
          setApiHeaders([]);
          setApiSelected(undefined);
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.create.interface.selection', })}
        // initialValues={stepData}
        onFinish={async (values) => {
          const success = await toNextStep(values);
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item name="apiSelected" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })} required={true} rules={[{ required: true, message: 'Please select a app' }]} style={{ width: '100%' }}>
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
        <Form.Item name="apiArguments" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.arguments', })}>
          <Card style={{ maxHeight: 190, overflowY: 'auto', }}>
            <div dangerouslySetInnerHTML={{ __html: apiArguments }}></div>
          </Card>
        </Form.Item >
        <Form.Item name="apiResponse" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.response', })}>
          <Card style={{ maxHeight: 190, overflowY: 'auto', }}>
            <div dangerouslySetInnerHTML={{ __html: apiResponse }}></div>
          </Card>
        </Form.Item >
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
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.rs.settup', })} style={{ height: 750 }}>
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
        <ResultInput showResultJson={showResultJson} showDBSerial={showDBSerial} appId={rowSelected.appId}></ResultInput>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddInterfaceCase;