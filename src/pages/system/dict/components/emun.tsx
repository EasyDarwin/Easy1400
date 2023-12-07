import { DelDictData, FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import AddDictDataView from './DictDataForm';

interface AddTypeRef {
  toggleOpen: () => void;
  setFieldsValue: (v: any) => void;
}

export const DictEmun: React.FC<{ code: string }> = ({ code }) => {
  const columns: ColumnsType<Dict.DataItem> = [
    {
      title: '标签',
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      align: 'center',
      render: (text) => {
        return (
          <Tag color={text == true ? 'green' : 'red'}>
            {text == true ? '开启' : '关闭'}
          </Tag>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'remark',
      align: 'center',
      render: (text) => (text != '' ? text : <span>&ndash;</span>),
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      width: 150,
      align: 'center',
      render: (value, record: Dict.DataItem, index) => {
        return (
          <div>
            <Space>
              <Tooltip title="编辑">
                <Button
                  onClick={() => onEditDict(record)}
                  disabled={record.is_default}
                  icon={<EditOutlined />}
                ></Button>
              </Tooltip>

              <Popconfirm
                title={
                  <span>
                    确定要删除
                    <span style={{ color: 'red' }}> {record.label} </span>
                    吗?
                  </span>
                }
                description={'删除后不可恢复'}
                onConfirm={() => onDeleteDict(record.id)}
              >
                <Button
                  disabled={record.is_default}
                  danger
                  icon={<DeleteOutlined />}
                ></Button>
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];

  const addDictRef = useRef<AddTypeRef>(null);
  const [dataSource, setDataSource] = useState<Dict.DataItem[]>();
  const [fromTitle, setFromTitle] = useState<string>('新增字典');

  useEffect(() => {
    getDictData();
  }, [code]);

  //获取字典列表数据
  const getDictData = () => {
    FindDictDatas(code)
      .then((res) => {
        setDataSource([...res.data.items]);
      })
      .catch((err) => ErrorHandle(err));
  };

  //点击添加数据按钮
  const onAddData = () => {
    setFromTitle('新增字典');
    addDictRef.current?.setFieldsValue({ code: code });
    addDictRef.current?.toggleOpen();
  };

  //点击修改按钮
  const onEditDict = (value: Dict.DataItem) => {
    setFromTitle('编辑字典');
    addDictRef.current?.setFieldsValue({ ...value });
    addDictRef.current?.toggleOpen();
  };

  //点击删除按钮
  const onDeleteDict = (id: string) => {
    DelDictData(id)
      .then((res) => {
        getDictData();
        message.success('删除成功');
      })
      .catch((error) => ErrorHandle(error));
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <Button type="primary" onClick={onAddData}>
        添加数据
      </Button>
      <div style={{ height: '10px' }}></div>
      <Table
        // bordered
        rowKey={'id'}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
        }}
      />
      <AddDictDataView
        title={fromTitle}
        refresh={getDictData}
        ref={addDictRef}
      />
    </div>
  );
};
