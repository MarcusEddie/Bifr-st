
import { ProFormSelect, StepsForm, ProFormTextArea } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, Input, message } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import { getPagesByAppId, getPageById } from '@/services/backend/page';
import { getCasePriority } from '@/services/backend/generalApis';
import { saveOneUiTestCase } from '@/services/backend/uiTest';

const { Option } = Select;

const AddUiCase = (props) => {
  const { rowSelected } = props;
  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  const actionRef = useRef();
  const [apis, setApis] = React.useState([]);
  const [apiSelected, setApiSelected] = React.useState(undefined);
  const [showResultJson, setShowResultJson] = React.useState(true);
  const [showDBSerial, setShowDBSerial] = React.useState(true);
  const [apiArguments, setApiArguments] = React.useState('N/A');

  const handleDropDownChange = async () => {
    const appsVal = await getPagesByAppId(rowSelected.appId);
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
  }

  const handleAppChangeInNew = async (value) => {
    const apiDetails = await getPageById(value);
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
    }
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }

  const isSelectedPagevailable = async (apiId) => {
    const queryRs = await getPageById(apiId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const toNextStep = async (values) => {
    const availableFlag = await isSelectedPagevailable(values.pageSelected);
    if (!availableFlag) {
      message.error('The selected page is unavailable, check it please');
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

  const handleSaveNewCaseSubmit = async (values) => {
    const availableFlag = await isSelectedPagevailable(values.pageSelected);
    if (!availableFlag) {
      message.error('The selected api is unavailable, check it please');
      return false;
    }

    const rs = await saveOneUiTestCase(values, rowSelected.id);
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
          setShowResultJson(true);
          setShowDBSerial(true);
          setApiSelected(undefined);
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.uiTest.create.page.selection', })}
        onFinish={async (values) => {
          const success = await toNextStep(values);
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item name="pageSelected" label={intl.formatMessage({ id: 'pages.uiTest.create.newCase.page', })} required={true} rules={[{ required: true, message: 'Please select a page' }]} style={{ width: '100%' }}>
          <Select id="pageSelected" showSearch style={{ width: '100%' }} placeholder="Please select a page" optionFilterProp="children" onChange={handleAppChangeInNew} onDropdownVisibleChange={handleDropDownChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {apis && apis.map((app) => (
              <Option key={app.id} label={app.id}>{app.name}</Option>
            ))}
          </Select>
        </Form.Item >
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.steps.settup', })} style={{ height: 750 }}>
        <Form.Item name="caseName" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} required={true} rules={[{ required: true, message: 'Please input a name!' }]}>
          <Input id="caseName" maxLength={255}></Input>
        </Form.Item >
        <ProFormSelect name="casePriority" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.priority', })} width="sm" className={styles.item}
          rules={[{ required: true, message: 'Is required!', },]}
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
        <Form.Item name="caseResult" label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result', })} rules={[{ required: true, message: 'Please input a result!' }]}>
          <ProFormTextArea name="caseResult" id="caseResult" fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
          ></ProFormTextArea>
        </Form.Item>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddUiCase;