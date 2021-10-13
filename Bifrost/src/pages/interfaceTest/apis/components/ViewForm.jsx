import React from 'react';
import { Modal, Card } from 'antd';
import HeaderDetails from './HeaderDetails';
import GeneralCaseInfo from './GeneralCaseInfo';
import { useIntl } from 'umi';

const ViewForm = (props) => {
  const [activeTapKey, setActiveTapKey] = React.useState('headersDetails');
  const intl = useIntl();

  const tabListNoTitle = [
    {
      key: 'headersDetails',
      tab: intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', }),
    },
    {
      key: 'argumentsAndResponse',
      tab: intl.formatMessage({ id: 'pages.interfaceTest.apis.app.defination.interaction.format', }),
    },
  ];

  const parseApiArguments = (data) => {
    let argumentJson = 'N/A';
    if (data && data.arguments && data.arguments.length > 0) {
      argumentJson = '{';
      // eslint-disable-next-line no-unused-vars
      data.arguments.forEach(function func(value, key) {
        const keys = Object.keys(value);
        let paramKV = '';
        let typeVal = '';
        let requireVal = '';
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i].toString() === 'type') {
            typeVal = typeVal.concat('"type" : "', value[keys[i]], '"');
          } else if (keys[i].toString() === 'required') {
            requireVal = requireVal.concat('"required" : "', value[keys[i]], '"');
          } else {
            paramKV = paramKV.concat('"', keys[i], '" : "', value[keys[i]], '"')
          }
        }
        argumentJson = argumentJson.concat('\n    {', paramKV, ', ', typeVal, ', ', requireVal, '},');
      })
      argumentJson = argumentJson.substring(0, argumentJson.length - 1);
      argumentJson = argumentJson.concat('\n}');
    }

    return argumentJson;
  }

  function parseJsonArray(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat(' ');
      if (i < space - 3) {
        blockSpace = blockSpace.concat(' ');
      }
    }
    let dataJson = '[\n';
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
        dataJson = dataJson.concat(itemSpace, item, ',\n');
      } else {
        dataJson = dataJson.concat(itemSpace, item, '\n');
      }
    }

    dataJson = dataJson.concat(blockSpace, ']');

    return dataJson;

  }

  function parseJsonObj(data, space) {
    let itemSpace = '';
    let blockSpace = '';
    for (let i = 0; i < space; i += 1) {
      itemSpace = itemSpace.concat(' ');
      if (i < space - 3) {
        blockSpace = blockSpace.concat(' ');
      }
    }
    let dataJson = '{\n';
    const keys = Object.keys(data);
    let suffix = ', \n';
    for (let i = 0; i < keys.length; i += 1) {
      if (i === keys.length - 1) {
        suffix = '\n';
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

  const parseResponseData = (data) => {
    let dataJson = '';

    if (Array.isArray(data)) {
      dataJson = parseJsonArray(data, 8);
    } else if (typeof data === 'object') {
      dataJson = parseJsonObj(data, 8);
    }

    return dataJson;
  }

  const parseApiResponse = (data) => {
    let responseJson = 'N/A';
    if (data) {
      responseJson = '{';
      responseJson = responseJson.concat('\n    ', '"success" : "', data.success, '",');
      const dataJson = parseResponseData(data.data);
      responseJson = responseJson.concat('\n    ', '"data" : ', dataJson, ',');
      responseJson = responseJson.concat('\n    ', '"errorCode" : "', data.errorCode, '",');
      responseJson = responseJson.concat('\n    ', '"errorMsg" : "', data.errorMsg, '",');
      responseJson = responseJson.concat('\n    ', '"host" : "', data.host, '",');
      responseJson = responseJson.concat('\n    ', '"traceId" : "', data.traceId, '",');
      responseJson = responseJson.concat('\n    ', '"timeStamp" : "', data.timeStamp, '",');
      responseJson = responseJson.concat('\n    ', '"total" : "', data.total, '",');
      responseJson = responseJson.concat('\n    ', '"current" : "', data.current, '",');
      responseJson = responseJson.concat('\n    ', '"pageSize" : "', data.pageSize, '"');
      responseJson = responseJson.concat('\n}');
    }

    return responseJson;
  }

  const renderInfoBlockByTabKey = (tabValue) => {
    if (tabValue === 'headersDetails') {
      const apiHeaders = [];
      if (props && props.values && props.values.header && props.values.header.headers && props.values.header.headers.length > 0) {
        for (let i = 0; i < props.values.header.headers.length; i += 1) {
          const keys = Object.keys(props.values.header.headers[i]);
          apiHeaders.push({ headerName: keys[0], headerVal: props.values.header.headers[i][keys[0]] });
        }
      } else {
        apiHeaders.push({ headerName: '&nbsp;&nbsp;&nbsp;&nbsp;-', headerVal: '&nbsp;&nbsp;&nbsp;&nbsp;-' });
      }
      return <HeaderDetails apiHeaders={apiHeaders} height={670}></HeaderDetails>;
    }

    if (tabValue === 'argumentsAndResponse' && props.values) {
      const argumentsVal = parseApiArguments(props.values.arguments);
      const responseVal = parseApiResponse(props.values.response);
      return <GeneralCaseInfo arguments={argumentsVal} response={responseVal} />;
    }

    return null;
  };

  return (
    <Modal
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.details', })}`}
      width="700px"
      visible={props.viewModalVisible}
      onCancel={() => {
        setActiveTapKey('headersDetails');
        props.onCancel();
      }}
      destroyOnClose={true}
      footer={null}
    >
      <Card
        style={{ width: '100%', height: 800 }}
        tabList={tabListNoTitle}
        bordered={false}
        activeTabKey={activeTapKey}
        onTabChange={(key) => {
          setActiveTapKey(key);
        }}
      >
        {renderInfoBlockByTabKey(activeTapKey)}
      </Card>
    </Modal>
  );
};

export default ViewForm;
