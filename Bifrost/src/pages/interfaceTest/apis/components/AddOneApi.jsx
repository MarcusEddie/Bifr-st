
import { ProFormSelect, StepsForm, ProFormTextArea, ModalForm } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, Input, message } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import HeaderArea from './HeaderArea';
import HeaderDetails from './HeaderDetails';
import { saveOneApi } from '@/services/backend/apis';
import { getHttpMethods } from '@/services/backend/generalApis';
import { getFunctions, getFunctionById, getModules, getApps, getAppById, getModuleById } from '@/services/backend/app';

const { Option } = Select;

const AddOneApi = () => {
  const intl = useIntl();
  const ALL = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  const [apiHeaders, setApiHeaders] = React.useState([]);

  const [apps, setApps] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [funcs, setFuncs] = React.useState([]);
  const [appVal, setAppVal] = React.useState(ALL);
  const [moduleVal, setModuleVal] = React.useState(ALL);
  const [funcVal, setFuncVal] = React.useState(ALL);
  const [headerVisible, setHeaderVisible] = useState(false);

  const handleDropDownChange = async () => {
    const appsVal = await getApps();
    setApps(appsVal.data);
  }

  const getModulesByAppId = async (fields) => {
    try {
      const modules2 = await getModules(fields);
      return modules2.data;
    } catch (err) {
      window.console.log(err);
      return [];
    }
  }

  const getFunctionsByModuleId = async (fields) => {
    try {
      const functions2 = await getFunctions(fields);
      return functions2.data;
    } catch (err) {
      window.console.log(err);
      return [];
    }
  }

  const handleAppChange = async (value) => {
    const modulesByApp = await getModulesByAppId(value);
    setAppVal(value);
    const modulesFinal = [];
    modulesFinal.push({ name: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), id: 0 });
    if (modulesByApp && modulesByApp.length > 0) {
      for (let i = 0; i < modulesByApp.length; i += 1) {
        modulesFinal.push(modulesByApp[i]);
      }
    }
    setModules(modulesFinal);
    setModuleVal(modulesFinal[0].name);// fill the first value to the next select component
    setFuncs([]);
    setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
  };

  const handleModuleChange = async (value) => {
    if (parseInt(value, 10) === 0) {
      setFuncs([]);
      setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
      setModuleVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
    } else {
      const funcsByModule = await getFunctionsByModuleId(value);
      const funcsFinal = [];
      funcsFinal.push({ name: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), id: 0 });
      if (funcsByModule && funcsByModule.length > 0) {
        for (let i = 0; i < funcsByModule.length; i += 1) {
          funcsFinal.push(funcsByModule[i]);
        }
      }
      setModuleVal(value);// fill the selected value to the ui
      setFuncs(funcsFinal);
      setFuncVal(funcsFinal[0].name);
    }
  };
  const handleFuncChange = value => {
    if (parseInt(value, 10) === 0) {
      setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
    } else {
      setFuncVal(value);
    }
  }

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

  const isSelectedAppAvailable = async (apPId) => {
    const queryRs = await getAppById(apPId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedModuleAvailable = async (moduleId) => {
    const queryRs = await getModuleById(moduleId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedFuncAvailable = async (functionId) => {
    const queryRs = await getFunctionById(functionId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedAppStructureAvailable = async () => {
    if (appVal === ALL) {
      message.error('Please select an app');
      return false;
    }
    let availableFlag = await isSelectedAppAvailable(appVal);
    if (!availableFlag) {
      message.error('The selected app is unavailable, check it please');
      return false;
    }
    if (moduleVal !== ALL) {
      availableFlag = await isSelectedModuleAvailable(moduleVal);
      if (!availableFlag) {
        message.error('The selected module is unavailable, check it please');
        return false;
      }
    }
    if (funcVal !== ALL) {
      availableFlag = await isSelectedFuncAvailable(funcVal);
      if (!availableFlag) {
        message.error('The selected function is unavailable, check it please');
        return false;
      }
    }

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

    return rs;
  }

  const handleSaveNewCaseSubmit = async (values) => {
    isSelectedAppStructureAvailable();

    const strucObj = Object.create(null);;
    strucObj.app = appVal;
    strucObj.module = 0;
    strucObj.function = 0;
    if (moduleVal !== ALL) {
      strucObj.module = moduleVal;
    }
    if (funcVal !== ALL) {
      strucObj.function = funcVal;
    }

    const kvs = [];
    let obj;
    if (apiHeaders && apiHeaders.length > 0) {
      for (let i = 0; i < apiHeaders.length; i += 1) {
        const key = apiHeaders[i].headerName;
        const kv = Object.create(null);
        kv[key] = apiHeaders[i].headerVal;
        kvs.push(kv);
      }
      obj = Object.create(null);
      obj.headers = kvs;
    }

    const rs = await saveOneApi(values, strucObj, obj);
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

  return (
    <StepsForm current={current} onCurrentChange={setCurrent}
      onFinish={async (values) => {
        const success = await handleSaveNewCaseSubmit(values);

        if (success) {
          setApiHeaders([]);
          setModuleVal(ALL);
          setAppVal(ALL);
          setFuncVal(ALL);
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.apis.app.selection', })}
        onFinish={async (values) => {
          const success = await isSelectedAppStructureAvailable(values);
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
          <Select id="singleCaseNewListApp" name="app" showSearch style={{ width: '100%' }} placeholder="Please select a app" optionFilterProp="children" value={appVal} onChange={handleAppChange} onDropdownVisibleChange={handleDropDownChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {apps && apps.map((app) => (
              <Option key={app.id} label={app.id}>{app.name}</Option>
            ))}
          </Select>
        </Form.Item >
        <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}>
          <Select id="singleCaseNewListModule" name="module" showSearch style={{ width: '100%' }} placeholder="Please select a module" optionFilterProp="children" value={moduleVal} onChange={handleModuleChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {modules && modules.map((mde) => (
              <Option key={mde.id} label={mde.id}>{mde.name}</Option>
            ))}
          </Select>
        </Form.Item >
        <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}>
          <Select id="singleCaseNewListFunc" name="func" showSearch style={{ width: '100%' }} placeholder="Please select a function" optionFilterProp="children" value={funcVal} onChange={handleFuncChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {funcs && funcs.map((fcs) => (
              <Option key={fcs.id} label={fcs.id}>{fcs.name}</Option>
            ))}
          </Select>
        </Form.Item >
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.apis.app.defination.details.setup', })} style={{ height: 750 }}>
        <Form.Item name="apiName" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="apiName" maxLength={255}></Input>
        </Form.Item >
        <Form.Item name="apiUrl" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="apiUrl" maxLength={255}></Input>
        </Form.Item >
        <Form.Item name="apiPath" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.path', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="apiPath" maxLength={255}></Input>
        </Form.Item >
        <ProFormSelect name="apiMethod" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.method', })} width="sm" className={styles.item}
          rules={[{ required: true, message: '请输入您的所在省!', },]}
          request={async () => {
            const ops = await loadingApiMethod();
            return ops;
          }}
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
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.apis.app.defination.interaction.format.setup', })} style={{ height: 750 }}>
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.arguments', })} name="arguments" id="arguments"
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        ></ProFormTextArea>
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.response', })} name="response" id="response"
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        >
        </ProFormTextArea>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddOneApi;