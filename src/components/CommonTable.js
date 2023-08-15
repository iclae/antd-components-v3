import React from 'react';
import { Table } from 'antd';

/**
 * @typedef {Object} TableProps
 * @property {Array} columns
 * @property {Array} dataSource
 * @property {string} rowKey
 * @property {boolean} loading
 * @property {Object} pagination
 * @property {Object} scroll
 * @property {boolean} bordered 是否显示边框
 * @property {'default' | 'middle' | 'small'} size
 */

/**
 *
 * @param {TableProps} props
 * @returns
 */
const CommonTable = props => {
  const {
    columns = [],
    dataSource = [],
    rowKey = 'id',
    loading,
    pagination,
    scroll = {},
    bordered = false,
    size = 'default',
  } = props;
  return (
    <Table
      size={size}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={pagination}
      scroll={scroll}
      bordered={bordered}
    />
  );
};

export default CommonTable;
