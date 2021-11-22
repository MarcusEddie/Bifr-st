import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import { Card, Select, Form, Switch, Input, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ProFormSelect, ProFormDateTimePicker, StepsForm } from '@ant-design/pro-form';
import styles from './style.less';
import { getFunctions, getFunctionById, getModules, getModuleById, getApps, getAppById } from '@/services/backend/app';
import { getApiTestCasesByParams } from '@/services/backend/apiTest';
import { getTestType, getCasePriority, getTriggerType } from '@/services/backend/generalApis';
import SchedulingForm from './components/SchedulingForm';
import ApiTableTransfer from './components/ApiTableTransfer';
import UiTableTransfer from './components/UiTableTransfer';
import InfoBoard from './components/InfoBoard';
import { calculateNextTriggerTime, addOnePlan } from '@/services/backend/testPlan';
import { getUiTestCasesByParams } from '@/services/backend/uiTest';
import { isNotBlank } from '@/utils/StringUtils';

const { Option } = Select;

const TestPlanForm = () => {
  const intl = useIntl();
  const ALL = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
  const [current, setCurrent] = useState(0);
  const formRef = useRef();

  const [apps, setApps] = React.useState([]);
  const [appId, setAppId] = React.useState(ALL);
  const [appVal, setAppVal] = React.useState(ALL);
  const [modules, setModules] = React.useState([]);
  const [moduleId, setModuleId] = React.useState(ALL);
  const [moduleVal, setModuleVal] = React.useState(ALL);
  const [funcs, setFuncs] = React.useState([]);
  const [funcId, setFuncId] = React.useState(ALL);
  const [funcVal, setFuncVal] = React.useState(ALL);
  const [triggerTypes, setTriggerTypes] = React.useState([]);
  const [triggerType, setTriggerType] = React.useState();
  const [cronVal, setCronVal] = React.useState('nah');
  const [doRepeat, setDoRepeat] = React.useState(false);
  const [components, setComponents] = React.useState(undefined);
  const [compTransfer, setCompTransfer] = React.useState(undefined);
  const [dataSet, setDataSet] = React.useState([]);
  const [targetKeys, setTargetKeys] = React.useState([]);
  const [dataToBeSaved, setDataToBeSaved] = React.useState(new Map());
  const [cronFlag, setCronFlag] = useState(undefined);
  const [repeatModeDisabledFlag, setRepeatModeDisabledFlag] = useState(false);
  const handleDropDownChange = async () => {
    const appsVal = await getApps();
    setApps(appsVal.data);
  }

  const handleTriggerTypeDropDownChange = async () => {
    const rs = [];
    const triggerTp = await getTriggerType();

    if (triggerTp && triggerTp.data) {
      for (let i = 0; i < triggerTp.data.length; i += 1) {
        const labelId = `pages.execPlan.defination.trigger.triggerType.${triggerTp.data[i]}`;
        rs.push({ label: intl.formatMessage({ id: labelId, }), value: triggerTp.data[i] });
      }
    }

    setTriggerTypes(rs);
  }

  const handleTriggerTypeChange = async (value) => {
    setTriggerType(value);
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
    setAppId(value);
    const app = await getAppById(value);
    if (app && app.data) {
      setAppVal(app.data.name);
    }
    const modulesFinal = [];
    modulesFinal.push({ name: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), id: 0 });
    if (modulesByApp && modulesByApp.length > 0) {
      for (let i = 0; i < modulesByApp.length; i += 1) {
        modulesFinal.push(modulesByApp[i]);
      }
    }
    setModules(modulesFinal);
    setModuleId(modulesFinal[0].name);// fill the first value to the next select component
    setModuleVal(modulesFinal[0].name);
    setFuncs([]);
    setFuncId(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
    setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }))
  };

  const handleModuleChange = async (value) => {
    if (parseInt(value, 10) === 0) {
      setFuncs([]);
      setFuncId(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
      setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
      setModuleId(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
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
      setModuleId(value);// fill the selected value to the ui
      const moduleRs = await getModuleById(value);
      if (moduleRs && moduleRs.data) {
        setModuleVal(moduleRs.data.name);
      }
      setFuncs(funcsFinal);
      setFuncId(funcsFinal[0].name);
      setFuncVal(funcsFinal[0].name);
    }
  };

  const handleFuncChange = async (value) => {
    if (parseInt(value, 10) === 0) {
      setFuncId(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
      setFuncVal(intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }));
    } else {
      setFuncId(value);
      const func = await getFunctionById(value);
      if (func && func.data) {
        setFuncVal(func.data.name);
      }
    }
  }

  const loadingTestTypes = async () => {
    const rs = [];
    const states = await getTestType();
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        rs.push({ label: states.data[i], value: states.data[i] });
      }
    }

    return rs;
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

  const checkAndSaveCron = async (value) => {
    setCronVal(value);
  }
  const generateTriggerInfo = async (checked) => {
    setDoRepeat(checked);
    let rs;
    if (checked) {
      rs = <><SchedulingForm viewModalVisible={!checked} rtnCron={checkAndSaveCron}></SchedulingForm></>
      setComponents(rs);
    } else {
      rs = <ProFormDateTimePicker name="triggerTime" rules={[{ required: true, message: 'Please select your country!' }]} fieldProps={{
        inputReadOnly: true
      }} label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.time', })} />
      setComponents(rs);
    }
  }

  // eslint-disable-next-line no-unused-vars
  const detailsInS2Check = async (values) => {
    if (cronVal === 'nah' && doRepeat) {
      message.error(intl.formatMessage({ id: 'pages.execPlan.defination.cron.is.invalid', }));
      return false;
    }

    return true;
  }

  // eslint-disable-next-line no-unused-vars
  const detailsInS3Check = async (values) => {
    if (targetKeys.length === 0) {
      message.error(intl.formatMessage({ id: 'pages.execPlan.defination.case.not.selected', }));
      return false;
    }

    return true;
  }

  const saveSelectedTestCases = async (values) => {
    setTargetKeys(values);
  }

  const loadingApiTestCases = async () => {
    const strucObj = Object.create(null);
    strucObj.app = appId;
    if (moduleId !== ALL) {
      strucObj.module = moduleId;
    }
    if (funcId !== ALL) {
      strucObj.function = funcId;
    }
    strucObj.state = 'enabled';
    strucObj.current = 1;
    strucObj.pageSize = 10000;
    const tstCases = await getApiTestCasesByParams(strucObj);

    if (tstCases && tstCases.data) {
      const mockData = [];
      if (tstCases.data.length > 0) {
        for (let i = 0; i < tstCases.data.length; i += 1) {
          mockData.push({
            key: tstCases.data[i].id.toString(),
            id: tstCases.data[i].id,
            name: tstCases.data[i].name,
            priority: tstCases.data[i].priority,
            generalCaseName: tstCases.data[i].generalCaseName,
            appName: tstCases.data[i].api.appName,
            moduleName: tstCases.data[i].api.moduleName,
            functionName: tstCases.data[i].api.functionName,
            apiName: tstCases.data[i].api.name,
          });
        }

        const comp = <><ApiTableTransfer data={mockData} originTargetKeys={targetKeys} saveCases={saveSelectedTestCases}></ApiTableTransfer></>
        setCompTransfer(comp);
        setDataSet(mockData);
      }
    }
  }

  const loadingUiTestCases = async () => {
    const strucObj = Object.create(null);
    strucObj.app = appId;
    if (moduleId !== ALL) {
      strucObj.module = moduleId;
    }
    if (funcId !== ALL) {
      strucObj.function = funcId;
    }
    strucObj.state = 'enabled';
    strucObj.current = 1;
    strucObj.pageSize = 10000;
    const tstCases = await getUiTestCasesByParams(strucObj);
    if (tstCases && tstCases.data) {
      const mockData = [];
      if (tstCases.data.length > 0) {
        for (let i = 0; i < tstCases.data.length; i += 1) {
          mockData.push({
            key: tstCases.data[i].id.toString(),
            id: tstCases.data[i].id,
            name: tstCases.data[i].name,
            priority: tstCases.data[i].priority,
            generalCaseName: tstCases.data[i].generalCaseName,
            appName: tstCases.data[i].page.appName,
            moduleName: tstCases.data[i].page.moduleName,
            functionName: tstCases.data[i].page.functionName,
            pageName: tstCases.data[i].page.name,
          });
        }

        const comp = <><UiTableTransfer data={mockData} originTargetKeys={targetKeys} saveCases={saveSelectedTestCases}></UiTableTransfer></>
        setCompTransfer(comp);
        setDataSet(mockData);
      }
    }
  }

  const loadingTestCasesByStructureInfo = async (values) => {
    if (values.testType === 'API_Test') {
      await loadingApiTestCases();
    } else if (values.testType === 'UI_Auto_Test') {
      await loadingUiTestCases();
    }
  }

  const isSelectedAppAvailable = async (apPId) => {
    const queryRs = await getAppById(apPId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedModuleAvailable = async (modueId) => {
    const queryRs = await getModuleById(modueId);
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
    if (appId === ALL) {
      message.error('Please select an app');
      return false;
    }
    let availableFlag = await isSelectedAppAvailable(appId);
    if (!availableFlag) {
      message.error('The selected app is unavailable, check it please');
      return false;
    }
    if (moduleId !== ALL) {
      availableFlag = await isSelectedModuleAvailable(moduleId);
      if (!availableFlag) {
        message.error('The selected module is unavailable, check it please');
        return false;
      }
    }
    if (funcId !== ALL) {
      availableFlag = await isSelectedFuncAvailable(funcId);
      if (!availableFlag) {
        message.error('The selected function is unavailable, check it please');
        return false;
      }
    }

    return true;
  }

  const handleSavePlanSubmit = async (values) => {
    isSelectedAppStructureAvailable();

    const strucObj = Object.create(null);;
    strucObj.app = appId;
    strucObj.module = 0;
    strucObj.function = 0;
    if (moduleId !== ALL) {
      strucObj.module = moduleId;
    }
    if (funcId !== ALL) {
      strucObj.function = funcId;
    }
    strucObj.planName = values.testName;
    strucObj.testType = values.testType;
    strucObj.casePriority = values.casePriority;
    strucObj.repeatFlag = values.repeatFlag;
    strucObj.triggerTime = values.triggerTime;
    strucObj.cron = cronVal;
    strucObj.caseSet = targetKeys;
    strucObj.triggerType = triggerType;

    const rs = await addOnePlan(strucObj);
    if (rs && rs.success.toString() === 'true') {
      message.success('提交成功');
      return true;
    }
    message.error('失败');
    return false;
  }

  const cronValExplain = async (value) => {
    if (isNotBlank(value)) {
      const rs = await calculateNextTriggerTime(value);
      if (rs && rs.data) {
        setCronFlag(rs.data.content);
      }

    }
  }

  return (
    <PageContainer>
      <Card bordered={false}>
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          onFinish={async (values) => {
            const success = await handleSavePlanSubmit(values);

            if (success) {
              message.success('提交成功');
              setAppId(ALL);
              setAppVal(ALL);
              setModuleId(ALL);
              setModuleVal(ALL);
              setFuncId(ALL);
              setFuncVal(ALL);

              setDoRepeat(false);
              setComponents(undefined);
              setCronFlag(undefined);
              setDataSet([]);
              setTargetKeys([]);
              setDataToBeSaved(new Map())
              setCompTransfer(undefined);
              return true;
            }
            message.error('失败');
            return false;
          }}
        >
          <StepsForm.StepForm
            formRef={formRef}
            title={intl.formatMessage({ id: 'pages.caseMaintain.create.case.function.selection', })}
            // eslint-disable-next-line no-unused-vars
            onFinish={async (values) => {
              window.console.log('StepsForm.StepForm',values);
              if(values.triggerType !== 'jenkins') {
                generateTriggerInfo(true);
                setRepeatModeDisabledFlag(false);
              } else {
                setComponents(undefined);
                setRepeatModeDisabledFlag(true);
              }

              return true;
            }}
          >

            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
              <Select id="singleCaseNewListApp" name="app" showSearch style={{ width: '100%' }} placeholder="Please select a app" optionFilterProp="children" value={appId} onChange={handleAppChange} onDropdownVisibleChange={handleDropDownChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {apps && apps.map((app) => (
                  <Option key={app.id} label={app.id}>{app.name}</Option>
                ))}
              </Select>
            </Form.Item >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}>
              <Select id="singleCaseNewListModule" name="module" showSearch style={{ width: '100%' }} placeholder="Please select a module" optionFilterProp="children" value={moduleId} onChange={handleModuleChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {modules && modules.map((mde) => (
                  <Option key={mde.id} label={mde.id}>{mde.name}</Option>
                ))}
              </Select>
            </Form.Item >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}>
              <Select id="singleCaseNewListFunc" name="func" showSearch style={{ width: '100%' }} placeholder="Please select a function" optionFilterProp="children" value={funcId} onChange={handleFuncChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {funcs && funcs.map((fcs) => (
                  <Option key={fcs.id} label={fcs.id}>{fcs.name}</Option>
                ))}
              </Select>
            </Form.Item >
            <Form.Item name="triggerType" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}  required={true} rules={[{ required: true, message: 'Please select a app' }]}>
              <Select id="triggerType" name="triggerType"  options={triggerTypes} style={{ width: '40%' }} placeholder="Please select a function" value={triggerType} onChange={handleTriggerTypeChange} onDropdownVisibleChange={handleTriggerTypeDropDownChange}
              >
              </Select>
            </Form.Item >
          </StepsForm.StepForm>

          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.details', })} style={{ width: 750 }}
            onFinish={async (values) => {
              window.console.log('S2 =====', values);
              const map = new Map();
              map.set('testName', values.testName);
              map.set('testType', values.testType);
              map.set('casePriority', values.casePriority);
              map.set('triggerType', triggerType);
              if (triggerType === 'scheduling') {
                map.set('repeatFlag', values.repeatFlag);
                if (values.repeatFlag) {
                  map.set('triggerTime', cronVal);
                  cronValExplain(cronVal);
                } else {
                  map.set('triggerTime', values.triggerTime);
                }
              } 
              setDataToBeSaved(map);

              const checkFlag = await detailsInS2Check(values);

              if (checkFlag) {
                await loadingTestCasesByStructureInfo(values);
                return true;
              }

              return false;
            }}
          >
            <Form.Item name="testName" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Input id="testName" maxLength={255}></Input>
            </Form.Item >
            <ProFormSelect name="testType" label={intl.formatMessage({ id: 'pages.execPlan.defination.test.type', })} width="sm" className={styles.item}
              rules={[{ required: true, message: '请输入您的所在省!', },]}
              request={async () => {
                const ops = await loadingTestTypes();
                return ops;
              }}
              fieldProps={{
                allowClear: false
              }}
            />
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
            <Form.Item name="repeatFlag" label={intl.formatMessage({ id: 'pages.execPlan.defination.is.repeat', })} required={true} initialValue={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Switch checkedChildren unCheckedChildren defaultChecked onChange={generateTriggerInfo} disabled={repeatModeDisabledFlag}/>
            </Form.Item >
            {components}
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.cases.set.selection', })}
            onFinish={async (values) => {
              const checkFlag = await detailsInS3Check(values);

              if (checkFlag) {
                return true;
              }

              return false;
            }}
          >
            {compTransfer}
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.cases.set.confirm', })}>
            <InfoBoard appVal={appVal} moduleVal={moduleVal} funcVal={funcVal} name={dataToBeSaved.get('testName')} testType={dataToBeSaved.get('testType')} priority={dataToBeSaved.get('casePriority')} repeat={dataToBeSaved.get('repeatFlag') ? 'YES' : 'NO'} triggerTime={dataToBeSaved.get('triggerTime')} triggerType={dataToBeSaved.get('triggerType')} caseSize={targetKeys.length} cron={cronFlag}></InfoBoard>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};

export default TestPlanForm;
