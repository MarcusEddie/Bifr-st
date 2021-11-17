import React from 'react';
import { Modal, Card } from 'antd';
import GeneralCaseInfo from './GeneralCaseInfo';
import UiTestCaseInfo from './UiTestCaseInfo';
import { useIntl } from 'umi';

const ViewForm = (props) => {
  const [activeTapKey, setActiveTapKey] = React.useState('generalCaseInfo');
  const intl = useIntl();

  const tabListNoTitle = [
    {
      key: 'generalCaseInfo',
      tab: intl.formatMessage({ id: 'pages.caseMaintain.name', }),
    },
    {
      key: 'apiTestCaseInfo',
      tab: intl.formatMessage({ id: 'pages.uiTest.name', }),
    },
  ];

  const renderInfoBlockByTabKey = (tabValue) => {
    if (tabValue === 'generalCaseInfo') {
      return <GeneralCaseInfo values={props.generalCase || []} />;
    }

    if (tabValue === 'apiTestCaseInfo') {
      return <UiTestCaseInfo values={props.values || {}} />;
    }

    return null;
  };

  return (
    <Modal
      title={`${intl.formatMessage({ id: 'pages.caseMaintain.dashboard.actions.view', })}${intl.formatMessage({ id: 'pages.uiTest.dashboard.action.viewDetails', })}`}
      width="700px"
      visible={props.viewModalVisible}
      onCancel={() => {
        setActiveTapKey('generalCaseInfo');
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
