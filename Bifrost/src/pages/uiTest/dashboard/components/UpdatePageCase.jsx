
import { ProFormSelect, StepsForm, ProFormTextArea } from '@ant-design/pro-form';
import React, { useState, useRef } from 'react';
import { Select, Form, Input, message, Descriptions } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';
import { getCasePriority } from '@/services/backend/generalApis';
import { updateUiTestCaseDetails } from '@/services/backend/uiTest';

const UpdatePageCase = (props) => {

  const { rowSelected } = props;
  const intl = useIntl();
  const [current, setCurrent] = useState(0);
  const formRef = useRef();

  function parseJsonArray(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat('&nbsp;');
      if (i < space - 3) {
        blockSpace = blockSpace.concat('&nbsp;');
      }
    }
    let dataJson = '[<br/>';
    for (let i = 0; i < data.length; i += 1) {
      let item = '';
      if (Array.isArray(data[i])) {
        item = parseJsonArray(data[i], space + 2);
      } else if (typeof data[i] === 'object') {
        // eslint-disable-next-line no-use-before-define
        item = parseJsonObj(data[i], space + 2);
      } else if (typeof data[i] === 'string') {
        item = item.concat('"', data[i], '"');
      }
      if (i < data.length - 1) {
        dataJson = dataJson.concat(itemSpace, item, ',<br/>');
      } else {
        dataJson = dataJson.concat(itemSpace, item, '<br/>');
      }
    }

    dataJson = dataJson.concat(blockSpace, ']');

    return dataJson;

  }

  function parseJsonObj(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat('&nbsp;');
      if (i < space - 3) {
        blockSpace = blockSpace.concat('&nbsp;');
      }
    }
    let dataJson = '{<br/>';
    const keys = Object.keys(data);
    let suffix = ', <br/>';
    for (let i = 0; i < keys.length; i += 1) {
      if (i === keys.length - 1) {
        suffix = '<br/>';
      }

      if (Array.isArray(data[keys[i]])) {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": ', parseJsonArray(data[keys[i]], space + 2), suffix);
      } else if (typeof data[keys[i]] === 'object') {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": ', parseJsonObj(data[keys[i]], space + 2), suffix);
      } else if (typeof data[keys[i]] === 'string') {
        dataJson = dataJson.concat(itemSpace, '"', keys[i], '": "', data[keys[i]], '"', suffix);
      }
    }

    dataJson = dataJson.concat(blockSpace, '}');

    return dataJson;
  }

  const toNextStep = async () => {
    return true;
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

  const handleUpdateCaseSubmit = async (values) => {

    const rs = await updateUiTestCaseDetails(values, rowSelected.values.id);
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
        const success = await handleUpdateCaseSubmit(values);

        if (success) {
          props.onSubmit();
          return true;
        }
        return false;
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        title={intl.formatMessage({ id: 'pages.uiTest.create.page.header.update', })}
        // eslint-disable-next-line no-unused-vars
        onFinish={async (values) => {
          const success = await toNextStep();
          if (success) {
            return true;
          }
          return false;
        }}
        style={{ height: 750 }}
      >
        <Form.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })}>
          <Select defaultValue={rowSelected.values.page.name} disabled={true}></Select>
        </Form.Item >
        <Descriptions column={1} bordered={true} size={'small'}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.name', })} key={`${rowSelected.values.page}_Name`}> {rowSelected.values.page.name}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.url', })} key={`${rowSelected.values.page}_Url`}> {rowSelected.values.page.url}</Descriptions.Item>
        </Descriptions>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.steps.update', })} style={{ height: 750 }}
        initialValues={{
          caseName: rowSelected.values.name,
          caseSteps: rowSelected.values.steps,
          caseParams: rowSelected.values.parameters,
          casePriority: rowSelected.values.priority,
        }}
      >
        <Form.Item name="caseName" label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.name', })} required={true} rules={[{ required: true, message: 'Please select your function!' }]}>
          <Input id="caseName" maxLength={255}></Input>
        </Form.Item >
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
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step', })} name="caseSteps" id="caseSteps" rules={[{ required: true, message: '请输入您的所在省!', },]}
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        ></ProFormTextArea>
        <ProFormTextArea label={intl.formatMessage({ id: 'pages.caseMaintain.create.case.step.params', })} name="caseParams" id="caseParams"
          fieldProps={{ maxLength: 5000, autoSize: { minRows: 10, maxRows: 10 }, showCount: true, allowClear: true }}
        >
        </ProFormTextArea>
      </StepsForm.StepForm>
      <StepsForm.StepForm title={intl.formatMessage({ id: 'pages.interfaceTest.create.case.rs.update', })} style={{ height: 750 }}>
        <Form.Item name="caseResult" label={intl.formatMessage({ id: 'pages.interfaceTest.create.case.result', })} rules={[{ required: true, message: 'Please select your function!' }]}>
          <ProFormTextArea name="caseResult" id="caseResult" fieldProps={{ maxLength: 5000, autoSize: { minRows: 8, maxRows: 8 }, showCount: true, allowClear: true }} initialValue={rowSelected.values.expectedResult}
          ></ProFormTextArea>
        </Form.Item>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdatePageCase;