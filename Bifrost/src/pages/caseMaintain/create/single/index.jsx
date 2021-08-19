import ProForm, { ModalForm, ProFormTextArea, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, Row, message, Select, Form, Spin } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
// import { getSystems, getSystems2 } from './service';
// import { useRequest } from 'ahooks';
// import jsonp from 'fetch-jsonp';
// import querystring from 'querystring';
// import debounce from 'lodash/debounce';

export const waitTime = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// function fetchUserList2(username) {
//   console.log('fetching user', username);
//   return fetch('https://randomuser.me/api/?results=5')
//     .then((response) => response.json())
//     .then((body) =>
//       body.results.map((user) => ({
//         label: `${user.name.first} ${user.name.last}`,
//         value: user.login.username,
//       })),
//     );
// }

// function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
//   // const [fetching, setFetching] = React.useState(false);
//   // const [options, setOptions] = React.useState([]);
//   // const fetchRef = React.useRef(0);
//   // const debounceFetcher = React.useMemo(() => {
//   //   const loadOptions = (value) => {
//   //     fetchRef.current += 1;
//   //     const fetchId = fetchRef.current;
//   //     setOptions([]);
//   //     setFetching(true);
//   //     fetchOptions(value).then((newOptions) => {
//   //       if (fetchId !== fetchRef.current) {
//   //         // for fetch callback order
//   //         return;
//   //       }

//   //       setOptions(newOptions);
//   //       setFetching(false);
//   //     });
//   //   };

//   //   return debounce(loadOptions, debounceTimeout);
//   // }, [fetchOptions, debounceTimeout]);
//   // return (
//   //   <Select
//   //     labelInValue
//   //     filterOption={false}
//   //     onSearch={debounceFetcher}
//   //     notFoundContent={fetching ? <Spin size="small" /> : null}
//   //     {...props}
//   //     options={options}
//   //   />
//   // );
//   fetchUserList2("sd");
// } // Usage of DebounceSelect

// async function fetchUserList(username) {
//   console.log('fetching user', username);
//   return fetch('https://randomuser.me/api/?results=5')
//     .then((response) => response.json())
//     .then((body) =>
//       body.results.map((user) => ({
//         label: `${user.name.first} ${user.name.last}`,
//         value: user.login.username,
//       })),
//     );
// }

const { Option } = Select;

