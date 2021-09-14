import React, { useEffect, useState } from 'react';
import ProTable from '@ant-design/pro-table';

const ExecutionDetails = (props) => {
  // const { ip } = props;
  const [tableListDataSource, setTableListDataSource] = useState([]);
  const columns = [
    {
      title: '时间点',
      key: 'createdAt',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '代码',
      key: 'code',
      width: 80,
      dataIndex: 'code',
      valueType: 'code',
    },
    {
      title: '操作',
      key: 'option',
      width: 80,
      valueType: 'option',
      render: () => [<a key="a">预警</a>],
    },
  ];
  useEffect(() => {
    const source = [];
    // for (let i = 0; i < 15; i += 1) {
    //   source.push({
    //     createdAt: Date.now() - Math.floor(Math.random() * 10000),
    //     code: `const getData = async params => {
    //       const data = await getData(params);
    //       return { list: data.data, ...data };
    //     };`,
    //     key: i,
    //   });
    // }
    setTableListDataSource(source);
  }, []);
  return (
    <ProTable columns={columns} dataSource={tableListDataSource}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      rowKey="key"
      search={false}
      scroll={{y: 650 }}
      toolBarRender={false}
    />
  );
};

export default ExecutionDetails;