import { DelDictType, findDictTypes } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { useQueryClient } from '@umijs/max';
import { Button, Menu, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import AddTypeView from './DictTypeForm';

interface AddTypeRef {
  toggleOpen: () => void;
  editFrom: (name: string) => void;
}

interface EditTypeRef {
  setFieldsWithModal: () => void;
}

export const DictType: React.FC<{
  data: Dict.TypeItem[];
  code: string;
  id: string;
  onChangeCode: (key: string) => any;
}> = ({ data, code, onChangeCode, id }) => {
  const addTypeRef = useRef<AddTypeRef>(null);
  const editTypeRef = useRef<EditTypeRef>(null);
  const query = useQueryClient();
  const [editOpen, setEditOption] = useState(false);

  //点击添加 显示表单
  const onClickAdd = () => {
    addTypeRef.current?.toggleOpen();
  };

  //点击编辑显示弹出框
  const editDictType = () => {
    if (!id) return message.warning('请选择一个字典类型');
    const name = data.find((item) => item.id == id)!.name;
    addTypeRef.current?.editFrom(name);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        // height: "100px",
        padding: '10px',
        marginRight: '10px',
      }}
    >
      <AddTypeView id={id} ref={addTypeRef} />
      {/* <EditDictType ref={editTypeRef} /> */}
      <Button.Group>
        <Button type="primary" onClick={onClickAdd}>
          添加
        </Button>
        <Button
          type="primary"
          disabled={data.findLast((v) => v.code === code)?.is_default}
          onClick={editDictType}
        >
          编辑
        </Button>
        <Popconfirm
          title={
            <span>
              确定删除<span style={{ color: 'red' }}> {code} </span>吗?
            </span>
          }
          description="将会清空该类型所有数据"
          onConfirm={() =>
            DelDictType(id)
              .then((res) => {
                query.invalidateQueries([findDictTypes]); //刷新字典类型列表
                message.success('删除成功');
              })
              .catch((err) => ErrorHandle(err))
          }
        >
          <Button
            disabled={data.findLast((v) => v.code === code)?.is_default}
            type="primary"
            danger
          >
            删除
          </Button>
        </Popconfirm>
      </Button.Group>

      <Menu
        mode="vertical"
        style={{ border: 'none', marginTop: '10px' }}
        onClick={(info) => onChangeCode(info.key)}
        selectedKeys={[code]}
        items={data.map((v) => {
          let code = v.code;
          return {
            label: (
              <div>
                {v.name}{' '}
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {v.code}
                </span>{' '}
              </div>
            ),
            key: v.code,
          };
        })}
      />
    </div>
  );
};