const systemData = ['yong hu guan li', 'guang gao toufang guan li', 'shang pin guan li', 'ding dan guan li', 'zhi fu guan li'];
const moduleData = {
  'yong hu guan li': ['yong hu mo kuai 1', 'yong hu mo kuai 2', 'yong hu mo kuai 3', 'yong hu mo kuai 4', 'yong hu mo kuai 5'],
  'guang gao toufang guan li': ['guang gao toufang mo kuai 1', 'guang gao toufang mo kuai 2', 'guang gao toufang mo kuai 3', 'guang gao toufang mo kuai 4', 'guang gao toufang mo kuai 5'],
  'shang pin guan li': ['shang pin mo kuai 1', 'shang pin mo kuai 2', 'shang pin mo kuai 3', 'shang pin mo kuai 4', 'shang pin mo kuai 5'],
  'ding dan guan li': ['ding dan mo kuai 1', 'ding dan mo kuai 2', 'ding dan mo kuai 3', 'ding dan mo kuai 4', 'ding dan mo kuai 5'],
  'zhi fu guan li': ['zhi fu mo kuai 1', 'zhi fu mo kuai 2', 'zhi fu mo kuai 3', 'zhi fu mo kuai 4', 'zhi fu mo kuai 5'],
};
const funcData = {
  'yong hu mo kuai 1': ['yong hu gong neng 11', 'yong hu gong neng 12', 'yong hu gong neng 13', 'yong hu gong neng 14', 'yong hu gong neng 15'],
  'yong hu mo kuai 2': ['yong hu gong neng 21', 'yong hu gong neng 22', 'yong hu gong neng 23', 'yong hu gong neng 24', 'yong hu gong neng 25'],
  'yong hu mo kuai 3': ['yong hu gong neng 31', 'yong hu gong neng 32', 'yong hu gong neng 33', 'yong hu gong neng 34', 'yong hu gong neng 35'],
  'yong hu mo kuai 4': ['yong hu gong neng 41', 'yong hu gong neng 42', 'yong hu gong neng 43', 'yong hu gong neng 44', 'yong hu gong neng 45'],
  'yong hu mo kuai 5': ['yong hu gong neng 51', 'yong hu gong neng 52', 'yong hu gong neng 53', 'yong hu gong neng 54', 'yong hu gong neng 55'],
  'guang gao toufang mo kuai 1': ['guang gao toufang  gong neng 11', 'guang gao toufang  gong neng 12', 'guang gao toufang  gong neng 13', 'guang gao toufang  gong neng 14', 'guang gao toufang  gong neng 15'],
  'guang gao toufang mo kuai 2': ['guang gao toufang  gong neng 21', 'guang gao toufang  gong neng 22', 'guang gao toufang  gong neng 23', 'guang gao toufang  gong neng 24', 'guang gao toufang  gong neng 25'],
  'guang gao toufang mo kuai 3': ['guang gao toufang  gong neng 31', 'guang gao toufang  gong neng 32', 'guang gao toufang  gong neng 33', 'guang gao toufang  gong neng 34', 'guang gao toufang  gong neng 35'],
  'guang gao toufang mo kuai 4': ['guang gao toufang  gong neng 41', 'guang gao toufang  gong neng 42', 'guang gao toufang  gong neng 43', 'guang gao toufang  gong neng 44', 'guang gao toufang  gong neng 45'],
  'guang gao toufang mo kuai 5': ['guang gao toufang  gong neng 51', 'guang gao toufang  gong neng 52', 'guang gao toufang  gong neng 53', 'guang gao toufang  gong neng 54', 'guang gao toufang  gong neng 55'],
  'shang pin mo kuai 1': ['shang pin gong neng 11', 'shang pin gong neng 12', 'shang pin gong neng 13', 'shang pin gong neng 14', 'shang pin gong neng 15'],
  'shang pin mo kuai 2': ['shang pin gong neng 21', 'shang pin gong neng 22', 'shang pin gong neng 23', 'shang pin gong neng 24', 'shang pin gong neng 25'],
  'shang pin mo kuai 3': ['shang pin gong neng 31', 'shang pin gong neng 32', 'shang pin gong neng 33', 'shang pin gong neng 34', 'shang pin gong neng 35'],
  'shang pin mo kuai 4': ['shang pin gong neng 41', 'shang pin gong neng 42', 'shang pin gong neng 43', 'shang pin gong neng 44', 'shang pin gong neng 45'],
  'shang pin mo kuai 5': ['shang pin gong neng 51', 'shang pin gong neng 52', 'shang pin gong neng 53', 'shang pin gong neng 54', 'shang pin gong neng 55'],
  'ding dan mo kuai 1': ['ding dan gong neng 11', 'ding dan gong neng 12', 'ding dan gong neng 13', 'ding dan gong neng 14', 'ding dan gong neng 15'],
  'ding dan mo kuai 2': ['ding dan gong neng 21', 'ding dan gong neng 22', 'ding dan gong neng 23', 'ding dan gong neng 24', 'ding dan gong neng 25'],
  'ding dan mo kuai 3': ['ding dan gong neng 31', 'ding dan gong neng 32', 'ding dan gong neng 33', 'ding dan gong neng 34', 'ding dan gong neng 35'],
  'ding dan mo kuai 4': ['ding dan gong neng 41', 'ding dan gong neng 42', 'ding dan gong neng 43', 'ding dan gong neng 44', 'ding dan gong neng 45'],
  'ding dan mo kuai 5': ['ding dan gong neng 51', 'ding dan gong neng 52', 'ding dan gong neng 53', 'ding dan gong neng 54', 'ding dan gong neng 55'],
  'zhi fu mo kuai 1': ['zhi fu gong neng 11', 'zhi fu gong neng 12', 'zhi fu gong neng 13', 'zhi fu gong neng 14', 'zhi fu gong neng 15'],
  'zhi fu mo kuai 2': ['zhi fu gong neng 21', 'zhi fu gong neng 22', 'zhi fu gong neng 23', 'zhi fu gong neng 24', 'zhi fu gong neng 25'],
  'zhi fu mo kuai 3': ['zhi fu gong neng 31', 'zhi fu gong neng 32', 'zhi fu gong neng 33', 'zhi fu gong neng 34', 'zhi fu gong neng 35'],
  'zhi fu mo kuai 4': ['zhi fu gong neng 41', 'zhi fu gong neng 42', 'zhi fu gong neng 43', 'zhi fu gong neng 44', 'zhi fu gong neng 45'],
  'zhi fu mo kuai 5': ['zhi fu gong neng 51', 'zhi fu gong neng 52', 'zhi fu gong neng 53', 'zhi fu gong neng 54', 'zhi fu gong neng 55'],
}
const emptyArr = {
  'NEW': ['NEW'],
};
function getIdxInArray(arr, obj) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] === obj) {
      return i;
    }
  }
  return -1;
}

