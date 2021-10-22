
import React from 'react';
import { Form, Col, Row, Input, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { dbConnectionTest } from '@/services/backend/dbConn'
import { isNotBlank } from '@/utils/StringUtils';

const MySQL = (props) => {
  props.onRef(this);

  const intl = useIntl();
  const urlRoot = 'jdbc:mysql://';
  const defaultPort = 3306;
  const [form] = Form.useForm();
  props.onRef(form);

  const dbConnTest = async () => {
    const success = await dbConnectionTest(form.getFieldValue('URL'), form.getFieldValue('userName'), form.getFieldValue('password'));
    if (isNotBlank(success.errorMsg)) {
      message.error(success.errorMsg);
    } else {
      message.success("Test successfully");
    }
  }

  // eslint-disable-next-line no-unused-vars
  const syncDataToRootNode = (e) => {
    const kvs = [];
    kvs.push({ key: 'dbName', val: form.getFieldValue('dbName') });
    kvs.push({ key: 'URL', val: form.getFieldValue('URL') });
    kvs.push({ key: 'userName', val: form.getFieldValue('userName') });
    kvs.push({ key: 'password', val: form.getFieldValue('password') });
    props.syncData(kvs);
    props.onRef(form);
  }

  const parseHostAndPortFromURL = async (e) => {
    form.setFieldsValue({ 'dbUrl': '' });
    form.setFieldsValue({ 'dbPort': '' });
    let val = e.target.value;
    form.setFieldsValue({ 'URL': val });
    const idx = val.lastIndexOf("?");
    if (idx >= 0) {
      val = val.substring(0, idx);
    }

    const spliterLeft = val.indexOf("//");
    if (spliterLeft >= 0) {

      val = val.substring(spliterLeft + 2);
      const spliterRight = val.lastIndexOf(":");

      const dbIdx = val.lastIndexOf("/");
      if (dbIdx > spliterRight) {
        const db = val.substring(dbIdx + 1);
        form.setFieldsValue({ 'db': db });
        val = val.substring(0, dbIdx);
      } else {
        form.setFieldsValue({ 'db': '' });
      }

      const port = val.substring(spliterRight + 1);
      const host = val.substring(0, spliterRight);

      form.setFieldsValue({ 'dbUrl': host });

      if (port.length > 0 && parseInt(port, 10).toString() !== "NaN") {
        form.setFieldsValue({ 'dbPort': port });
      } else {
        form.setFieldsValue({ 'dbPort': '' });
        form.setFieldsValue({ 'dbUrl': val });
      }
    } else {
      form.setFieldsValue({ 'dbUrl': '' });
    }

    syncDataToRootNode(e);
  }

  const generateConnectionURL = async (e, comp) => {
    let connUrl = urlRoot;
    if (comp === 'dbUrl') {
      connUrl = connUrl.concat(e.target.value, ':', form.getFieldValue('dbPort'), '/', form.getFieldValue('db'));
    } else if (comp === 'dbPort') {
      connUrl = connUrl.concat(form.getFieldValue('dbUrl'), ':', e.target.value, '/', form.getFieldValue('db'));
    } else {
      connUrl = connUrl.concat(form.getFieldValue('dbUrl'), ':', form.getFieldValue('dbPort'), '/', e.target.value);
    }

    form.setFieldsValue({ 'URL': connUrl });
    syncDataToRootNode(e);
  }

  return (
    <Form form={form} requiredMark={true} required={true} >
      <Form.Item name="dbName" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
        <Input id="dbName" maxLength={255} onChange={syncDataToRootNode}></Input>
      </Form.Item >
      <Input.Group >
        <Row gutter={32}>
          <Col span={18}>
            <Form.Item name="dbUrl" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
              <Input id="dbUrl" maxLength={255} onChange={(e) => { generateConnectionURL(e, 'dbUrl') }}></Input>
            </Form.Item >
          </Col>
          <Col span={6}>
            <Form.Item name="dbPort" label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.port', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]} initialValue={defaultPort}>
              <Input id="dbPort" maxLength={255} onChange={(e) => { generateConnectionURL(e, 'dbPort') }}></Input>
            </Form.Item >
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={18}>
            <Form.Item name="db" label={intl.formatMessage({ id: 'pages.interfaceTest.db', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]} initialValue={''}>
              <Input id="db" maxLength={255} onChange={(e) => { generateConnectionURL(e, 'db') }}></Input>
            </Form.Item >
          </Col>
        </Row>
        <Form.Item name="URL" label="URL">
          <Input id="URL" maxLength={255} defaultValue={urlRoot} onChange={(e) => { parseHostAndPortFromURL(e) }}></Input>
        </Form.Item >
      </Input.Group>
      <Form.Item name="userName" label={intl.formatMessage({ id: 'pages.interfaceTest.db.connection.username', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
        <Input id="userName" maxLength={255} onChange={syncDataToRootNode}></Input>
      </Form.Item >
      <Form.Item name="password" label={intl.formatMessage({ id: 'pages.interfaceTest.db.connection.password', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
        <Input.Password placeholder="input password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={syncDataToRootNode} />
      </Form.Item >
      <Button key="button" icon={<PlusOutlined />} type="primary" onClick={dbConnTest}>
        {intl.formatMessage({ id: 'pages.interfaceTest.apis.connection.test', })}
      </Button>
    </Form>
  );
};

export default MySQL;