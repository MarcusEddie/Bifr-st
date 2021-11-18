import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import { Card, Result, Button, Select, Form, Descriptions, Divider, Switch, Input, } from 'antd';
// import { , Col, Row, Form, Input, message, Descriptions } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormGroup, ProFormSelect, ProFormDateTimePicker, StepsForm } from '@ant-design/pro-form';
import styles from './style.less';
import { getFunctions, getFunctionById, getModules, getModuleById, getApps, getAppById } from '@/services/backend/app';
import { getTestType, getCasePriority } from '@/services/backend/generalApis';
import SchedulingForm from './components/SchedulingForm';
import TableTransfer from './components/TableTransfer';
import InfoBoard from './components/InfoBoard';

const { Option } = Select;

const StepResult = (props) => {

  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="预计两小时内到账"
      extra={
        <>
          <Button type="primary" onClick={props.onFinish}>
            再转一笔
          </Button>
          <Button>查看账单</Button>
        </>
      }
      className={styles.result}
    >
      {props.children}
    </Result>
  );
};

function getIdxInArray(arr, obj) {
  const len = arr.length;
  for (let i = 0; i < len; i += 1) {
    if (parseInt(arr[i].id, 10) === parseInt(obj, 10)) {
      return i;
    }
  }
  return -1;
}

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
  const [doRepeat, setDoRepeat] = React.useState(false);
  const [components, setComponents] = React.useState(undefined);

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

  const switchToOneTime = async (checked) => {
    window.console.log(checked);
    setDoRepeat(checked);
    let rs;
    if (checked) {
      rs = <ProFormDateTimePicker name="triggerTime" rules={[{ required: true, message: 'Please select your country!' }]} fieldProps={{
        inputReadOnly: true
      }} label={intl.formatMessage({ id: 'pages.execPlan.defination.trigger.time', })} />
      setComponents(rs);
    } else {
      rs = <><SchedulingForm viewModalVisible={!checked}></SchedulingForm></>
      setComponents(rs);
    }
  }

  const StepDescriptions = ({ bordered }) => {
    return (
      <Descriptions column={1} bordered={bordered}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}> {appVal}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}> {moduleVal}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}> {funcVal}</Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          // submitter={{
          //   render: (props, dom) => {
          //     if (props.step === 2) {
          //       return null;
          //     }

          //     return dom;
          //   },
          // }}
        >
        {/* <StepsForm current={current} onCurrentChange={setCurrent}
          onFinish={async (values) => {
            const success = await handleSaveNewCaseSubmit(values);

            if (success) {
              message.success('提交成功');
              setFuncBondInNew(0);
              setAppValInNew(ALL);
              setApps([]);
              setModuleValInNew(ALL);
              setModulesInNew([]);
              setFuncValInNew(ALL);
              setFuncsInNew([]);
              return true;
            }
            message.error('失败');
            return false;
          }}
        > */}
          <StepsForm.StepForm
            formRef={formRef}
            title={intl.formatMessage({ id: 'pages.caseMaintain.create.case.function.selection', })}
            // initialValues={stepData}
            onFinish={async (values) => {
              switchToOneTime(true);
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
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.details', })}>
            <div className={styles.result}>
              <StepDescriptions bordered />
              <Divider
                style={{
                  margin: '24px 0',
                }}
              />
            </div>
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
            <Form.Item name="repeatFlag" label={intl.formatMessage({ id: 'pages.execPlan.defination.is.repeat', })} required={true} initialValue= {true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Switch checkedChildren unCheckedChildren defaultChecked onChange={switchToOneTime} />
            </Form.Item >
            {/* <SchedulingForm repeat={doRepeat}></SchedulingForm> */}
            {components}
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.cases.set.selection', })}>
            <TableTransfer></TableTransfer>
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.execPlan.defination.cases.set.confirm', })}>
            <InfoBoard></InfoBoard>
          </StepsForm.StepForm>
        </StepsForm>
        {/* <Divider
          style={{
            margin: '40px 0 24px',
          }}
        /> */}
        {/* <div className={styles.desc}>
          <h3>说明</h3>
          <h4>转账到支付宝账户</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p>
          <h4>转账到银行卡</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p>
        </div> */}
      </Card>
    </PageContainer>
  );
};

export default TestPlanForm;
