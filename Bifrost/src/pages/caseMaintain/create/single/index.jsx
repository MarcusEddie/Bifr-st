import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row } from 'antd';
import { useIntl } from 'umi';
import styles from './style.less';

const SingleForm = (props) => {
  const intl = useIntl();

  const onFinish = async (values) => {
    run(values);
  };

  return (
    <PageContainer content={intl.formatMessage({
      id: 'pages.caseMaintain.create.single.headerDescription',
    })}
    >
      <Card title={intl.formatMessage({
                id: 'pages.caseMaintain.create.single.funcFetch',
              })} className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label={intl.formatMessage({
                id: 'pages.caseMaintain.create.single.system',
              })}
              width="md"
              name="system"
              valueEnum={{
                'userMgt': 'yong hu guan li',
                'adsDelivery': 'guang gao toufang guan li',
                'goodsMgt': 'shang pin guan li',
                'orderMgt': 'ding dan guan li',
                'payMgt': 'zhi fu guan li',
              }}
            />
          </Col>
          <Col
            xl={{
              span: 6,
              offset: 2,
            }}
            lg={{
              span: 8,
            }}
            md={{
              span: 12,
            }}
            sm={24}
          >
            <ProFormSelect
              label={intl.formatMessage({
                id: 'pages.caseMaintain.create.single.module',
              })}
              width="md"
              name="module"
              valueEnum={{
                'userMgt': 'yong hu mo kuai',
                'adsDelivery': 'guang gao toufang mo kuai',
                'goodsMgt': 'shang pin mo kuai',
                'orderMgt': 'ding dan mo kuai',
                'payMgt': 'zhi fu mo kuai',
              }}
            />
          </Col>
          <Col
            xl={{
              span: 6,
              offset: 2,
            }}
            lg={{
              span: 10,
            }}
            md={{
              span: 24,
            }}
            sm={24}
          >
            <ProFormSelect
              label={intl.formatMessage({
                id: 'pages.caseMaintain.create.single.function',
              })}
              width="md"
              name="function"
              valueEnum={{
                'userMgt': 'yong hu gong neng',
                'adsDelivery': 'guang gao toufang gong neng',
                'goodsMgt': 'shang pin gong neng',
                'orderMgt': 'ding dan gong neng',
                'payMgt': 'zhi fu  gong neng',
              }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                // handleModalVisible(true);
              }}
            >
              <PlusOutlined /> {intl.formatMessage({
                id: 'pages.caseMaintain.action.new',
              })}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                // handleModalVisible(true);
              }}
            >
              <DeleteOutlined /> {intl.formatMessage({
                id: 'pages.caseMaintain.action.delete',
              })}
            </Button>
          </Col>
        </Row>
      </Card>
      <Card
        style={{
          marginTop: 24,
        }}
        bordered={false}
        bodyStyle={{
          padding: '8px 32px 32px 32px',
        }}>
        <ProForm hideRequiredMark style={{ margin: 'auto', marginTop: 8, maxWidth: 600, }}
          name="pages.caseMaintain.create.single.formName"
          layout="vertical"
          initialValue={{ public: '1', }}
          onFinish={onFinish}
        >
          <ProFormSelect
            label={intl.formatMessage({
              id: 'pages.caseMaintain.create.single.system',
            })}
            width="md"
            name="system"
            rules={[
              {
                required: true,
                message: '请选择xi tong',
              },
            ]}
            valueEnum={{
              'userMgt': 'yong hu guan li',
              'adsDelivery': 'guang gao toufang guan li',
              'goodsMgt': 'shang pin guan li',
              'orderMgt': 'ding dan guan li',
              'payMgt': 'zhi fu guan li',
            }}
          />

          <ProFormSelect
            label={intl.formatMessage({
              id: 'pages.caseMaintain.create.single.module',
            })}
            width="md"
            name="module"
            rules={[
              {
                required: true,
                message: '请选择mo kuai',
              },
            ]}
            valueEnum={{
              'userMgt': 'yong hu mo kuai',
              'adsDelivery': 'guang gao toufang mo kuai',
              'goodsMgt': 'shang pin mo kuai',
              'orderMgt': 'ding dan mo kuai',
              'payMgt': 'zhi fu mo kuai',
            }}
          />

          <ProFormSelect
            label={intl.formatMessage({
              id: 'pages.caseMaintain.create.single.function',
            })}
            width="md"
            name="function"
            rules={[
              {
                required: true,
                message: '请选择gong neng',
              },
            ]}
            valueEnum={{
              'userMgt': 'yong hu gong neng',
              'adsDelivery': 'guang gao toufang gong neng',
              'goodsMgt': 'shang pin gong neng',
              'orderMgt': 'ding dan gong neng',
              'payMgt': 'zhi fu  gong neng',
            }}
          />

        </ProForm>
      </Card>
      {props.children}
    </PageContainer>
  );
};

export default SingleForm;
