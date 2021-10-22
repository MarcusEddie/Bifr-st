
import { StepsForm } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, message } from 'antd';
import { useIntl } from 'umi';
import { saveDBConn } from '@/services/backend/dbConn';
import { getDBType } from '@/services/backend/generalApis';
import { getApps, getAppById } from '@/services/backend/app';
import MySQL from './MySQL';
import HANA from './HANA';

const { Option } = Select;

const AddOneDBConn = () => {
  const intl = useIntl();
  const ALL = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', });
  const [current, setCurrent] = useState(0);
  const formRef = useRef();

  const [apps, setApps] = React.useState([]);
  const [dbTypes, setDbTypes] = React.useState([]);
  const [components, setComponents] = useState(undefined);
  const [appVal, setAppVal] = React.useState(ALL);
  const [dbType, setDbType] = React.useState(ALL);
  // eslint-disable-next-line no-unused-vars
  const [connectionParams, setConnectionParams] = React.useState([]);
  const [formItem, setFormItems] = React.useState(undefined);

  const handleDropDownChange = async () => {
    const appsVal = await getApps();
    setApps(appsVal.data);
  }

  const handleDBTypeDropDownChange = async () => {
    const rs = [];
    const states = await getDBType();
    if (states && states.data) {
      for (let i = 0; i < states.data.length; i += 1) {
        if (states.data[i].toString() !== 'all') {
          rs.push({ id: states.data[i], name: states.data[i] });
        }
      }
    }

    setDbTypes(rs);
  }

  const handleAppChange = async (value) => {
    setAppVal(value);
  };

  const handleDbTypeChange = async (value) => {
    setDbType(value);// fill the selected value to the ui
    let dbPanel;
    if (value === 'MySQL') {
      dbPanel = <MySQL syncData={setConnectionParams} dbType={value} onRef={setFormItems}></MySQL>
    } else if (value === 'HANA') {
      dbPanel = <HANA syncData={setConnectionParams} dbType={value} onRef={setFormItems}></HANA>
    }

    setComponents(dbPanel);
  };

  const isSelectedAppAvailable = async (apPId) => {
    const queryRs = await getAppById(apPId);
    if (queryRs && queryRs.data) {
      return true;
    }

    return false;
  }

  const isSelectedAppStructureAvailable = async () => {
    const availableFlag = await isSelectedAppAvailable(appVal);
    if (!availableFlag) {
      message.error('The selected app is unavailable, check it please');
      return false;
    }
    return true;
  }

  const handleSaveNewCaseSubmit = async (values) => {
    const vals = await formItem.validateFields();
    isSelectedAppStructureAvailable();

    const detailsObj = Object.create(null);
    detailsObj.name = vals.dbName;
    detailsObj.url = vals.URL;
    detailsObj.userName = vals.userName;
    detailsObj.password = vals.password;

    const rs = await saveDBConn(values, detailsObj);
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
          setFormItems(undefined);
          setAppVal(ALL);
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.db.app.selection', })}
        onFinish={async (values) => {
          const success = await isSelectedAppStructureAvailable(values);
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item name="app" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
          <Select id="app" name="app" showSearch style={{ width: '100%' }} placeholder="请选择" optionFilterProp="children" defaultValue={appVal} onChange={handleAppChange} onDropdownVisibleChange={handleDropDownChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {apps && apps.map((app) => (
              <Option key={app.id} label={app.id}>{app.name}</Option>
            ))}
          </Select>
        </Form.Item >
        <Form.Item name="dbType" label={intl.formatMessage({ id: 'pages.interfaceTest.db.type', })} required={true} rules={[{ required: true, message: 'Please select a app' }]}>
          <Select id="dbType" name="dbType" showSearch style={{ width: '100%' }} placeholder="请选择" optionFilterProp="children" defaultValue={dbType} onChange={handleDbTypeChange} onDropdownVisibleChange={handleDBTypeDropDownChange}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          >
            {dbTypes && dbTypes.map((dt) => (
              <Option key={dt.id} label={dt.id}>{dt.name}</Option>
            ))}
          </Select>
        </Form.Item >
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.db.connection.details.setup', })} style={{ height: 750 }}>
        {components}
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddOneDBConn;