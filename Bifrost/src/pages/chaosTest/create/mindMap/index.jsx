import { Card, Col, Row, Select, Form, message, Typography } from 'antd';
import React from 'react';
import GGEditor, { Mind } from 'gg-editor';
import { MindToolbar } from './components/EditorToolbar';
import { MindContextMenu } from './components/EditorContextMenu';
import { useIntl } from 'umi';
import styles from './style.less';
import { getFunctions, getFunctionById, getModules, getApps } from '@/services/backend/app';
import Save from './components/SaveButton';
import mockData from './mockData.json';

const { Paragraph } = Typography;

const { Option } = Select;

const MindMap = () => {
  const intl = useIntl();
  const ALL = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
  const [apps, setApps] = React.useState([]);
  // 脑图的apps的defaultvalue变成了ALL，看下有没有什么问题，因为原来的值的set方法没用，所以用ALL替换
  // const [appValInFuncList, setAppValInFuncList] = React.useState(ALL);
  const [modules, setModules] = React.useState([]);
  const [moduleValInFuncList, setModuleValInFuncList] = React.useState(ALL);
  const [funcs, setFuncs] = React.useState([]);
  const [funcValInFuncList, setFuncValInFuncList] = React.useState(ALL);
  const [funcIdSelected, setFuncIdSelected] = React.useState(0);

  const initRoot = mockData;

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
    // window.console.log(`selected function id is ${funcsByModule.data[0].id}`);
    setFuncIdSelected(funcsByModule.data[0].id);
  };

  const handleModuleChange = async (value) => {
    const funcsByModule = await getFunctionsByModuleId(value);
    setModuleValInFuncList(value);// fill the selected value to the ui
    setFuncs(funcsByModule.data);
    setFuncValInFuncList(funcsByModule.data[0].name);
    // window.console.log(`selected function id is ${funcsByModule.data[0].id}`);
    setFuncIdSelected(funcsByModule.data[0].id);
  };

  const handleFuncChange = async (value) => {
    const func = await getFunctionById(value);
    if (func && func.data) {
      setFuncValInFuncList(func.data.name);
      // window.console.log(`selected function id is ${func.data.id}`);
      setFuncIdSelected(func.data.id);
    } else {
      const errMsg = `${intl.formatMessage({ id: 'pages.caseMaintain.create.case.current.selected', })}${intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} ${intl.formatMessage({ id: 'pages.caseMaintain.create.case.function.notAvailable', })}`;
      message.error(errMsg);
    }
  }

  return (
    <>
      <Card title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.funcFetch', })} className={styles.card} bordered={false}>
        <Row gutter={[24, 32]} style={{ marginTop: 8 }}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })}>
              {/* <Select id="funcListApp" defaultValue={appValInFuncList} style={{ width: '90%' }} onChange={handleAppChangeInFuncList} onDropdownVisibleChange={handleDropDownChange}> */}
              <Select id="funcListApp" defaultValue={ALL} style={{ width: '90%' }} onChange={handleAppChangeInFuncList} onDropdownVisibleChange={handleDropDownChange}>
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
          <Col >
            <Paragraph copyable={{ tooltips: ['click here', 'you clicked!!'], text: funcValInFuncList, }}>
              {intl.formatMessage({ id: 'pages.caseMaintain.create.mind.copyFuncVal', })}
            </Paragraph>
          </Col>
        </Row>
      </Card>
      <Card className={styles.card} bordered={false} style={{ marginTop: 24, }} bodyStyle={{ padding: '8px 32px 32px 32px', }}>
        <GGEditor className={styles.editor}>
          <Row className={styles.editorHd}>
            <Col span={24}>
              <MindToolbar />
            </Col>
          </Row>
          <Row className={styles.editorBd}>
            <Col span={24} className={styles.editorContent}>
              <Mind data={initRoot} className={styles.mind} />
            </Col>
          </Row>
          <MindContextMenu />
          <Save submitBtnName={intl.formatMessage({ id: 'pages.caseMaintain.action.new', })} resetBtnName={intl.formatMessage({ id: 'pages.caseMaintain.create.case.cancel', })}
            successMsg={intl.formatMessage({ id: 'pages.caseMaintain.create.mind.batchMode.success', })} failedMsg={intl.formatMessage({ id: 'pages.caseMaintain.create.mind.batchMode.fail', })} initVal={intl.formatMessage({ id: 'pages.caseMaintain.create.mind.batchMode.initVal', })} 
            functionId={funcIdSelected}/>
        </GGEditor>
      </Card>
    </>
  );
};

export default MindMap;