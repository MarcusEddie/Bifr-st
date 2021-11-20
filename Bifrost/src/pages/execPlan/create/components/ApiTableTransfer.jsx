import { Transfer, Switch, Table, Tag, Divider } from 'antd';
import difference from 'lodash/difference';
import React from 'react';
import { useIntl } from 'umi';

// Customize Table Transfer
const TransferC = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} pagination={{ pageSize: 20, showSizeChanger: true, showQuickJumper: true, }}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const priorityFlag = new Map();
priorityFlag.set('P1', 'red');
priorityFlag.set('P2', 'yellow');
priorityFlag.set('P3', 'blue');
priorityFlag.set('P4', 'green');
// const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 20,
    ellipsis: false,
    fixed: 'left',
    hideInSearch: true,
  },
  {
    title: 'name',
    width: 40,
    dataIndex: 'name',
    hideInSearch: true,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: 'priority',
    width: 30,
    dataIndex: 'priority',
    hideInSearch: true,
    fixed: 'left',
    render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
  },
  {
    title: 'generalCaseName',
    width: 50,
    dataIndex: 'generalCaseName',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: 'appName',
    dataIndex: 'appName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'moduleName',
    dataIndex: 'moduleName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'functionName',
    dataIndex: 'functionName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'apiName',
    width: 50,
    dataIndex: 'apiName',
    hideInSearch: true,
    ellipsis: true,
  },
];
const rightTableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 20,
    ellipsis: false,
    fixed: 'left',
    hideInSearch: true,
  },
  {
    title: 'name',
    width: 40,
    dataIndex: 'name',
    hideInSearch: true,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: 'priority',
    width: 30,
    dataIndex: 'priority',
    hideInSearch: true,
    fixed: 'left',
    render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
  },
  {
    title: 'generalCaseName',
    width: 50,
    dataIndex: 'generalCaseName',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: 'appName',
    dataIndex: 'appName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'moduleName',
    dataIndex: 'moduleName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'functionName',
    dataIndex: 'functionName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: 'apiName',
    width: 50,
    dataIndex: 'apiName',
    hideInSearch: true,
    ellipsis: true,
  },
];

const ApiTableTransfer = (props) => {
  const intl = useIntl();
  const [showSearch, setShowSearch] = React.useState(false);
  const [targetKeys, setTargetKeys] = React.useState(props.originTargetKeys);

  const triggerShowSearch = async (value) => {
    setShowSearch(value);
  }

  const onChange = async (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    props.saveCases(nextTargetKeys);
  }

  return (
    <>
      <Divider
        style={{
          margin: '24px 0',
        }}
      />
      <Switch
        unCheckedChildren="showSearch"
        checkedChildren="showSearch"
        checked={showSearch}
        onChange={triggerShowSearch}
        style={{ marginTop: 16 }}
      />
      <TransferC
        dataSource={props.data}
        targetKeys={targetKeys}
        titles={[intl.formatMessage({ id: 'pages.execPlan.create.dataSource.source', }), intl.formatMessage({ id: 'pages.execPlan.create.dataSource.dest', })]}
        disabled={false}
        showSearch={showSearch}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.name.indexOf(inputValue) !== -1 || item.generalCaseName.indexOf(inputValue) !== -1
        }
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </>
  );
};

export default ApiTableTransfer;