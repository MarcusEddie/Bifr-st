import { PageContainer } from '@ant-design/pro-layout';
// import { Input } from 'antd';
import { history } from 'umi';

const tabList = [
  {
    key: 'mindMap',
    tab: '脑图模式',
  },
  {
    key: 'single',
    tab: '手工模式',
  },
];

const caseMaintain = (props) => {
  const handleTabChange = (key) => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;

    switch (key) {
      case 'mindMap':
        history.push(`${url}/mindMap`);
        break;

      case 'single':
        history.push(`${url}/single`);
        break;

      default:
        break;
    }
  };

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');

    if (tabKey && tabKey !== '/') {
      return tabKey;
    }

    return 'mindMap';
  };

  return (
    <PageContainer
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
        </div>
      }
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {props.children}
    </PageContainer>
  );
};

export default caseMaintain;
