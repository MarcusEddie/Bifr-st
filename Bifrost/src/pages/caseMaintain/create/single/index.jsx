import ProForm, { ModalForm, StepsForm } from '@ant-design/pro-form';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, Row, Select, Form, Input, message, Result, Descriptions, Statistic, Divider } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import { getFunctions, getFunctionById, getModules, getApps, saveNewAppComponent, deleteAppComponent, saveOneCase } from './service';

const { Option } = Select;
const { TextArea } = Input;
const emptyArr = {
  'NEW': ['NEW'],
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

const newRecord = [0, 0, 0];

const SingleForm = () => {

  const intl = useIntl();
  const ALL = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });

  const [appsInPop, setAppsInPop] = React.useState([]);
  const [appValInPop, setAppValInPop] = React.useState(ALL);
  const [modulesInPop, setModulesInPop] = React.useState([]);
  const [moduleValInPop, setModuleValInPop] = React.useState(ALL);
  const [funcsInPop, setFuncsInPop] = React.useState([]);
  const [funcValInAddPop, setFuncValInAddPop] = React.useState("");
  const [funcValInDelPop, setFuncValInDelPop] = React.useState(ALL);

  const [appInfoInPop, setAppInfoInPop] = React.useState(ALL);
  const [moduleInfoInPop, setModuleInfoInPop] = React.useState(ALL);
  const [funcInfoInPop, setFuncInfoInPop] = React.useState(ALL);

  const [apps, setApps] = React.useState([]);
  const [appValInFuncList, setAppValInFuncList] = React.useState(ALL);
  const [modules, setModules] = React.useState([]);
  const [moduleValInFuncList, setModuleValInFuncList] = React.useState(ALL);
  const [funcs, setFuncs] = React.useState([]);
  const [funcValInFuncList, setFuncValInFuncList] = React.useState(ALL);

  const [appValInNew, setAppValInNew] = React.useState(ALL);
  const [modulesInNew, setModulesInNew] = React.useState([]);
  const [moduleValInNew, setModuleValInNew] = React.useState(ALL);
  const [funcsInNew, setFuncsInNew] = React.useState([]);
  const [funcValInNew, setFuncValInNew] = React.useState(ALL);
  const [funcBondInNew, setFuncBondInNew] = React.useState(0);

  const handleAddNewComponent = async () => {
    if (appInfoInPop.toString() === ALL.toString() || moduleInfoInPop.toString() === ALL.toString() || funcInfoInPop.toString() === ALL.toString() || (typeof funcInfoInPop === "undefined" || funcInfoInPop === null || funcInfoInPop.toString().trim() === "")) {
      let missedFields = "";
      if (appInfoInPop.toString() === ALL.toString()) {
        missedFields = intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', });
      }

      if (moduleInfoInPop.toString() === ALL.toString()) {
        if (missedFields.toString() !== "") {
          missedFields = `${missedFields}, ${intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}`;
        } else {
          missedFields = intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', });
        }
      }

      if (funcInfoInPop.toString() === ALL.toString()) {
        if (missedFields.toString() !== "") {
          missedFields = `${missedFields}, ${intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}`;
        } else {
          missedFields = intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', });
        }
      }
      if (typeof funcInfoInPop === "undefined" || funcInfoInPop === null || funcInfoInPop.toString().trim() === "") {
        if (missedFields.toString() !== "") {
          missedFields = `${missedFields}, ${intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}`;
        } else {
          missedFields = intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', });
        }
      }

      const errMsg = missedFields + intl.formatMessage({ id: 'pages.caseMaintain.addNewComponent.isRequired', });
      message.error(errMsg);
      return false;
    }
    await saveNewAppComponent(appInfoInPop, moduleInfoInPop, funcInfoInPop);
    setAppValInPop(ALL);
    setModuleValInPop(ALL);
    setFuncValInAddPop("");
    setAppInfoInPop(ALL);
    setModuleInfoInPop(ALL);
    setFuncInfoInPop(ALL);
    return true;
  };
  const handleDeleteComponent = async () => {
    if (parseInt(appInfoInPop, 10) === 0) {
      const errMsg = intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', }) + intl.formatMessage({ id: 'pages.caseMaintain.addNewComponent.isRequired', });
      message.error(errMsg);
      return false;
    }
    await deleteAppComponent(appInfoInPop, moduleInfoInPop, funcInfoInPop);
    setAppValInPop(ALL);
    setModuleValInPop(ALL);
    setFuncValInDelPop(ALL);
    setAppInfoInPop(ALL);
    setModuleInfoInPop(ALL);
    setFuncInfoInPop(ALL);
    return true;

  }

  const handleSaveNewCaseSubmit = async (values) => {
    await saveOneCase(values, funcBondInNew);
    return true;
  };

  const checkFunctionIsAvailable = async() =>{
    const func = await getFunctionById(funcBondInNew);
    if(func.success && func.data){
      return true;
    }
    const errMsg = `${intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} [${funcValInNew}] ${intl.formatMessage({ id: 'pages.caseMaintain.create.case.function.notAvailable', })}`;
    message.error(errMsg);
    return false;
  };

  const getModulesByAppId = async (fields) => {
    try {
      const modules2 = await getModules(fields);
      return modules2;
    } catch (err) {
      window.console.log(err);
      return [];
    }
  }

  const getFunctionsByModuleId = async (fields) => {
    try {
      const functions2 = await getFunctions(fields);
      return functions2;
    } catch (err) {
      window.console.log(err);
      return [];
    }
  }

  const handleDropDownChange = async () => {
    const appsVal = await getApps();
    setApps(appsVal.data);
  }

  const handleAppChangeInFuncList = async (value) => {
    const modulesByApp = await getModulesByAppId(value);
    const funcsByModule = await getFunctionsByModuleId(modulesByApp.data[0].id);
    setModules(modulesByApp.data);
    setModuleValInFuncList(modulesByApp.data[0].name);// fill the first value to the next select component
    setFuncs(funcsByModule.data);
    setFuncValInFuncList(funcsByModule.data[0].name);
  };
  const handleAppChangeInNew = async (value) => {
    const modulesByApp = await getModulesByAppId(value);
    const funcsByModule = await getFunctionsByModuleId(modulesByApp.data[0].id);
    const appsVal = await getApps();
    const idx = getIdxInArray(appsVal.data, value);
    setAppValInNew(appsVal.data[idx].name);
    setModulesInNew(modulesByApp.data);
    setModuleValInNew(modulesByApp.data[0].name);// fill the first value to the next select component
    setFuncsInNew(funcsByModule.data);
    setFuncValInNew(funcsByModule.data[0].name);
    setFuncBondInNew(funcsByModule.data[0].id);
  };
  const handleAppChangeInDelPop = async (value) => {
    setAppInfoInPop(value);
    const modulesByApp = await getModulesByAppId(value);
    modulesByApp.data.push({
      id: 0,
      name: ALL
    });
    setModulesInPop(modulesByApp.data);
    setModuleValInPop(ALL);// fill the first value to the next select component
    const funcsByModule = [
      { id: 0, name: ALL },
    ];
    setFuncsInPop(funcsByModule);
    setFuncValInDelPop(ALL);
  };
  const handleAppChangeInAddPop = async (value) => {
    let value1 = "";
    if (typeof value === "undefined" || value === null || value.toString().trim() === "") {
      value1 = "";
      newRecord[0] = 0;
    } else if (value.toString().lastIndexOf(",") === -1) {
      newRecord[0] = 1;
      value1 = value.toString();
    } else {
      value1 = value.toString().substring(value.toString().lastIndexOf(",") + 1);
      newRecord[0] = 1;
    }

    const appsVal = await getApps();
    const idx = getIdxInArray(appsVal.data, value1);
    if (idx !== -1) {
      setAppInfoInPop(value1);
      setAppValInPop(appsVal.data[idx].name);
      const modulesByApp = await getModulesByAppId(value1);
      setModulesInPop(modulesByApp.data);
      setModuleValInPop(modulesByApp.data[0].name);// fill the first value to the next select component
      setModuleInfoInPop(modulesByApp.data[0].id);
    } else {
      newRecord[0] = 2;
      setAppInfoInPop(value1);
      setAppValInPop(value1);
      setModulesInPop(emptyArr.NEW);
      setModuleValInPop(emptyArr.NEW);// fill the first value to the next select component
    }
  };

  const handleModuleChange = async (value) => {
    const funcsByModule = await getFunctionsByModuleId(value);
    setModuleValInFuncList(value);// fill the selected value to the ui
    setFuncs(funcsByModule.data);
    setFuncValInFuncList(funcsByModule.data[0].name);
  };
  const handleModuleChangeAdd = async (value) => {
    const funcsByModule = await getFunctionsByModuleId(value);
    setModuleValInNew(value);// fill the selected value to the ui
    setFuncsInNew(funcsByModule.data);
    setFuncValInNew(funcsByModule.data[0].name);
    setFuncBondInNew(funcsByModule.data[0].id);
  };
  const handleModuleChangeDel = async (value) => {
    setModuleInfoInPop(value);
    if (parseInt(value, 10) === 0) {
      setModuleValInPop(ALL);
      const funcsByModule = [
        { id: 0, name: ALL },
      ];
      setFuncsInPop(funcsByModule);
      setFuncValInDelPop(ALL);
    } else {
      const funcsByModule = await getFunctionsByModuleId(value);
      funcsByModule.data.push({
        id: 0,
        name: ALL
      });
      setModuleValInPop(value);// fill the selected value to the ui
      setFuncsInPop(funcsByModule.data);
      setFuncValInDelPop(funcsByModule.data[funcsByModule.data.length - 1].name);
    }
  };
  const handleModuleChangeInAddPop = async (value) => {
    let value1 = "";
    if (typeof value === "undefined" || value === null || value.toString().trim() === "") {
      value1 = "";
      newRecord[1] = 0;
    } else if (value.toString().lastIndexOf(",") === -1) {
      newRecord[1] = 0;
      value1 = value.toString();
    } else {
      value1 = value.toString().substring(value.toString().lastIndexOf(",") + 1);
      newRecord[1] = 1;
    }

    const idx = getIdxInArray(modulesInPop, value1);
    if (idx !== -1 && newRecord[0] === 1) {
      // app is existed and module is existed
      setModuleInfoInPop(value1);
      setModuleValInPop(modulesInPop[idx].name);// fill the selected value to the ui
    } else if (idx === -1 && newRecord[0] === 1) {
      // app is existed but module is to be added 
      newRecord[1] = 2;
      setModuleInfoInPop(value1);
      setModuleValInPop(value1);// fill the selected value to the ui
    } else if (idx === -1 && newRecord[0] === 2) {
      // app is to be added and module is to be added too
      newRecord[1] = 2;
      setModuleInfoInPop(value1);
      setModuleValInPop(value1);// fill the selected value to the ui
    } else {
      setModuleValInPop(emptyArr.NEW);// fill the selected value to the ui
    }
  };

  const handleFuncChange = value => {
    setFuncValInFuncList(value);
  }
  const handleFuncChangeAdd = value => {
    setFuncValInNew(value);
    setFuncBondInNew(value);
  }
  const handleFuncChangeDel = value => {
    setFuncValInDelPop(value);
    setFuncInfoInPop(value);
  }
  const handleFuncChangeInAddPop = (e) => {
    setFuncInfoInPop(e.target.value);
  }
  const [createModalVisible, handleNewModalVisible] = useState(false);
  const [delModalVisible, handleDelModalVisible] = useState(false);
  // const actionRef = useRef();

  const handleOpenNew = async () => {
    const appsInPopAdd = await getApps();
    setAppsInPop(appsInPopAdd.data);
    handleNewModalVisible(true);
  };

  const handleOpenDel = async () => {
    const appsInPopDel = await getApps();
    setAppsInPop(appsInPopDel.data);
    setAppInfoInPop(0);
    setModuleInfoInPop(0);
    setFuncInfoInPop(0);
    handleDelModalVisible(true);
  }

  const StepDescriptions = ({ bordered }) => {
    return (
      <Descriptions column={1} bordered={bordered}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}> {appValInNew}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}> {moduleValInNew}</Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}> {funcValInNew}</Descriptions.Item>
      </Descriptions>
    );
  };

  const [current, setCurrent] = useState(0);
  const formRef = useRef();

  return (
    <>
      <Card title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.funcFetch', })} className={styles.card} bordered={false}>
        <Row gutter={[24, 32]} style={{ marginTop: 8 }}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}>
              <Select id="funcListApp" defaultValue={appValInFuncList} style={{ width: '90%' }} onChange={handleAppChangeInFuncList} onDropdownVisibleChange={handleDropDownChange}>
                {apps && apps.map((app) => (
                  <Option key={app.id} label={app.id}>{app.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2, }} lg={{ pan: 8, }} md={{ span: 12, }} sm={24}>
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} >
              <Select id="funcListModule" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} style={{ width: '100%' }} value={moduleValInFuncList} onChange={handleModuleChange}>
                {modules && modules.map((mde) => (
                  <Option key={mde.id} label={mde.id}>{mde.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2, }} lg={{ span: 10, }} md={{ span: 24, }} sm={24} >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} >
              <Select id="funcListFunc" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} style={{ width: '100%' }} value={funcValInFuncList} onChange={handleFuncChange}>
                {funcs && funcs.map((fcs) => (
                  <Option key={fcs.id} label={fcs.id}>{fcs.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 32]} style={{ marginTop: 40 }}>
          <Col lg={6} md={12} sm={24}>
            <Button id="createNewComponentBtn" type="primary" onClick={() => { handleOpenNew(); }} >
              <PlusOutlined /> {intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button id="delComponentBtn" type="default" danger onClick={() => { handleOpenDel(); }} >
              <DeleteOutlined /> {intl.formatMessage({ id: 'pages.caseMaintain.action.delete', })}
            </Button>
          </Col>
        </Row>
        <ModalForm title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.newFunc', })} width="400px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
          onFinish={async (value) => {
            const success = await handleAddNewComponent(value);

            if (success) {
              handleNewModalVisible(false);
              return true;
            }

            return false;
          }}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setAppValInPop(ALL);
              setModuleValInPop(ALL);
              setFuncValInAddPop("");
              setAppsInPop([]);
              setAppInfoInPop(ALL);
              setModuleInfoInPop(ALL);
              setFuncInfoInPop(ALL);
              setModulesInPop([]);
            },
          }}
        >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a module' }]}>
            <Select id="addNewApp" showSearch name="addNewApp" mode="tags" style={{ width: '100%' }} placeholder="Please select a app" value={appValInPop} onChange={handleAppChangeInAddPop}>
              {appsInPop && appsInPop.map((app) => (
                <Option key={app.id} label={app.id}>{app.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} required={true} rules={[{ required: true, message: 'Please select a module' }]}>
            <Select id="addNewModule" name="addNewModule" mode="tags" style={{ width: '100%' }} placeholder="Please select a module" value={moduleValInPop} onChange={handleModuleChangeInAddPop}>
              {modulesInPop && modulesInPop.map(mde => (
                <Option key={mde.id} label={mde.id}>{mde.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} required={true} rules={[{ required: true, message: 'Please select a module' }]}>
            <Input id="addNewFunc" name="addNewFunc" style={{ width: '100%' }} placeholder="Please input a function" defaultValue={funcValInAddPop} onChange={handleFuncChangeInAddPop}></Input>
          </Form.Item>
        </ModalForm>
        <ModalForm title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.delunc', })} preserve={false} width="400px" visible={delModalVisible} onVisibleChange={handleDelModalVisible}
          submitter={{
            resetButtonProps: {
              style: {
                color: "#fff",
                borderColor: "#1890ff",
                background: "#1890ff",
              },
            },
            submitButtonProps: {
              style: {
                color: "#ff4d4f",
                borderColor: "#ff4d4f",
                background: "#fff",
              },
            },
          }}
          onFinish={async (values) => {
            const success = await handleDeleteComponent(values);
            if (success) {
              setAppValInFuncList(ALL);
              setModuleValInFuncList(ALL);
              setFuncValInFuncList(ALL);
              handleNewModalVisible(false);
              return true;
            }
            return false;
          }}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setAppValInPop(ALL);
              setModuleValInPop(ALL);
              setFuncValInDelPop(ALL);
              setAppsInPop([]);
              setModulesInPop([]);
              setFuncsInPop([]);
              setAppInfoInPop(0);
              setModuleInfoInPop(0);
              setFuncInfoInPop(0);
            },
          }}
        >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
            <Select id="deleteApp" showSearch style={{ width: '100%' }} placeholder="Please select a app" optionFilterProp="children" defaultValue={appValInPop} onChange={handleAppChangeInDelPop}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {appsInPop && appsInPop.map((app) => (
                <Option key={app.id} label={app.id}>{app.name}</Option>
              ))}
            </Select>
          </Form.Item >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} required={true} rules={[{ required: true, message: 'Please select a module' }]}>
            <Select id="deleteModule" showSearch style={{ width: '100%' }} placeholder="Please select a module" optionFilterProp="children" value={moduleValInPop} onChange={handleModuleChangeDel}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {modulesInPop && modulesInPop.map((mde) => (
                <Option key={mde.id} label={mde.id}>{mde.name}</Option>
              ))}
            </Select>
          </Form.Item >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
            <Select id="deleteFunc" showSearch style={{ width: '10s0%' }} placeholder="Please select a function" optionFilterProp="children" value={funcValInDelPop} onChange={handleFuncChangeDel}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {funcsInPop && funcsInPop.map((fcs) => (
                <Option key={fcs.id} label={fcs.id}>{fcs.name}</Option>
              ))}
            </Select>
          </Form.Item >
        </ModalForm>
      </Card>
      <Card style={{ marginTop: 24, }} bordered={false} bodyStyle={{ padding: '8px 32px 32px 32px', }}>
        <StepsForm current={current} onCurrentChange={setCurrent}
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
        >
          <StepsForm.StepForm
            formRef={formRef}
            title={intl.formatMessage({ id: 'pages.caseMaintain.create.case.function.selection', })}
            // initialValues={stepData}
            onFinish={async () => {
              const success = await checkFunctionIsAvailable();
              if (success) {
                return true;
              }
              return false;
            }}
          >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
              <Select id="singleCaseNewListApp" showSearch style={{ width: '100%' }} placeholder="Please select a app" optionFilterProp="children" value={appValInNew} onChange={handleAppChangeInNew} onDropdownVisibleChange={handleDropDownChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {apps && apps.map((app) => (
                  <Option key={app.id} label={app.id}>{app.name}</Option>
                ))}
              </Select>
            </Form.Item >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} required={true} rules={[{ required: true, message: 'Please select a module' }]}>
              <Select id="singleCaseNewListModule" showSearch style={{ width: '100%' }} placeholder="Please select a module" optionFilterProp="children" value={moduleValInNew} onChange={handleModuleChangeAdd}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {modulesInNew && modulesInNew.map((mde) => (
                  <Option key={mde.id} label={mde.id}>{mde.name}</Option>
                ))}
              </Select>
            </Form.Item >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Select id="singleCaseNewListFunc" showSearch style={{ width: '100%' }} placeholder="Please select a function" optionFilterProp="children" value={funcValInNew} onChange={handleFuncChangeAdd}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              >
                {funcsInNew && funcsInNew.map((fcs) => (
                  <Option key={fcs.id} label={fcs.id}>{fcs.name}</Option>
                ))}
              </Select>
            </Form.Item >
          </StepsForm.StepForm>
          <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.caseMaintain.create.case.caseInfo.complete', })}>
            <div className={styles.result}>
              <StepDescriptions bordered />
              <Divider
                style={{
                  margin: '24px 0',
                }}
              />
            </div>
            <Form.Item name="caseNameForm" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Input id="caseName"></Input>
            </Form.Item >

            <Form.Item name="caseDesriptionForm" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.description', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <TextArea id="caseDesription"></TextArea>
            </Form.Item >

            <Form.Item name="caseStepsForm" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <TextArea id="caseSteps"></TextArea>
            </Form.Item >

            <Form.Item name="caseExpectedRsForm" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.result', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <TextArea id="caseExpectedRs"></TextArea>
            </Form.Item >
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </>
  );
};

export default SingleForm;
