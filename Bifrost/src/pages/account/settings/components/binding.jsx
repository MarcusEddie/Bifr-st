import { SlackSquareOutlined, CodepenOutlined, GithubOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React, { Fragment } from 'react';

const BindingView = () => {
  const getData = () => [
    {
      title: '绑定GitHub',
      actions: [<a key="Bind">绑定</a>],
      avatar: <GithubOutlined  className="alipay" />,
    },
    {
      title: '绑定Slack',
      actions: [<a key="Bind">绑定</a>],
      avatar: <SlackSquareOutlined className="alipay" />,
    },
    {
      title: '绑定CodePen',
      actions: [<a key="Bind">绑定</a>],
      avatar: <CodepenOutlined className="alipay" />,
    },
  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
