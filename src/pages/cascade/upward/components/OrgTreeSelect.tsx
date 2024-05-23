import React, { useEffect, useState, forwardRef, useImperativeHandle, Children } from 'react';
import { TreeSelect } from 'antd';
import { GetGroupList } from '@/services/http/groups';
import { AxiosResponse } from 'axios';

interface OrgTreeProps {
  label?: any;
  value?: any;
  parentId?: any;
  onChange?: (id: any, info?: Group.GroupItem) => void;
}

const OrgTree: React.FC<OrgTreeProps> = forwardRef(({ label, value, parentId, onChange }) => {
  const [val, setVal] = useState<any>(value)
  const [treeData, setTreeData] = useState<any[]>([]);

  // 查询虚拟组织下拉列表数据
  useEffect(() => {
    GetGroupList('0').then((res: AxiosResponse) => {
      const data = res.data.map((el: any, i: number) => ({ ...el, _index: i, children: [] }))
      if (!value) {
        const first = data[0]?.id
        setVal(first)
      }
      setTreeData(data)
    })
  }, [])

  // useEffect(() => {
  //   setVal(+value)
  // }, [value])

  /**
  * 平铺数据转树
  * @param { Array } data 数组
  * @param { String } pid 父Id
  */
  const listToTree = (data: any, pid: any) => {
    const result = [] as any;
    data.forEach((item: any) => {
      if (item.pid === pid) {
        const children = listToTree(data, item.id);
        if (children.length) {
            item.children = children;
        }
        result.push(item);
      }
    });
    return result;
  }
  const onSelect = (v: any) => {
    setVal(v)
    onChange?.(v)
  }

  // const onLoadData = (node?: any) =>
  //     new Promise<void>((resolve) => {
  //       if (node?.pid !== 0 || node?.children?.length) return
  //       GetGroupTree(node.id).then(res => {
  //         let data = res?.data || []
  //         data = listToTree(data, node.id);
  //         node.children = data
  //         treeData[node._index].children = data
  //         setTreeData([...treeData])
  //         resolve();
  //       })
  //    });

    //  loadData={onLoadData}
  return (
    <TreeSelect
      placeholder={'请选择' + label}
      treeDefaultExpandAll
      className="w-full"
      value={val}
      treeData={treeData}
      fieldNames={{ label: 'name', value: 'id' }}
      onChange={onSelect}
    />
  )
})

export default OrgTree