let timeout;
let currentValue;


const newRecord = [0, 0, 0];

const SingleForm = () => {
  const [secondSystem12, setSecondSystem12] = React.useState(systemData[0]);
  const [modules12, setModules12] = React.useState(moduleData[systemData[0]]);
  const [secondModule12, setSecondModule12] = React.useState(moduleData[systemData[0]][0]);
  const [funcs12, setFuncs12] = React.useState(funcData[moduleData[systemData[0]][0]]);
  const [secondFunc12, setSecondFunc12] = React.useState(funcData[moduleData[systemData[0]][0]][0]);

  const [adaNewSystemVal, setAdaNewSystemVal] = React.useState(systemData[0]);
  const [adaNewModuleVal, setAdaNewModuleVal] = React.useState(moduleData[systemData[0]][0]);
  const [adaNewFuncVal, setAdaNewFuncVal] = React.useState(funcData[moduleData[systemData[0]][0]][0]);
  const handleAdd = async (fields) => {
    console.log(`add new rule 2 ${adaNewSystemVal} : ${adaNewModuleVal} : ${adaNewFuncVal}`);
    setSecondSystem12(systemData[0]);
    setSecondModule12(moduleData[systemData[0]][0]);
    setSecondFunc12(funcData[moduleData[systemData[0]][0]][0]);
  };

  const intl = useIntl();

  const onFinish = async (values) => {
    run(values);
  };

  const [funcListSystemVal, setfuncListSystemVal] = React.useState(systemData[0]);
  const [funcListModuleVal, setfuncListModuleval] = React.useState(moduleData[systemData[0]][0]);
  const [funcListFuncVal, setfuncListFuncVal] = React.useState(funcData[moduleData[systemData[0]][0]][0]);

  const [modules, setModules] = React.useState(moduleData[systemData[0]]);
  const [secondModule, setSecondModule] = React.useState(moduleData[systemData[0]][0]);
  const [funcs, setFuncs] = React.useState(funcData[moduleData[systemData[0]][0]]);
  const [secondFunc, setSecondFunc] = React.useState(funcData[moduleData[systemData[0]][0]][0]);

  const handleSystemChange = value => {
    setModules(moduleData[value]);
    setSecondModule(moduleData[value][0]);// fill the first value to the next select component
    setSecondFunc(funcData[moduleData[value][0]][0]);

    setfuncListSystemVal(value);
    setfuncListModuleval(moduleData[value][0]);
    setfuncListFuncVal(funcData[moduleData[value][0]][0]);
  };

  const handleModuleChange = value => {
    setSecondModule(value);// fill the selected value to the ui
    setFuncs(funcData[value]);
    setSecondFunc(funcData[value][0]);

    setfuncListModuleval(value);
    setfuncListFuncVal(funcData[value][0]);
  };

  const handleFuncChange = value => {
    setSecondFunc(value);

    setfuncListFuncVal(value);
  }

  const [modules1, setModules1] = React.useState(moduleData[systemData[0]]);
  const [secondCity1, setSecondModule1] = React.useState(moduleData[systemData[0]][0]);
  const [funcs1, setFuncs1] = React.useState(funcData[moduleData[systemData[0]][0]]);
  const [secondFunc1, setSecondFunc1] = React.useState(funcData[moduleData[systemData[0]][0]][0]);

  const handleSystemChange1 = value => {
    setModules1(moduleData[value]);
    setSecondModule1(moduleData[value][0]);// fill the first value to the next select component
    setSecondFunc1(funcData[moduleData[value][0]][0]);
  };

  const handleModuleChange1 = value => {
    setSecondModule1(value);// fill the selected value to the ui
    setFuncs1(funcData[value]);
    setSecondFunc1(funcData[value][0]);
  };

  const handleFuncChange1 = value => {
    setSecondFunc1(value);
  }

  const handleSystemChange12 = value => {
    let value1 = "";
    if (typeof value === "undefined" || value === null || value.toString().trim() === "") {
      value1 = "";
      newRecord[0] = 0;
    } else if (value.toString().lastIndexOf(",") === -1) {
      newRecord[0] = 0;
      value1 = value.toString();
    } else {
      value1 = value.toString().substring(value.toString().lastIndexOf(",") + 1);
      newRecord[0] = 1;
    }

    if (getIdxInArray(systemData, value1) !== -1) {
      setAdaNewSystemVal(value1);
      setModules12(moduleData[value1]);
      setSecondModule12(moduleData[value1][0]);// fill the first value to the next select component
      setSecondFunc12(funcData[moduleData[value1][0]][0]);
    } else {
      newRecord[0] = 2;
      setModules12(emptyArr.NEW);
      setSecondModule12(emptyArr.NEW);// fill the first value to the next select component
      setSecondFunc12(emptyArr.NEW);
    }

  };

  const handleModuleChange12 = value => {
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
    if (getIdxInArray(moduleData, value1) !== -1 && newRecord[0] !== 2) {
      setAdaNewModuleVal(value1);
      setSecondModule12(value1);// fill the selected value to the ui
      setFuncs12(funcData[value1]);
      setSecondFunc12(funcData[value1][0]);
    } else if (getIdxInArray(moduleData, value1) === -1 && newRecord[0] !== 2) {
      newRecord[1] = 2;
      setAdaNewModuleVal(value1);
      setSecondModule12(value1);// fill the selected value to the ui
      setFuncs12(emptyArr.NEW);
      setSecondFunc12(emptyArr.NEW);
    } else if (getIdxInArray(moduleData, value1) === -1 && newRecord[0] === 2) {
      newRecord[1] = 2;
      setAdaNewModuleVal(value1);
      setSecondModule12(value1);// fill the selected value to the ui
      setFuncs12(emptyArr.NEW);
      setSecondFunc12(emptyArr.NEW);
    } else {
      setSecondModule12(emptyArr.NEW);// fill the selected value to the ui
      setFuncs12(emptyArr.NEW);
      setSecondFunc12(emptyArr.NEW);
    }
  };

  const handleFuncChange12 = value => {
    let value1 = "";
    if (typeof value === "undefined" || value === null || value.toString().trim() === "") {
      value1 = "";
      newRecord[0] = 0;
    } else if (value.toString().lastIndexOf(",") === -1) {
      newRecord[0] = 0;
      value1 = value.toString();
    } else {
      value1 = value.toString().substring(value.toString().lastIndexOf(",") + 1);
      newRecord[0] = 1;
    }
    setAdaNewFuncVal(value1);
    setSecondFunc12(value1);
  }

  const [createModalVisible, handleNewModalVisible] = useState(false);
  const [delModalVisible, handleDelModalVisible] = useState(false);
  const actionRef = useRef();

  return (
    <>
      <Card title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.funcFetch', })} className={styles.card} bordered={false}>
        <Row gutter={[24, 32]} style={{ marginTop: 8 }}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.system', })}>
              <Select id="funcListSystem" defaultValue={systemData[0]} style={{ width: '90%' }} onChange={handleSystemChange}>
                {systemData.map(system => (
                  <Option key={system}>{system}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2, }} lg={{ pan: 8, }} md={{ span: 12, }} sm={24}>
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} >
              <Select id="funcListModule" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} style={{ width: '100%' }} value={secondModule} onChange={handleModuleChange}>
                {modules.map(mde => (
                  <Option key={mde}>{mde}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2, }} lg={{ span: 10, }} md={{ span: 24, }} sm={24} >
            <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} >
              <Select id="funcListFunc" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} style={{ width: '100%' }} value={secondFunc} onChange={handleFuncChange}>
                {funcs.map(fcs => (
                  <Option key={fcs}>{fcs}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 32]} style={{ marginTop: 40 }}>
          <Col lg={6} md={12} sm={24}>
            <Button type="primary" onClick={() => { handleNewModalVisible(true); }} >
              <PlusOutlined /> {intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="default" danger onClick={() => { handleDelModalVisible(true); }} >
              <DeleteOutlined /> {intl.formatMessage({ id: 'pages.caseMaintain.action.delete', })}
            </Button>
          </Col>
        </Row>
        <ModalForm title={intl.formatMessage({ id: 'pages.caseMaintain.create.single.newFunc', })} width="400px" preserve={false} visible={createModalVisible} onVisibleChange={handleNewModalVisible}
          onFinish={async (value) => {
            const success = await handleAdd(value);

            // if (success) {
            //   handleNewModalVisible(false);

            //   if (actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }
            return true;
          }}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setSecondSystem12(systemData[0]);
              setSecondModule12(moduleData[systemData[0]][0]);
              setSecondFunc12(funcData[moduleData[systemData[0]][0]][0]);
            },
          }}
        >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.system', })}>
            <Select showSearch name="addNewSystem" mode="multiple" style={{ width: '100%' }} placeholder="Please select a system" defaultValue={secondSystem12} onChange={handleSystemChange12}>
              {systemData.map(system => (
                <Option key={system}>{system}</Option>
              ))}
            </Select>,

          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}>
            <Select name="addNewModule" mode="tags" style={{ width: '100%' }} placeholder="Please select a module" value={secondModule12} onChange={handleModuleChange12}>
              {modules12.map(mde => (
                <Option key={mde}>{mde}</Option>
              ))}
            </Select>,
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}>
            <Select name="addNewFunc" mode="tags" style={{ width: '100%' }} placeholder="Please select a function" value={secondFunc12} onChange={handleFuncChange12}>
              {funcs12.map(fcs => (
                <Option key={fcs}>{fcs}</Option>
              ))}
            </Select>,
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
            console.log(values);
          }}
        >
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.system', })}>
            <ProFormText id="delSystem" name="delSystemVal" disabled initialValue={funcListSystemVal} />
          </Form.Item>

          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })}>
            <ProFormText id="delModule" name="delModuleVal" initialValue={funcListModuleVal} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })}>
            <ProFormText id="delFunc" name="delFuncVal" initialValue={funcListFuncVal} />
          </Form.Item>
        </ModalForm>
      </Card>
      <Card style={{ marginTop: 24,  }} bordered={false} bodyStyle={{ padding: '8px 32px 32px 32px', }}>
        <ProForm hideRequiredMark style={{ margin: 'auto', marginTop: 8, maxWidth: 600, }} name="pages.caseMaintain.create.single.formName" layout="vertical" onFinish={onFinish}>
          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.system', })} rules={[{ required: true, message: 'Please select a system' },]}>
            <Select showSearch style={{ width: '60%' }} placeholder="Please select a system" optionFilterProp="children" defaultValue={systemData[0]} onChange={handleSystemChange1}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {systemData.map(system => (<Option key={system}>{system}</Option>))}
            </Select>,
          </Form.Item >

          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.module', })} rules={[{ required: true, message: 'Please select a module' },]}>
            <Select showSearch style={{ width: '60%' }} placeholder="Please select a module" optionFilterProp="children" value={secondCity1} onChange={handleModuleChange1}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {modules1.map(mde => (<Option key={mde}>{mde}</Option>))}
            </Select>,
          </Form.Item >

          <Form.Item label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.function', })} rules={[{ required: true, message: 'Please select your function!' },]}>
            <Select showSearch style={{ width: '60%' }} placeholder="Please select a function" optionFilterProp="children" value={secondFunc1} onChange={handleFuncChange1}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {funcs1.map(fcs => (<Option key={fcs}>{fcs}</Option>))}
            </Select>,
          </Form.Item >
        </ProForm>
      </Card>
    </>
  );
};

export default SingleForm;
