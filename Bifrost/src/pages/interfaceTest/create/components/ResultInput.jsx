import React from 'react';
import { useIntl } from 'umi';
import { ProFormTextArea } from '@ant-design/pro-form';
import { Select, Form } from 'antd';
import { getDBConnByAppId } from '@/services/backend/dbConn';

const { Option } = Select;

const ResultInput = (props) => {
  const intl = useIntl();

  const { showResultJson, showDBSerial, appId } = props;

  const [dbConns, setDBConns] = React.useState([]);
  let component = '';

  const loadingDBConn = async () => {
    const dbConnInfo = await getDBConnByAppId(appId);
    setDBConns(dbConnInfo.data);
  }

  if (showDBSerial && showResultJson) {
    component = '';
  } else if (showResultJson) {
    component = <><Form.Item name="caseDBConn" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbConnection', })} rules={[{ required: true, message: 'Please select a db connection!' }]}>
      <Select id="apiSelected" showSearch style={{ width: '100%' }} placeholder="Please select a db connection" optionFilterProp="children" onDropdownVisibleChange={loadingDBConn}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
      >
        {dbConns && dbConns.map((dbConn) => (
          <Option key={dbConn.id} label={dbConn.id}>{dbConn.name}</Option>
        ))}
      </Select>
    </Form.Item>
      <Form.Item name="caseDBSQL" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.dbSQL', })} rules={[{ required: true, message: 'Please input a sql!' }]}>
        <ProFormTextArea name="caseDBSQL" id="caseDBSQL" fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        ></ProFormTextArea>
      </Form.Item></>
  } else {
    component = <Form.Item name="caseResult" label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result', })} rules={[{ required: true, message: 'Please input a result!' }]}>
      <ProFormTextArea name="caseResult" id="caseResult" fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
      ></ProFormTextArea>
    </Form.Item>
  }
  return (
    component
  );
};

export default ResultInput;