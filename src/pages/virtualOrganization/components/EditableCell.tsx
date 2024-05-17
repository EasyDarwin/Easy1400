import { useQueryClient, useMutation } from '@umijs/max';
import React, { useState } from 'react';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Button, Space, message } from 'antd';
import { getGroupDeviceListPage, SaveGroupDevice } from '@/services/http/groups';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';

interface Item {
  id: string;
  name: string;
  num?: string;
  channel?: string;
  virtual_ape_id: string;
  is_online?: string;
  parent_id?: string;
}
interface EditableCellProps {
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  onRefresh: () => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  children,
  dataIndex,
  record,
  onRefresh,
}) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('')
  const [addon, setAddon] = useState<string>()

  const onSave = () => {
    if (!/\d{12}/g.test(value)) {
      message.warning('级联码格式不正确，请输入12位数字')
      return
    }
    setLoading(true)
    SaveGroupDevice({ id: record.id, virtual_ape_id: value, parent_id: record.parent_id }).then((res: AxiosResponse) => {
      setEditing(!editing)
      message.success('级联码修改成功');
      queryClient.invalidateQueries([getGroupDeviceListPage])
    }).catch(err => {
      ErrorHandle(err);
    }).finally(() => {
      setLoading(false)
    })
  };

  const onToggle = () => {
    const v = !editing
    const val = record[dataIndex] as string
    setEditing(v)
    setAddon(val.slice(0, 8))
    setValue(v ? val.slice(8) : '')
  }

  return editing ? (
    <Space>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value}
          defaultValue={record[dataIndex]}
          onPressEnter={onSave}
          addonBefore={addon}
          // showCount
          onChange={(e: any) => {
            setValue(e.target.value)
          }}
        />
        <Button type="primary" loading={loading} onClick={onSave}>
          {/* 确认 */}
          <CheckOutlined />
        </Button>
        <Button type="primary" ghost onClick={onToggle}>
          {/* 取消 */}
          <CloseOutlined />
        </Button>
      </Space.Compact>
    </Space>
  ) : (
    <span>
      {children}
      <Button type="dashed" className='ml-[4px]' disabled={!record[dataIndex]} icon={<EditOutlined />} onClick={onToggle} />
    </span>
  )
}

export default EditableCell