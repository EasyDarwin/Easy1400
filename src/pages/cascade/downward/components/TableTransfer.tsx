import { FindCascadeLists, getCascades, EditSelectDevice } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Form, Tag, Modal, Transfer, Typography, Table, message, Pagination } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import '../style.less'

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: Cascade.Item[];
  // leftColumns: TableColumnsType<Cascade.Item>;
  // rightColumns: TableColumnsType<Cascade.Item>;
}

const CascadeFrom: React.FC<{
  ref: any;
  loading: boolean;
}> = forwardRef(({ ref, ...restProps }) => {
  useImperativeHandle(ref, () => ({}))

  const columns: TableColumnsType<Cascade.Item> = [
    { title: '平台ID', dataIndex: 'id', align: 'center', width: 150, ellipsis: true },
    { title: '平台名称', dataIndex: 'name', align: 'center', width: 150, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <Tag color={text == 'OK' ? 'green' : 'red'}>
          {text == 'OK' ? '在线' : '离线'}
        </Tag>
      ),
    },
  ]

  return (
    <Transfer {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys: any[]) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };
        // const pager = {
        //   showSizeChanger: true,
        //   current: params.page,
        //   pageSize: params.size,
        //   total: cascadeData?.total,
        //   onChange: (num: number, size: number) => {
        //     setParams({ ...params, page: num, size })
        //   },
        //   showTotal: (v: number) => `共 ${v} 条`,
        //   pageSizeOptions: [10, 30, 50, 100]
        // }

        return (
          <Table
            rowKey="id"
            size="small"
            className="cust-table"
            rowSelection={rowSelection}
            dataSource={filteredItems}
            scroll={{ x: '100%', y: 460 }}
            loading={direction === 'left' ? restProps.loading : false}
            columns={columns}
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            // pagination
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  )
})

export default CascadeFrom