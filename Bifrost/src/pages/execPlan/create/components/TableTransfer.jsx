import { Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';
import React from 'react';

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


const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 4 === 0,
  });
}

const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

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
    // render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
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
    // render: (_, record) => { return (record.api.moduleName) }
  },
  {
    title: 'moduleName',
    dataIndex: 'moduleName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
    // render: (_, record) => { return (record.api.moduleName) }
  },
  {
    title: 'functionName',
    dataIndex: 'functionName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
    // render: (_, record) => { return (record.api.functionName) }
  },
  {
    title: 'apiName',
    width: 50,
    dataIndex: 'apiName',
    hideInSearch: true,
    ellipsis: true,
    // render: (_, record)/ => { return (record.api.name) }
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
    // render: (_, record) => <Tag color={priorityFlag.get(record.priority)}>{record.priority}</Tag>,
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
    // render: (_, record) => { return (record.api.moduleName) }
  },
  {
    title: 'moduleName',
    dataIndex: 'moduleName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
    // render: (_, record) => { return (record.api.moduleName) }
  },
  {
    title: 'functionName',
    dataIndex: 'functionName',
    width: 50,
    ellipsis: true,
    hideInSearch: true,
    // render: (_, record) => { return (record.api.functionName) }
  },
  {
    title: 'apiName',
    width: 50,
    dataIndex: 'apiName',
    hideInSearch: true,
    ellipsis: true,
    // render: (_, record)/ => { return (record.api.name) }
  },
];

class TableTransfer extends React.Component {
  state = {
    targetKeys: originTargetKeys,
    disabled: false,
    showSearch: false,
  };

  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  triggerShowSearch = showSearch => {
    this.setState({ showSearch });
  };

  render() {
    const { targetKeys, disabled, showSearch } = this.state;
    return (
      <>
        <TransferC
          dataSource={mockData}
          targetKeys={targetKeys}
          disabled={disabled}
          showSearch={showSearch}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
        <Switch
          unCheckedChildren="showSearch"
          checkedChildren="showSearch"
          checked={showSearch}
          onChange={this.triggerShowSearch}
          style={{ marginTop: 16 }}
        />
      </>
    );
  }
}

export default TableTransfer;