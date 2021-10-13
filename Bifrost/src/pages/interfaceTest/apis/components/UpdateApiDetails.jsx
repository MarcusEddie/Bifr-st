
import { ProFormSelect, StepsForm, ModalForm } from '@ant-design/pro-form';
import React, { useState } from 'react';
import {  Form, Input, message } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import HeaderArea from './HeaderArea';
import HeaderDetails from './HeaderDetails';
import { updateApiById } from '@/services/backend/apis';
import { getHttpMethods } from '@/services/backend/generalApis';
import ResultInput from './ResultInput';

const UpdateApiDetails = (props) => {
  const { rowSelected } = props;

  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const [apiHeaders, setApiHeaders] = React.useState([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [components, setComponents] = useState(undefined);

  const handleHeader = async (values) => {
    const headers = [];
    if (values && values.headers) {
      // eslint-disable-next-line no-unused-vars
      values.headers.forEach(function func(value, key) {
        headers.push({ headerName: value.headerName, headerVal: value.headerVal });
      })
    }

    setApiHeaders(headers);
  }

  const initAndRenderHeaders = async () => {
    const headers = [];
    if (rowSelected && rowSelected.values && rowSelected.values.header && rowSelected.values.header.headers && rowSelected.values.header.headers.length > 0) {
      for (let i = 0; i < rowSelected.values.header.headers.length; i += 1) {
        const keys = Object.keys(rowSelected.values.header.headers[i]);
        headers.push({ headerName: keys[0], headerVal: rowSelected.values.header.headers[i][keys[0]] });
      }
    } else {
      headers.push({ headerName: '&nbsp;&nbsp;&nbsp;&nbsp;-', headerVal: '&nbsp;&nbsp;&nbsp;&nbsp;-' });
    }
    setApiHeaders(headers);
  };

  const restructApiArguments = (args) =>{
    const rs = [];
    const argsVal = '['.concat(args.substring(1, args.length - 1), ']');
    const jsonObj = JSON.parse(argsVal);
    for (let i = 0; i < jsonObj.length; i+=1){
      rs.push(jsonObj[i]);
    }

    return rs;
  }

  const handleUpdateSubmit = async (values) => {

    const strucObj = Object.create(null);;
    strucObj.app = rowSelected.values.appId;
    if (rowSelected.values && rowSelected.values.moduleId && parseInt(rowSelected.values.moduleId, 10) !== 0) {
      strucObj.module = rowSelected.values.moduleId;
    }
    if (rowSelected.values && rowSelected.values.functionId && parseInt(rowSelected.values.functionId, 10) !== 0) {
      strucObj.function = rowSelected.values.functionId;
    }

    const kvs = [];
    let headersObj;
    if (apiHeaders && apiHeaders.length > 0) {
      for (let i = 0; i < apiHeaders.length; i += 1) {
        const key = apiHeaders[i].headerName;
        const kv = Object.create(null);
        kv[key] = apiHeaders[i].headerVal;
        kvs.push(kv);
      }
      headersObj = Object.create(null);
      headersObj.headers = kvs;
    }
    const args = restructApiArguments(values.arguments );
    const argsObj = Object.create(null);
    argsObj.arguments = args;

    const respObj = JSON.parse(values.response);

    const rs = await updateApiById(rowSelected.values.id, values, strucObj, headersObj, argsObj, respObj);
    if (rs && rs.success.toString() === 'true') {
      message.success('提交成功');
      return true;
    }
    message.error('失败');
    return false;
  }


  const calculateVal = async () => {
    setHeaderVisible(true);
  }
  const handleCancel = async () => {
    setHeaderVisible(false);
  }

  const handleSubmit = async (value) => {
    handleHeader(value);
    setHeaderVisible(false);
  }

  const parseApiArguments = (data) => {
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
        argumentJson = argumentJson.concat('\n    {', paramKV, ', ', typeVal, ', ', requireVal, '},');
      })
      argumentJson = argumentJson.substring(0, argumentJson.length - 1);
      argumentJson = argumentJson.concat('\n}');
    }

    return argumentJson;
  }

  function parseJsonArray(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat(' ');
      if (i < space - 3) {
        blockSpace = blockSpace.concat(' ');
      }
    }
    let dataJson = '[\n';
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
        dataJson = dataJson.concat(itemSpace, item, ',\n');
      } else {
        dataJson = dataJson.concat(itemSpace, item, '\n');
      }
    }

    dataJson = dataJson.concat(blockSpace, ']');

    return dataJson;

  }

  function parseJsonObj(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat(' ');
      if (i < space - 3) {
        blockSpace = blockSpace.concat(' ');
      }
    }
    let dataJson = '{\n';
    const keys = Object.keys(data);
    let suffix = ', \n';
    for (let i = 0; i < keys.length; i += 1) {
      if (i === keys.length - 1) {
        suffix = '\n';
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

  const parseResponseData = (data) => {
    let dataJson = '';

    if (Array.isArray(data)) {
      dataJson = parseJsonArray(data, 8);
    } else if (typeof data === 'object') {
      dataJson = parseJsonObj(data, 8);
    }

    return dataJson;
  }

  const parseApiResponse = (data) => {
    let responseJson = 'N/A';
    if (data) {
      responseJson = '{';
      responseJson = responseJson.concat('\n    ', '"success" : "', data.success, '",');
      const dataJson = parseResponseData(data.data);
      responseJson = responseJson.concat('\n    ', '"data" : ', dataJson, ',');
      responseJson = responseJson.concat('\n    ', '"errorCode" : "', data.errorCode, '",');
      responseJson = responseJson.concat('\n    ', '"errorMsg" : "', data.errorMsg, '",');
      responseJson = responseJson.concat('\n    ', '"host" : "', data.host, '",');
      responseJson = responseJson.concat('\n    ', '"traceId" : "', data.traceId, '",');
      responseJson = responseJson.concat('\n    ', '"timeStamp" : "', data.timeStamp, '",');
      responseJson = responseJson.concat('\n    ', '"total" : "', data.total, '",');
      responseJson = responseJson.concat('\n    ', '"current" : "', data.current, '",');
      responseJson = responseJson.concat('\n    ', '"pageSize" : "', data.pageSize, '"');
      responseJson = responseJson.concat('\n}');
    }

    return responseJson;
  }

  const parseArgumentAndResponse = () => {
    const argumentsVal = parseApiArguments(rowSelected.values.arguments);
    const responseVal = parseApiResponse(rowSelected.values.response);
    
    const component = <ResultInput argumentsVal={argumentsVal} responseVal={responseVal} />;
    setComponents(component);

    return true;
  }

  const loadingApiMethod = async () => {
    const rs = [];
    const states = await getHttpMethods();
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        rs.push({ label: states.data[i], value: states.data[i] });
      }
    }
    initAndRenderHeaders();
    
    return rs;
  }

  return (
    <StepsForm current={current} onCurrentChange={setCurrent}
      onFinish={async (values) => {
        const success = await handleUpdateSubmit(values);

        if (success) {
          setApiHeaders([]);
          setComponents(undefined);
          props.onSubmit();
          return true;
        }
        
        return false;
      }}
    >
      <StepsForm.StepForm
        title={intl.formatMessage({ id: 'pages.interfaceTest.apis.app.defination.details.setup', })}
        style={{ height: 750 }}
        onFinish={async () => {
          const success = await parseArgumentAndResponse();
          if (success) {
            return true;
          }
          return false;
        }}
      >
        <Form.Item name="apiName" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]} initialValue={rowSelected.values.name}>
          <Input id="apiName" maxLength={255} ></Input>
        </Form.Item >
        <Form.Item name="apiUrl" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]} initialValue={rowSelected.values.url}>
          <Input id="apiUrl" maxLength={255}  ></Input>
        </Form.Item >
        <Form.Item name="apiPath" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]} initialValue={rowSelected.values.path}>
          <Input id="apiPath" maxLength={255} ></Input>
        </Form.Item >
        <ProFormSelect name="apiMethod" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', })} width="sm" className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          request={async () => {
            const ops = await loadingApiMethod();
            return ops;
          }}
          initialValue={rowSelected.values.method}
          fieldProps={{
            allowClear: false
          }}
        />

        <Form.Item name="apiHeader" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', })}>
          <a onClick={() => { calculateVal() }}>{intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.edit', })}</a>
          <HeaderDetails apiHeaders={apiHeaders} height={300}></HeaderDetails>
        </Form.Item >
        <ModalForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', })} visible={headerVisible}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleCancel();
            },
            centered: true
          }}
          onFinish={handleSubmit}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <div style={{ height: 700, overflowY: 'auto' }}>
            <HeaderArea headers={apiHeaders} handleSubmit={handleSubmit}></HeaderArea>
          </div>
        </ModalForm>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.apis.app.defination.interaction.format.setup', })} style={{ height: 750 }} >
        {components}
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateApiDetails;