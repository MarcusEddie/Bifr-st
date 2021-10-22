
import { StepsForm } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, message } from 'antd';
import { useIntl } from 'umi';
import { updateDBConn } from '@/services/backend/dbConn';
import { getDBType } from '@/services/backend/generalApis';
import UpdateHANA from './UpdateHANA';
import UpdateMySQL from './UpdateMySQL';
import MySQL from './MySQL';
import HANA from './HANA';

import { isNotBlank } from '@/utils/StringUtils';

const { Option } = Select;

const UpdateDBConnDetails = (props) => {
  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  const { data } = props;
  const urlRootMySql = 'jdbc:mysql://';
  const urlRootHANA = 'jdbc:sap://';
  const [apps, setApps] = React.useState([]);
  const [dbTypes, setDbTypes] = React.useState([]);
  const [components, setComponents] = useState(undefined);
  const [dbTypeOriginal, setDbTypeOriginal] = React.useState(data.dbType);
  // eslint-disable-next-line no-unused-vars
  const [connectionParams, setConnectionParams] = React.useState([]);
  const [dbTypeChanged, setDbTypeChanged] = React.useState(false);
  const [formItem, setFormItems] = React.useState(undefined);

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

  const handleDbTypeChange = async (value) => {
    // setDbTypeOriginal(value);// fill the selected value to the ui
    let dbPanel;
    const obj = Object.create(null);
    obj.name = data.name;
    let fullUri = data.url;
    obj.userName = data.userName;
    if (value === dbTypeOriginal) {
      setDbTypeChanged(false);
      if (value === 'MySQL') {
        if (isNotBlank(fullUri)) {
          const spliterRight = fullUri.lastIndexOf(":");
          const spliterLeft = fullUri.lastIndexOf("//");
          obj.url = fullUri;
          obj.host = fullUri.substring(spliterLeft + 2, spliterRight);
          fullUri = fullUri.substring(spliterRight + 1);
          const dbIdx = fullUri.lastIndexOf("/");
          obj.port = fullUri.substring(0, dbIdx);
          obj.db = fullUri.substring(dbIdx + 1);
        } else {
          obj.url = urlRootMySql;
          obj.port = 3306;
          obj.db = '';
        }
        dbPanel = <UpdateMySQL data={obj} syncData={setConnectionParams} dbType={value}  onRef={setFormItems}></UpdateMySQL>
      } else if (value === 'HANA') {
        if (isNotBlank(fullUri)) {
          const spliterRight = fullUri.lastIndexOf(":");
          const spliterLeft = fullUri.lastIndexOf("//");
          obj.url = fullUri;
          obj.host = fullUri.substring(spliterLeft + 2, spliterRight);
          obj.port = fullUri.substring(spliterRight + 1);
        } else {
          obj.url = urlRootHANA;
          obj.port = 30015;
        }
        dbPanel = <UpdateHANA data={obj} syncData={setConnectionParams} dbType={value}  onRef={setFormItems}></UpdateHANA>
      }
      setComponents(dbPanel);
    } else {
      setDbTypeChanged(true);
      if (value === 'MySQL') {
        dbPanel = <MySQL syncData={setConnectionParams} dbType={value} onRef={setFormItems}></MySQL>
      } else if (value === 'HANA') {
        dbPanel = <HANA syncData={setConnectionParams} dbType={value} onRef={setFormItems}></HANA>
      }
      setComponents(dbPanel);
    }

    return true;
  };

  // eslint-disable-next-line no-unused-vars
  const handleAppChange = async (value) => {
    // handleDbTypeChange(data.dbType);
  };

  const handleUpdateDBConnInfo = async (values) => {
    const vals = await formItem.validateFields();
    const detailsObj = Object.create(null);
    detailsObj.name = vals.dbName;
    detailsObj.url = vals.URL;
    detailsObj.userName = vals.userName;
    detailsObj.password = vals.password;

    const rs = await updateDBConn(data.id, values, detailsObj);
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
        const success = await handleUpdateDBConnInfo(values);
        if (success) {
          setFormItems(undefined);
          props.onSubmit();
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.interfaceTest.db.app.selection', })}
        onFinish={async (values) => {
          let success;
          if (dbTypeChanged) {
            success = await handleDbTypeChange(values.dbType);
          } else {
            success = await handleDbTypeChange(data.dbType);
          }
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item name="app" label={intl.formatMessage({ id: 'pages.caseMaintain.create.single.app', })} initialValue={data.appName}>
          <Select id="app" name="app" showSearch style={{ width: '100%' }} placeholder="请选择" optionFilterProp="children" disabled={true} onChange={handleAppChange}
          >
            {apps && apps.map((app) => (
              <Option key={app.id} label={app.id}>{app.name}</Option>
            ))}
          </Select>
        </Form.Item >
        <Form.Item name="dbType" label={intl.formatMessage({ id: 'pages.interfaceTest.db.type', })} required={true} rules={[{ required: true, message: 'Please select a app' }]} initialValue={data.dbType}>
          <Select id="dbType" name="dbType" showSearch style={{ width: '100%' }} placeholder="请选择" optionFilterProp="children" onChange={handleDbTypeChange} onDropdownVisibleChange={handleDBTypeDropDownChange}
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

export default UpdateDBConnDetails;